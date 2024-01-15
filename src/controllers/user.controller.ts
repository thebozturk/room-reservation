import {
  repository,
} from '@loopback/repository';
import {
  post,
  getModelSchemaRef,
  requestBody,
  response,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
  ) {}

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            
          }),
        },
      },
    })
    user: User,
  ): Promise<User> {
    return this.userRepository.create(user);
  }
}
