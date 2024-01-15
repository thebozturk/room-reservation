import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Reservation,
  Room,
} from '../models';
import {ReservationRepository} from '../repositories';

export class ReservationRoomController {
  constructor(
    @repository(ReservationRepository)
    public reservationRepository: ReservationRepository,
  ) { }

  @get('/reservations/{id}/room', {
    responses: {
      '200': {
        description: 'Room belonging to Reservation',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Room),
          },
        },
      },
    },
  })
  async getRoom(
    @param.path.string('id') id: typeof Reservation.prototype.userId,
  ): Promise<Room> {
    return this.reservationRepository.room(id);
  }
}
