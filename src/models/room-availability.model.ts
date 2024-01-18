import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Room} from './room.model';
import {Reservation} from './reservation.model';

@model()
export class RoomAvailability extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @belongsTo(() => Room, {name: 'room'})
  roomNumber: string;

  @belongsTo(() => Reservation, {name: 'reservation'})
  reservationId: string;

  @property({
    type: 'date',
  })
  startDate: string;

  @property({
    type: 'date',
  })
  endDate: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isFinished: boolean;

  constructor(data?: Partial<RoomAvailability>) {
    super(data);
  }
}

export interface RoomAvailabilityRelations {
  // describe navigational properties here
}
