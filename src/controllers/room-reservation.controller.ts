import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Room,
  Reservation,
} from '../models';
import {RoomRepository} from '../repositories';

export class RoomReservationController {
  constructor(
    @repository(RoomRepository) protected roomRepository: RoomRepository,
  ) { }

  @get('/rooms/{id}/reservations', {
    responses: {
      '200': {
        description: 'Array of Room has many Reservation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Reservation)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Reservation>,
  ): Promise<Reservation[]> {
    return this.roomRepository.reservations(id).find(filter);
  }

  @post('/rooms/{id}/reservations', {
    responses: {
      '200': {
        description: 'Room model instance',
        content: {'application/json': {schema: getModelSchemaRef(Reservation)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Room.prototype.roomNumber,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservation, {
            title: 'NewReservationInRoom',
            exclude: ['userId'],
            optional: ['roomId']
          }),
        },
      },
    }) reservation: Omit<Reservation, 'userId'>,
  ): Promise<Reservation> {
    return this.roomRepository.reservations(id).create(reservation);
  }

  @patch('/rooms/{id}/reservations', {
    responses: {
      '200': {
        description: 'Room.Reservation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservation, {partial: true}),
        },
      },
    })
    reservation: Partial<Reservation>,
    @param.query.object('where', getWhereSchemaFor(Reservation)) where?: Where<Reservation>,
  ): Promise<Count> {
    return this.roomRepository.reservations(id).patch(reservation, where);
  }

  @del('/rooms/{id}/reservations', {
    responses: {
      '200': {
        description: 'Room.Reservation DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Reservation)) where?: Where<Reservation>,
  ): Promise<Count> {
    return this.roomRepository.reservations(id).delete(where);
  }
}
