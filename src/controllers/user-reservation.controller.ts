import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
} from '@loopback/rest';
import {
  Reservation,
} from '../models';
import {LocalUserRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class UserReservationController {
  constructor(
    @repository(LocalUserRepository) protected userRepository: LocalUserRepository,
  ) { }

  @authenticate('jwt')
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
