import {UserController} from '../../controllers';
import {
  MyUserService, UserCredentialsRepository,
  UserRepository,
} from '@loopback/authentication-jwt';
import {TokenService} from '@loopback/authentication';
import {expect} from '@loopback/testlab';
import sinon, {SinonStub} from 'sinon';
import {User} from '../../models';
import {NewUserRequest} from '../../constants/credential-request-body';
import {UserProfile} from '@loopback/security';
import exp from 'node:constants';
import {UserCredentials} from '../../models/user-credentials.model';

describe('UserController', () => {
  let userController: UserController;
  let userRepositoryStub: sinon.SinonStubbedInstance<UserRepository>;
  let userServiceStub: sinon.SinonStubbedInstance<MyUserService>;
  let tokenServiceStub: Partial<TokenService>;
  let userCredentialsRepositoryStub = sinon.createStubInstance(UserCredentialsRepository);

  beforeEach(() => {
    userRepositoryStub = sinon.createStubInstance(UserRepository);
    userServiceStub = sinon.createStubInstance(MyUserService);
    tokenServiceStub = {
      generateToken: sinon.stub().resolves('mockToken'),
    } as Partial<TokenService> & {generateToken: SinonStub};
    userCredentialsRepositoryStub = sinon.createStubInstance(UserCredentialsRepository);

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
