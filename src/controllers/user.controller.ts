import {
  repository,
} from '@loopback/repository';
import {genSalt, hash} from 'bcryptjs';
import {
  post,
  getModelSchemaRef,
  requestBody,
  response,
} from '@loopback/rest';
import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings,
  UserRepository,
  User,
} from '@loopback/authentication-jwt';
import {CredentialsRequestBody, CredentialsSchema, NewUserRequest} from '../constants/credential-request-body';


export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {
  }

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: CredentialsSchema,
        },
      },
    })
      newUserRequest: NewUserRequest,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    delete (newUserRequest as Partial<NewUserRequest>).password;
    const savedUser = await this.userRepository.create(newUserRequest);
    await this.userRepository.userCredentials(savedUser.id).create({password});
    return savedUser;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);
    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }
}