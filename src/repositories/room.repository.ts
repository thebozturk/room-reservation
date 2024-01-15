import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PgDataSource} from '../datasources';
import {Room, RoomRelations, Reservation} from '../models';
import {ReservationRepository} from './reservation.repository';

export class RoomRepository extends DefaultCrudRepository<
  Room,
  typeof Room.prototype.roomNumber,
  RoomRelations
> {

  public readonly reservations: HasManyRepositoryFactory<Reservation, typeof Room.prototype.roomNumber>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('ReservationRepository') protected reservationRepositoryGetter: Getter<ReservationRepository>,
  ) {
    super(Room, dataSource);
    this.reservations = this.createHasManyRepositoryFactoryFor('reservations', reservationRepositoryGetter,);
    this.registerInclusionResolver('reservations', this.reservations.inclusionResolver);
  }
}
