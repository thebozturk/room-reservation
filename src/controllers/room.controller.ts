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
  response,
} from '@loopback/rest';
import {Room, RoomRelations} from '../models';
import {RoomRepository} from '../repositories';
import {param} from '@loopback/rest';
import {inject} from '@loopback/core';
import {RoomAvailabilityService} from '../services/is-room-available.service';

export class RoomController {
  constructor(
    @repository(RoomRepository)
    public roomRepository: RoomRepository,

    @inject('services.RoomAvailabilityService')
    public roomAvailabilityService: RoomAvailabilityService,
  ) {
  }

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
  ): Promise<void> {
    await this.roomRepository.updateById(id, room);
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
}