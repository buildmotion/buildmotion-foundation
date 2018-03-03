import { RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { LoggingService } from '@buildmotion/logging';
import { ServiceContext } from 'angular-rules-engine';
import { ErrorResponse } from './models/error-response.model';
import { OAuthErrorResponse } from './models/oauth-error-response.model';
/**
 * Use this class as a base for application [services]. Add and/or implement
 * common behavior. For example, this base service class will
 * always initialize a new [ServiceContext] for the specified service
 * instance.
 */
export declare class ServiceBase {
    loggingService: LoggingService;
    serviceInitDateTime: Date;
    /**
     * Use this public property to set/retrieve the user's
     * security token. Most of the web api calls will require an
     * authorization token for the authenticated user.
     */
    accessToken: string;
    serviceName: string;
    serviceContext: ServiceContext;
    constructor(loggingService: LoggingService);
    extractData(res: Response): any;
    /**
    * Use to handle an unexpected error in the application. The error should implement
    * the specified interface. The method will add a new [ServiceMessage] to the
    * specified [ServiceContext].
    * @param error An unexpected application error that implements the [Error] interface.
    *
    * interface Error {
    *  name: string;
    *  message: string;
    *  stack?: string;
    * }
    */
    handleUnexpectedError(error: Error): void;
    /**
     * Use this method to handle an error from the OAuth Provider API.
     * @param error
     * @param requestOptions
     */
    handleOAuthError(error: OAuthErrorResponse, requestOptions: RequestOptions): Observable<Response>;
    createErrorResponse(message: string): ErrorResponse;
    finishRequest(sourceName: string): void;
}
