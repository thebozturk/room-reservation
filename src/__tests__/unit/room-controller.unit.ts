import {RoomController} from '../../controllers';
import {ReservationRepository, RoomAvailabilityRepository, RoomRepository} from '../../repositories';
import {RoomAvailabilityService} from '../../services/is-room-available.service';
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {Reservation, Room, RoomAvailability} from '../../models';

describe('RoomController', () => {
  let roomController: RoomController;
  let roomRepositoryStub: sinon.SinonStubbedInstance<RoomRepository>;
  let roomAvailabilityServiceStub: sinon.SinonStubbedInstance<RoomAvailabilityService>;
  let reservationRepositoryStub: sinon.SinonStubbedInstance<ReservationRepository>;
  let roomAvailabilityRepositoryStub: sinon.SinonStubbedInstance<RoomAvailabilityRepository>;

  beforeEach(() => {
    roomRepositoryStub = sinon.createStubInstance(RoomRepository);
    roomAvailabilityServiceStub = sinon.createStubInstance(RoomAvailabilityService);
    reservationRepositoryStub = sinon.createStubInstance(ReservationRepository);
    roomAvailabilityRepositoryStub = sinon.createStubInstance(RoomAvailabilityRepository);

    roomController = new RoomController(
      roomRepositoryStub as unknown as RoomRepository,
      roomAvailabilityServiceStub as unknown as RoomAvailabilityService,
      reservationRepositoryStub as unknown as ReservationRepository,
      roomAvailabilityRepositoryStub as unknown as RoomAvailabilityRepository,
    );
  });

  afterEach(() => sinon.restore());

  it('should create a room', async () => {
    const room: Room = new Room({
      roomNumber: '1',
      type: 'single',
      capacity: 1,
      weekdayPrice: 100,
      weekendPrice: 200,
    });

    roomRepositoryStub.create.resolves(room);

    const result = await roomController.create(room);
    expect(result).to.eql(room);
    expect(roomRepositoryStub.create.calledOnce).to.be.true();
    expect(roomRepositoryStub.create.calledWith(room)).to.be.true();
  });

  it('should find a room', async () => {
    const room: Room = new Room({
      roomNumber: '1',
      type: 'single',
      capacity: 1,
      weekdayPrice: 100,
      weekendPrice: 200,
    });

    roomRepositoryStub.findById.resolves(room);

    const result = await roomController.find(room.roomNumber);
    expect(result).to.eql(room);
    expect(roomRepositoryStub.findById.calledOnce).to.be.true();
    expect(roomRepositoryStub.findById.calledWith(room.roomNumber)).to.be.true();
  });

  it('should update a room', async () => {
    const room: Room = new Room({
      roomNumber: '1',
      type: 'single',
      capacity: 1,
      weekdayPrice: 100,
      weekendPrice: 200,
    });

    roomRepositoryStub.updateById.resolves();

    await roomController.updateById(room.roomNumber, room);
    expect(roomRepositoryStub.updateById.calledOnce).to.be.true();
    expect(roomRepositoryStub.updateById.calledWith(room.roomNumber, room)).to.be.true();
  });

  it('should find available rooms', async () => {
    const startDate = '2023-01-01';
    const endDate = '2023-01-05';
    const availableRooms: Room[] = [
      new Room({
        roomNumber: '1',
        type: 'single',
        capacity: 1,
        weekdayPrice: 100,
        weekendPrice: 200,
      }),
      new Room({
        roomNumber: '2',
        type: 'single',
        capacity: 1,
        weekdayPrice: 100,
        weekendPrice: 200,
      }),
    ];

    roomAvailabilityServiceStub.findAvailableRooms.resolves(availableRooms);

    const result = await roomController.findAvailableRooms(startDate, endDate);
    expect(result).to.eql(availableRooms);
    expect(roomAvailabilityServiceStub.findAvailableRooms.calledOnce).to.be.true();
    expect(roomAvailabilityServiceStub.findAvailableRooms.calledWith(startDate, endDate)).to.be.true();
  });

  it('should delete a room by id', async () => {
    const testRoom = new Room({
      roomNumber: '101',
    });
    roomRepositoryStub.create.resolves(testRoom);

    const createdRoom = await roomController.create(testRoom);
    expect(createdRoom).to.eql(testRoom);

    const result = await roomController.deleteById(createdRoom.roomNumber);

    roomRepositoryStub.findById.resolves(null as unknown as Room);
    const deletedRoom = await roomRepositoryStub.findById(createdRoom.roomNumber);
    expect(deletedRoom).to.be.null();
    expect(roomRepositoryStub.findById.calledOnce).to.be.true();
    expect(roomRepositoryStub.findById.calledWith(createdRoom.roomNumber)).to.be.true();
    expect(result).to.eql('Room deleted successfully');
  });

  it('should make a room available', async () => {
    const roomId = '101';
    const startDate = '2023-01-01';
    const endDate = '2023-01-05';
    const reservationId = '1';
    const roomAvailabilityId = '1';

    const testReservation = {
      id: reservationId,
      roomId: roomId,
      startDate: startDate,
      endDate: endDate,
    };

    reservationRepositoryStub.findOne.resolves(testReservation as Reservation);

    const testRoomAvailability = {
      id: roomAvailabilityId,
      roomNumber: roomId,
      startDate: startDate,
      endDate: endDate,
      reservationId: reservationId,
    };
    roomAvailabilityRepositoryStub.findOne.resolves(testRoomAvailability as RoomAvailability);

    reservationRepositoryStub.deleteById.resolves();
    roomAvailabilityRepositoryStub.deleteById.resolves();

    const result = await roomController.makeAvailable(roomId, startDate, endDate);
    expect(result).to.eql(`Room ${roomId} is available from ${startDate} to ${endDate}`);
    expect(reservationRepositoryStub.findOne.calledOnce).to.be.true();
    expect(reservationRepositoryStub.deleteById.calledOnce).to.be.true();
    expect(roomAvailabilityRepositoryStub.findOne.calledOnce).to.be.true();
    expect(roomAvailabilityRepositoryStub.deleteById.calledOnce).to.be.true();
  });
});
