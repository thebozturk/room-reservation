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
  User,
  Reservation,
} from '../models';
import {LocalUserRepository} from '../repositories';

export class UserReservationController {
  constructor(
    @repository(LocalUserRepository) protected userRepository: LocalUserRepository,
  ) { }

  @get('/users/{id}/reservations', {
    responses: {
      '200': {
        description: 'Array of User has many Reservation',
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
    return this.userRepository.reservations(id).find(filter);
  }
}
