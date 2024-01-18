import {RoomAvailabilityController} from '../../controllers';
import {RoomAvailabilityRepository} from '../../repositories';
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {RoomAvailability} from '../../models';

describe('RoomAvailabilityController', () => {
  let roomAvailabilityController: RoomAvailabilityController;
  let roomAvailabilityRepositoryStub: sinon.SinonStubbedInstance<RoomAvailabilityRepository>;

  beforeEach(() => {
    roomAvailabilityRepositoryStub = sinon.createStubInstance(RoomAvailabilityRepository);
    roomAvailabilityController = new RoomAvailabilityController(
      roomAvailabilityRepositoryStub as unknown as RoomAvailabilityRepository,
    );
  });

  afterEach(() => sinon.restore());

  it('should create room availability', async () => {
    const newRoomAvailability: Omit<RoomAvailability, 'id'> = {
      roomNumber: '101',
      startDate: '2023-01-01',
      endDate: '2023-01-05',
      reservationId: '1',
      isFinished: false,
    } as Omit<RoomAvailability, 'id'>;
    const createdRoomAvailability = new RoomAvailability({
      id: '1',
      ...newRoomAvailability
    });

    roomAvailabilityRepositoryStub.create.resolves(createdRoomAvailability);

    const result = await roomAvailabilityController.create(newRoomAvailability);
    expect(result).to.eql(createdRoomAvailability);
    expect(roomAvailabilityRepositoryStub.create.calledOnce).to.be.true();
    expect(roomAvailabilityRepositoryStub.create.calledWith(newRoomAvailability)).to.be.true();
  });
});
