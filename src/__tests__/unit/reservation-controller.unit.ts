import {ReservationController} from '../../controllers';
import {ReservationRepository, RoomAvailabilityRepository} from '../../repositories';
import {PriceCalculationService} from '../../services/price-calculation.service';
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {Reservation, RoomAvailability} from '../../models';
import {RoomAvailabilityService} from '../../services/is-room-available.service';

describe('ReservationController', () => {
  let reservationController: ReservationController;
  let reservationRepositoryStub: sinon.SinonStubbedInstance<ReservationRepository>;
  let priceCalculationServiceStub: sinon.SinonStubbedInstance<PriceCalculationService>;
  let roomAvailabilityServiceStub: sinon.SinonStubbedInstance<RoomAvailabilityService>;
  let roomAvailabilityRepositoryStub: sinon.SinonStubbedInstance<RoomAvailabilityRepository>;

  beforeEach(() => {
    reservationRepositoryStub = sinon.createStubInstance(ReservationRepository);
    priceCalculationServiceStub = sinon.createStubInstance(PriceCalculationService);
    roomAvailabilityServiceStub = sinon.createStubInstance(RoomAvailabilityService);
    roomAvailabilityRepositoryStub = sinon.createStubInstance(RoomAvailabilityRepository);

    reservationController = new ReservationController(
      reservationRepositoryStub as unknown as ReservationRepository,
      priceCalculationServiceStub as unknown as PriceCalculationService,
      roomAvailabilityServiceStub as unknown as RoomAvailabilityService,
      roomAvailabilityRepositoryStub as unknown as RoomAvailabilityRepository,
    );
  });

  afterEach(() => sinon.restore());

  it('should create a reservation', async () => {
    const newReservation = new Reservation({
      id: "1",
      roomNumber: '1',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      guests: 1,
      userId: '1',
    });
    const calculatedPrice = 100;
    const isRoomAvailable = true;

    priceCalculationServiceStub.calculatePrice.resolves(calculatedPrice);
    roomAvailabilityServiceStub.isRoomAvailable.resolves(isRoomAvailable);
    reservationRepositoryStub.create.resolves(newReservation);

    const result = await reservationController.create(newReservation);
    expect(result).to.eql(newReservation);
    expect(result.price).to.equal(calculatedPrice);
    expect(priceCalculationServiceStub.calculatePrice.calledOnce).to.be.true();
    expect(priceCalculationServiceStub.calculatePrice.calledWith(newReservation)).to.be.true();
    expect(roomAvailabilityServiceStub.isRoomAvailable.calledOnce).to.be.true();
  });

  it('get all reservations', async () => {
    const reservation = new Reservation({
      id: "1",
      roomNumber: '1',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      guests: 1,
      userId: '1',
    });
    reservationRepositoryStub.find.resolves([reservation]);
    const result = await reservationController.list();
    expect(result).to.eql([reservation]);
    expect(reservationRepositoryStub.find.calledOnce).to.be.true();
  });

  it('find reservation by id', async () => {
    const reservation = new Reservation({
      id: "1",
      roomNumber: '1',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      guests: 1,
      userId: '1',
    });
    reservationRepositoryStub.findById.resolves(reservation);
    const result = await reservationController.find('1');
    expect(result).to.eql(reservation);
    expect(reservationRepositoryStub.findById.calledOnce).to.be.true();
    expect(reservationRepositoryStub.findById.calledWith('1')).to.be.true();
  });

  it('should cancel a reservation by id', async () => {
    const reservationId = '1';
    const roomAvailability = {
      id: '1',
      reservationId: reservationId,
      roomNumber: '101',
      startDate: '2023-01-01',
      endDate: '2023-01-05',
      isFinished: false,
    };

    roomAvailabilityRepositoryStub.findOne.resolves(roomAvailability as RoomAvailability);
    roomAvailabilityRepositoryStub.deleteById.resolves();
    reservationRepositoryStub.deleteById.resolves();

    const result = await reservationController.deleteById(reservationId);
    expect(result).to.equal('Reservation cancelled successfully');
    expect(roomAvailabilityRepositoryStub.findOne.calledOnce).to.be.true();
    expect(roomAvailabilityRepositoryStub.findOne.calledWith({
      where: {
        reservationId: reservationId,
      },
    })).to.be.true();
    expect(roomAvailabilityRepositoryStub.deleteById.calledOnce).to.be.true();
  });

  it('if room is not available, should throw an error', async () => {
    const newReservation = new Reservation({
      id: "1",
      roomNumber: '1',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      guests: 1,
      userId: '1',
    });
    const calculatedPrice = 100;
    const isRoomAvailable = false;

    priceCalculationServiceStub.calculatePrice.resolves(calculatedPrice);
    roomAvailabilityServiceStub.isRoomAvailable.resolves(isRoomAvailable);
    reservationRepositoryStub.create.resolves(newReservation);

    await expect(reservationController.create(newReservation)).to.be.rejectedWith('Room is not available for the selected dates');
  });

  it('should confirm a reservation by id', async () => {
    const reservationId = '1';
    const roomAvailability = {
      id: '1',
      reservationId: reservationId,
      roomNumber: '101',
      startDate: '2023-01-01',
      endDate: '2023-01-05',
      isFinished: false,
    };

    const newReservation = new Reservation({
      id: "1",
      roomNumber: '1',
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      guests: 1,
      userId: '1',
    });

    roomAvailabilityRepositoryStub.findOne.resolves(roomAvailability as RoomAvailability);
    roomAvailabilityRepositoryStub.deleteById.resolves();
    reservationRepositoryStub.deleteById.resolves();

    const result = await reservationController.confirmReservation(reservationId, newReservation);
    expect(result).to.equal('Reservation confirmed successfully');
    reservationRepositoryStub.updateById.resolves();
    expect(reservationRepositoryStub.updateById.calledOnce).to.be.true();
  });
});
