import {injectable} from '@loopback/core';
import {DataSource, repository} from '@loopback/repository';
import {RoomAvailabilityRepository} from '../repositories';
import {RoomRepository} from '../repositories';
import {inject} from '@loopback/context';
import {Room} from '../models';

@injectable()
export class RoomAvailabilityService {
  constructor(
    @repository(RoomAvailabilityRepository)
    public roomAvailabilityRepository: RoomAvailabilityRepository,

    @repository(RoomRepository)
    public roomRepository: RoomRepository,

    @inject('datasources.pg') private dataSource: DataSource
  ) {}

  async isRoomAvailable(roomId: string, startDate: string, endDate: string): Promise<boolean> {
    const existingReservations = await this.roomAvailabilityRepository.find({
      where: {
        roomNumber: roomId,
        // this is the query to check if the room is available
        and: [
          {startDate: {lte: endDate}},
          {endDate: {gte: startDate}},
        ],
      },
    });
    // if there are no reservations, the room is available
    return existingReservations.length === 0;
  }

  async findAvailableRooms(startDate: string, endDate: string): Promise<Room[]> {
    const unavailableRooms = await this.roomAvailabilityRepository.find({
      where: {
        or: [
          {startDate: {lte: startDate}},
          {endDate: {gte: endDate}},
        ],
      },
    });

    const unavailableRoomNumbers = unavailableRooms.map(ra => ra.roomNumber);

    const availableRooms = await this.roomRepository.find({
      where: {
        roomNumber: {nin: unavailableRoomNumbers},
      },
    });

    if (!availableRooms) {
      throw new Error('No rooms available for the given dates');
    }

    return availableRooms;
  }
}
