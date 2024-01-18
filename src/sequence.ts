import {inject} from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from '@loopback/authentication';

const DEFAULT_ERROR_MESSAGE = "There's an error on the server. Please try again later.";

export class MySequence implements SequenceHandler {
  constructor(
    @inject(RestBindings.SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(RestBindings.SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(RestBindings.SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(RestBindings.SequenceActions.REJECT) protected reject: Reject,
    @inject(RestBindings.SequenceActions.SEND) public send: Send,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      await this.authenticateRequest(request)

      this.send(response, result);
    } catch (error) {
      const {response} = context;

      let message = DEFAULT_ERROR_MESSAGE;
      let statusCode = 500;

      if (error instanceof Error && error.message) {
        message = error.message;
        if (error.name === 'EntityNotFound') {
          statusCode = 404;
        } else if (error.name === 'BadRequestError') {
          statusCode = 400;
        } else if (error.name === 'UnauthorizedError') {
          statusCode = 401;
        } else if (error.name === 'ForbiddenError') {
          statusCode = 403;
        }
      }
      response.status(statusCode).send({error: message});
    }
  }
}
