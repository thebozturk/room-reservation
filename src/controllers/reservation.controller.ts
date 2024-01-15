import {
  repository,
} from '@loopback/repository';
import {
  post,
  getModelSchemaRef,
  requestBody,
  response,
} from '@loopback/rest';
import {Reservation} from '../models';
import {ReservationRepository} from '../repositories';
import {PriceCalculationService} from '../services/price-calculation.service';
import {inject} from '@loopback/core';

export class ReservationController {
  constructor(
    @repository(ReservationRepository)
    public reservationRepository: ReservationRepository,
    @inject('services.PriceCalculationService')
    public priceCalculationService: PriceCalculationService,
  ) {
  }

  @post('/reservations')
  @response(200, {
    description: 'Reservation model instance',
    content: {'application/json': {schema: getModelSchemaRef(Reservation)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservation, {
            title: 'NewReservation',
            exclude: ['id'],
          }),
        },
      },
    })
      reservation: Reservation,
  ): Promise<Reservation> {
    reservation.price = await this.priceCalculationService.calculatePrice(reservation);
    return this.reservationRepository.create(reservation);
  }
}
