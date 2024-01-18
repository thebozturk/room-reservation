import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Room} from './room.model';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Reservation extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'date',
    required: true,
  })
  startDate: string;

  @property({
    type: 'date',
    required: true,
  })
  endDate: string;

  @property({
    type: 'number',
    required: true,
  })
  guests: number;

  @property({
    type: 'number',
    default: 0,
  })
  price: number;

  @property({
    type: 'boolean',
    default: false,
  })
  isConfirmed: boolean;

  @belongsTo(() => Room)
  roomId: string;

  @belongsTo(() => User)
  userId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Reservation>) {
    super(data);
  }
}

export interface ReservationRelations {
  // describe navigational properties here
}

export type ReservationWithRelations = Reservation & ReservationRelations;
