import {Entity, model, property, hasMany} from '@loopback/repository';
import {Reservation} from './reservation.model';

@model({
  settings: {
    postgresql: {schema: 'public', table: 'room'},
  },
})
export class Room extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  roomNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'number',
    required: true,
  })
  capacity: number;

  @property({
    type: 'number',
    required: true,
  })
  weekdayPrice: number;

  @property({
    type: 'number',
    required: true,
  })
  weekendPrice: number;

  @hasMany(() => Reservation)
  reservations: Reservation[];

  constructor(data?: Partial<Room>) {
    super(data);
  }
}

export interface RoomRelations {
  // describe navigational properties here
}

export type RoomWithRelations = Room & RoomRelations;
