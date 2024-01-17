import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PgDataSource} from '../datasources';
import {Reservation, ReservationRelations, Room, User} from '../models';
import {RoomRepository} from './room.repository';
import {LocalUserRepository} from './local-user.repository';

export class ReservationRepository extends DefaultCrudRepository<
  Reservation,
  typeof Reservation.prototype.userId,
  ReservationRelations
> {

  public readonly room: BelongsToAccessor<Room, typeof Reservation.prototype.userId>;

  public readonly user: BelongsToAccessor<User, typeof Reservation.prototype.userId>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('RoomRepository') protected roomRepositoryGetter: Getter<RoomRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<LocalUserRepository>,
  ) {
    super(Reservation, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.room = this.createBelongsToAccessorFor('room', roomRepositoryGetter,);
    this.registerInclusionResolver('room', this.room.inclusionResolver);
  }
}
