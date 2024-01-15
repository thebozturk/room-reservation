import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {Reservation, Room} from '../models';
import {repository} from '@loopback/repository';
import {RoomRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class PriceCalculationService {
  constructor(
    @repository(RoomRepository)
    public roomRepository: RoomRepository,
  ) {}

  async calculatePrice(reservation: Reservation): Promise<number> {
    const room = await this.roomRepository.findById(reservation.roomId);
    const days = this.calculateDays(reservation.startDate, reservation.endDate);
    let price = 0;

    // calculate price for each day
    for (let day = 0; day < days; day++) {
      const date = new Date(reservation.startDate);
      date.setDate(date.getDate() + day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      price += isWeekend ? room.weekendPrice : room.weekdayPrice;
    }

    // if there are more guests than the capacity of the room, add extra charge
    if (reservation.guests > room.capacity) {
      const extraGuests = reservation.guests - room.capacity;
      const extraCharge = extraGuests * 20; // Ekstra başına 20 birim ücret varsayalım
      price += extraCharge;
    }

    return price;
  }

  // calculate the number of days between two dates
  private calculateDays(startDate: string, endDate: string
  ): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return diff / (1000 * 3600 * 24);
  }
}