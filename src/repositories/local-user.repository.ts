import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PgDataSource} from '../datasources';
import {User, UserRelations, Reservation} from '../models';
import {ReservationRepository} from './reservation.repository';

export class LocalUserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly reservations: HasManyRepositoryFactory<Reservation, typeof User.prototype.id>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('ReservationRepository') protected reservationRepositoryGetter: Getter<ReservationRepository>,
  ) {
    super(User, dataSource);
    this.reservations = this.createHasManyRepositoryFactoryFor('reservations', reservationRepositoryGetter,);
    this.registerInclusionResolver('reservations', this.reservations.inclusionResolver);
  }
}
