import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgDataSource} from '../datasources';
import {RoomAvailability, RoomAvailabilityRelations} from '../models';

export class RoomAvailabilityRepository extends DefaultCrudRepository<
  RoomAvailability,
  typeof RoomAvailability.prototype.roomNumber,
  RoomAvailabilityRelations
> {
  constructor(
    @inject('datasources.pg') dataSource: PgDataSource,
  ) {
    super(RoomAvailability, dataSource);
  }
}
