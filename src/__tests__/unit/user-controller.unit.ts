import {UserController} from '../../controllers';
import {
  MyUserService,
  UserRepository,
} from '@loopback/authentication-jwt';
import {TokenService} from '@loopback/authentication';
import {expect} from '@loopback/testlab';
import sinon, {SinonStub} from 'sinon';
import {User} from '../../models';
import {UserProfile} from '@loopback/security';

describe('UserController', () => {
  let userController: UserController;
  let userRepositoryStub: sinon.SinonStubbedInstance<UserRepository>;
  let userServiceStub: sinon.SinonStubbedInstance<MyUserService>;
  let tokenServiceStub: Partial<TokenService>;

  beforeEach(() => {
    userRepositoryStub = sinon.createStubInstance(UserRepository);
    userServiceStub = sinon.createStubInstance(MyUserService);
    tokenServiceStub = {
      generateToken: sinon.stub().resolves('mockToken'),
    } as Partial<TokenService> & {generateToken: SinonStub};

    userController = new UserController(
      tokenServiceStub as unknown as TokenService,
      userServiceStub as unknown as MyUserService,
      {} as UserProfile,
      userRepositoryStub as unknown as UserRepository,
    );
  });

  afterEach(() => sinon.restore());


  it('should login a user and return a token', async () => {
    const user = new User({
      id: '1',
      email: 'test@gmail.com',
    });
    const credentials = {email: 'test@example.com', password: 'password'};
    let securityId = 'id';
    const userProfile = {securityId: '', id: user.id, name: user.email, [securityId]: user.id};

    userServiceStub.verifyCredentials.resolves(user);
    userServiceStub.convertToUserProfile.resolves(userProfile);
    // @ts-ignore
    const token = await tokenServiceStub.generateToken(userProfile);
    const result = await userController.login(credentials);
    expect(result).to.eql({token});
    expect(userServiceStub.verifyCredentials.calledOnce).to.be.true();
    expect(userServiceStub.convertToUserProfile.calledOnce).to.be.true();
  });
});
