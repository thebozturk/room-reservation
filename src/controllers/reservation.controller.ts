import {repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, requestBody, response} from '@loopback/rest';
import {Reservation, ReservationRelations} from '../models';
import {ReservationRepository} from '../repositories';
import {PriceCalculationService} from '../services/price-calculation.service';
import {RoomAvailabilityService} from '../services/is-room-available.service';
import {RoomAvailabilityRepository} from '../repositories';
import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';

export class ReservationController {
  constructor(
    @repository(ReservationRepository)
    public reservationRepository: ReservationRepository,
    @inject('services.PriceCalculationService')
    public priceCalculationService: PriceCalculationService,
    @inject('services.RoomAvailabilityService')
    public roomAvailableService: RoomAvailabilityService,
    @repository(RoomAvailabilityRepository)
    public roomAvailabilityRepository: RoomAvailabilityRepository,
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
    const isRoomAvailable = await this.roomAvailableService.isRoomAvailable(reservation.roomId, reservation.startDate, reservation.endDate);
    if (!isRoomAvailable) {
      throw new Error('Room is not available for the selected dates');
    }
    const {id} = await this.reservationRepository.create(reservation);
    await this.roomAvailabilityRepository.create({
      roomNumber: reservation.roomId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      reservationId: id,
    });
    return reservation;
  }

  @get('/reservations')
  @response(200, {
    description: 'Array of Reservation model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Reservation, {includeRelations: true}),
        },
      },
    },
  })
  async list(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  @get('/reservations/{id}')
  @response(200, {
    description: 'Reservation model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Reservation, {includeRelations: true}),
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
  ): Promise<Reservation & ReservationRelations> {
    return this.reservationRepository.findById(id);
  }

  @authenticate('jwt')
  @del('/reservations/{id}/cancel')
  @response(204, {
    description: 'Reservation DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<string> {
    const roomAvailability = await this.roomAvailabilityRepository.findOne({
      where: {
        reservationId: id,
      },
    });
    if (roomAvailability) {
      await this.roomAvailabilityRepository.deleteById(roomAvailability.id);
    }
    await this.reservationRepository.deleteById(id);
    return 'Reservation cancelled successfully'
  }

  @authenticate('jwt')
  @patch('/reservations/{id}/confirm')
  @response(204, {
    description: 'Reservation confirmation success',
  })
  async confirmReservation(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservation, {partial: true}),
        },
      },
    })
      reservation: Partial<Reservation>,
  ): Promise<string> {
    await this.reservationRepository.updateById(id, {isConfirmed: true});
    return 'Reservation confirmed successfully';
  }
}
