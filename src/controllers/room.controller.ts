import {
  repository,
} from '@loopback/repository';
import {
  post,
  getModelSchemaRef,
  requestBody,
  response,
} from '@loopback/rest';
import {Room} from '../models';
import {RoomRepository} from '../repositories';

export class RoomController {
  constructor(
    @repository(RoomRepository)
    public roomRepository : RoomRepository,
  ) {}

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
}
