import {injectable} from '@loopback/core';
import {Reservation} from '../models';

@injectable()
export class CheckReservationDurationService {
  checkReservationDuration(reservation: Reservation): Reservation {
    const startDate = new Date(reservation.startDate);
    const endDate = new Date(reservation.endDate);
    const durationInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

    reservation.isConfirmed = durationInDays <= 3;
    return reservation;
  }
}