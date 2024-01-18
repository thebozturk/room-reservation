import {CheckReservationDurationService} from '../../services/check-reservation-duration.service';
import {Reservation} from '../../models';
import {expect} from '@loopback/testlab';

describe('CheckReservationDurationService', () => {
  let checkReservationDurationService: CheckReservationDurationService;

  beforeEach(() => {
    checkReservationDurationService = new CheckReservationDurationService();
  });

  it('should confirm reservation for duration less than 3 days', () => {
    const reservation = new Reservation({
      startDate: '2023-01-01',
      endDate: '2023-01-02',
      isConfirmed: false
    });

    const updatedReservation = checkReservationDurationService.checkReservationDuration(reservation);
    expect(updatedReservation.isConfirmed).to.be.True();
  });

  it('should confirm reservation for duration exactly 3 days', () => {
    const reservation = new Reservation({
      startDate: '2023-01-01',
      endDate: '2023-01-04',
      isConfirmed: false
    });

    const updatedReservation = checkReservationDurationService.checkReservationDuration(reservation);
    expect(updatedReservation.isConfirmed).to.be.True();
  });

  it('should not confirm reservation for duration more than 3 days', () => {
    const reservation = new Reservation({
      startDate: '2023-01-01',
      endDate: '2023-01-05',
      isConfirmed: false
    });

    const updatedReservation = checkReservationDurationService.checkReservationDuration(reservation);
    expect(updatedReservation.isConfirmed).to.be.False();
  });
});
