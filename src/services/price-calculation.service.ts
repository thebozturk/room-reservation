import {inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Reservation} from '../models';
import {RoomRepository} from '../repositories';
import {CheckReservationDurationService} from './check-reservation-duration.service';

@injectable()
export class PriceCalculationService {
  constructor(
    @repository(RoomRepository)
    public roomRepository: RoomRepository,
    @inject('services.CheckReservationDurationService')
    public checkReservationDurationService: CheckReservationDurationService,
  ) {
  }

  async calculatePrice(reservation: Reservation): Promise<number> {
    const room = await this.roomRepository.findById(reservation.roomId);
    const days = this.calculateDays(reservation.startDate, reservation.endDate);
    let price = 0;

    const currentDate = new Date(reservation.startDate);
    for (let day = 0; day < days; day++) {
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      price += isWeekend ? Number(room.weekendPrice) : Number(room.weekdayPrice);
      currentDate.setDate(currentDate.getDate()
        + 1);
    }

    if (reservation.guests > room.capacity) {
      const extraGuests = reservation.guests - room.capacity;
      const extraCharge = extraGuests * 20; // extra charge per guest is $20
      price += extraCharge;
    }

    this.checkReservationDurationService.checkReservationDuration(reservation);

    return price;
  }

  private calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  }
}