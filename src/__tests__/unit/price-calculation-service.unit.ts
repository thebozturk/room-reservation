import {PriceCalculationService} from '../../services/price-calculation.service';
import {RoomRepository} from '../../repositories';
import {CheckReservationDurationService} from '../../services/check-reservation-duration.service';
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {Reservation, Room} from '../../models';

describe('PriceCalculationService', () => {
  let priceCalculationService: PriceCalculationService;
  let roomRepositoryStub: sinon.SinonStubbedInstance<RoomRepository>;
  let checkReservationDurationServiceStub: sinon.SinonStubbedInstance<CheckReservationDurationService>;

  beforeEach(() => {
    roomRepositoryStub = sinon.createStubInstance(RoomRepository);
    checkReservationDurationServiceStub = sinon.createStubInstance(CheckReservationDurationService);

    priceCalculationService = new PriceCalculationService(
      roomRepositoryStub as unknown as RoomRepository,
      checkReservationDurationServiceStub as unknown as CheckReservationDurationService
    );
  });

  afterEach(() => sinon.restore());

  it('should calculate price correctly', async () => {
    const room = new Room({
      roomNumber: '1',
      weekdayPrice: 100,
      weekendPrice: 150,
      capacity: 2,
    });
    const reservation = new Reservation({
      roomId: '1',
      startDate: '2023-01-03',
      endDate: '2023-01-05',
      guests: 2,
    });
    roomRepositoryStub.findById.resolves(room);
    checkReservationDurationServiceStub.checkReservationDuration.resolves(true);

    const price = await priceCalculationService.calculatePrice(reservation);
    console.log(price);
    expect(price).to.equal(200);
  });

  it('should calculate price correctly when there are extra guests', async () => {
    const room = new Room({
      roomNumber: '1',
      weekdayPrice: 100,
      weekendPrice: 150,
      capacity: 2,
    });
    const reservation = new Reservation({
      roomId: '1',
      startDate: '2023-01-03',
      endDate: '2023-01-05',
      guests: 4,
    });
    roomRepositoryStub.findById.resolves(room);
    checkReservationDurationServiceStub.checkReservationDuration.resolves(true);

    const price = await priceCalculationService.calculatePrice(reservation);
    expect(price).to.equal(240);
  });

  it('if the days are weekend, the price should be calculated with weekend price', async () => {
    const room = new Room({
      roomNumber: '1',
      weekdayPrice: 100,
      weekendPrice: 150,
      capacity: 2,
    });
    const reservation = new Reservation({
      roomId: '1',
      startDate: '2023-01-06',
      endDate: '2023-01-08',
      guests: 2,
    });
    roomRepositoryStub.findById.resolves(room);
    checkReservationDurationServiceStub.checkReservationDuration.resolves(true);

    const price = await priceCalculationService.calculatePrice(reservation);
    expect(price).to.equal(250);
  });
});



