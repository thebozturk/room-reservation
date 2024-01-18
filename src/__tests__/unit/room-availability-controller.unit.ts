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

  it('should delete a room availability', async () => {
    const roomAvailabilityId = '1';
    const roomAvailability = new RoomAvailability({
      id: roomAvailabilityId,
      roomNumber: '101',
      startDate: '2023-01-01',
      endDate: '2023-01-05',
      reservationId: '1',
      isFinished: false,
    });

    roomAvailabilityRepositoryStub.create.resolves(roomAvailability);
    const createdRoomAvailability = await roomAvailabilityController.create(roomAvailability);
    expect(createdRoomAvailability).to.eql(roomAvailability);

    const result = await roomAvailabilityController.deleteById(roomAvailabilityId);
    expect(result).to.eql('Room availability deleted successfully');
    roomAvailabilityRepositoryStub.findById.resolves(null as unknown as RoomAvailability);
    const deletedRoomAvailability = await roomAvailabilityRepositoryStub.findById(roomAvailabilityId);
    expect(deletedRoomAvailability).to.be.null();
    expect(roomAvailabilityRepositoryStub.findById.calledOnce).to.be.true();
    expect(roomAvailabilityRepositoryStub.findById.calledWith(roomAvailabilityId)).to.be.true();
  });
});
