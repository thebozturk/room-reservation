import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  post,
  get,
  patch,
  getModelSchemaRef,
  requestBody,
  response, del,
} from '@loopback/rest';
import {Room, RoomRelations} from '../models';
import {ReservationRepository, RoomAvailabilityRepository, RoomRepository} from '../repositories';
import {param} from '@loopback/rest';
import {inject} from '@loopback/core';
import {RoomAvailabilityService} from '../services/is-room-available.service';
import {authenticate} from '@loopback/authentication';

export class RoomController {
  constructor(
    @repository(RoomRepository)
    public roomRepository: RoomRepository,

    @inject('services.RoomAvailabilityService')
    public roomAvailabilityService: RoomAvailabilityService,

    @repository(ReservationRepository)
    public reservationRepository: ReservationRepository,

    @repository(RoomAvailabilityRepository)
    public roomAvailabilityRepository: RoomAvailabilityRepository,
  ) {
  }

  @authenticate('jwt')
  @post('/rooms')
  @response(200, {
    description: 'Room model instance',
    content: {'application/json': {schema: getModelSchemaRef(Room)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Room, {
            title: 'NewRoom',

          }),
        },
      },
    })
      room: Room,
  ): Promise<Room> {
    return this.roomRepository.create(room);
  }

  @get('/rooms/{id}')
  @response(200, {
    description: 'Room model instance',
    content: {'application/json': {schema: getModelSchemaRef(Room)}},
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Room>,
  ): Promise<Room & RoomRelations> {
    return this.roomRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/rooms/{id}')
  @response(204, {
    description: 'Room PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Room, {partial: true}),
        },
      },
    })
      room: Room,
  ): Promise<string> {
    await this.roomRepository.updateById(id, room);
    return 'Room updated successfully'
  }

  @get('/rooms/available')
  @response(200, {
    description: 'Array of Room model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Room, {includeRelations: true}),
        },
      },
    },
  })
  async findAvailableRooms(
    @param.query.string('startDate') startDate: string,
    @param.query.string('endDate') endDate: string,
  ): Promise<Room[]> {
    return this.roomAvailabilityService.findAvailableRooms(startDate, endDate)
  }
  @authenticate('jwt')
  @del('/rooms/{id}')
  @response(204, {
    description: 'Room DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<string> {
    await this.roomRepository.deleteById(id);
    return 'Room deleted successfully'
  }

  @authenticate('jwt')
  @post('/rooms/{id}/available')
  @response(204, {
    description: 'Room PATCH success',
  })
  async makeAvailable(
    @param.path.string('id') id: string,
    @param.query.string('startDate') startDate: string,
    @param.query.string('endDate') endDate: string,
  ): Promise<string> {
    const reservation = await this.reservationRepository.findOne({
      where: {
        roomId: id,
        startDate: startDate,
        endDate: endDate,
      },
    });
    await this.reservationRepository.deleteById(reservation?.id as string);
    const roomAvailability = await this.roomAvailabilityRepository.findOne({
      where: {
        reservationId: reservation?.id,
      },
    });
    await this.roomAvailabilityRepository.deleteById(roomAvailability?.id as string)
    return `Room ${id} is available from ${startDate} to ${endDate}`
  }
}