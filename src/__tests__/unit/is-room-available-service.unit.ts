import {RoomAvailabilityService} from '../../services/is-room-available.service';
import {RoomAvailabilityRepository, RoomRepository} from '../../repositories';
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {Room, RoomAvailability} from '../../models';
import {testdb} from '../fixtures/testdb.datasource';
import {DataSource} from '@loopback/repository';

describe('IsRoomAvailableService', () => {
  let roomAvailabilityService: RoomAvailabilityService;
  let roomAvailabilityRepositoryStub: sinon.SinonStubbedInstance<RoomAvailabilityRepository>;
  let roomRepositoryStub: sinon.SinonStubbedInstance<RoomRepository>;

  beforeEach(() => {
    roomAvailabilityRepositoryStub = sinon.createStubInstance(RoomAvailabilityRepository);
    roomRepositoryStub = sinon.createStubInstance(RoomRepository);

    roomAvailabilityService = new RoomAvailabilityService(
      roomAvailabilityRepositoryStub as unknown as RoomAvailabilityRepository,
      roomRepositoryStub as unknown as RoomRepository,
      testdb as unknown as DataSource,
    );
  });

  afterEach(() => sinon.restore());

  it('should check if a room is available', async () => {
    const roomId = '101';
    const startDate = '2023-01-01';
    const endDate = '2023-01-05';

    roomAvailabilityRepositoryStub.find.resolves([]);

    const isAvailable = await roomAvailabilityService.isRoomAvailable(roomId, startDate, endDate);
    expect(isAvailable).to.be.true();
  });

  it('should find available rooms', async () => {
    const startDate = '2023-01-01';
    const endDate = '2023-01-05';
    const unavailableRooms: RoomAvailability[] = [
      new RoomAvailability({roomNumber: '101', startDate: '2023-01-01', endDate: '2023-01-03'}),
    ];
    const availableRooms: Room[] = [
      new Room(
        {
          roomNumber: '102',
          type: 'double',
          weekdayPrice: 100,
          weekendPrice: 150,
          capacity: 2,
        },
      ),
    ];

    roomAvailabilityRepositoryStub.find.resolves(unavailableRooms);
    roomRepositoryStub.find.resolves(availableRooms);

    const result = await roomAvailabilityService.findAvailableRooms(startDate, endDate);
    expect(result).to.eql(availableRooms);
    expect(roomAvailabilityRepositoryStub.find.calledOnce).to.be.true();
    expect(roomRepositoryStub.find.calledOnce).to.be.true();
  });


  it('should throw an error when no rooms are available', async () => {
    const startDate = '2023-01-01';
    const endDate = '2023-01-05';
    const unavailableRooms: RoomAvailability[] = [
      new RoomAvailability({roomNumber: '101', startDate: '2023-01-01', endDate: '2023-01-03'}),
    ];

    roomAvailabilityRepositoryStub.find.resolves(unavailableRooms);
    roomRepositoryStub.find.resolves();

    try {
      await roomAvailabilityService.findAvailableRooms(startDate, endDate);
    } catch (e) {
      expect(e.message).to.eql('No rooms available for the given dates');
    }
    expect(roomAvailabilityRepositoryStub.find.calledOnce).to.be.true();
    expect(roomRepositoryStub.find.calledOnce).to.be.true();
  });
});
