import {
  repository,
} from '@loopback/repository';
import {
  post,
  getModelSchemaRef,
  requestBody,
  response, del, param,
} from '@loopback/rest';
import {RoomAvailability} from '../models';
import {RoomAvailabilityRepository} from '../repositories';

export class RoomAvailabilityController {
  constructor(
    @repository(RoomAvailabilityRepository)
    public roomAvailabilityRepository : RoomAvailabilityRepository,
  ) {}

  @post('/room-availabilities')
  @response(200, {
    description: 'RoomAvailability model instance',
    content: {'application/json': {schema: getModelSchemaRef(RoomAvailability)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoomAvailability, {
            title: 'NewRoomAvailability',
            exclude: ['roomNumber'],
          }),
        },
      },
    })
    roomAvailability: Omit<RoomAvailability, 'id'>,
  ): Promise<RoomAvailability> {
    return this.roomAvailabilityRepository.create(roomAvailability);
  }

  @del('/room-availabilities/{id}')
  @response(204, {
    description: 'RoomAvailability DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<string> {
    await this.roomAvailabilityRepository.deleteById(id);
    return 'Room availability deleted successfully'
  }
}
