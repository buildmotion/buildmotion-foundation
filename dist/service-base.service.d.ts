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
    handleError(error: {
        name: string;
        message: string | undefined;
    }): void;
    /**
        * Use to handle HTTP errors when calling web api(s).
        */
    handleHttpError(error: {
        toString: () => void;
        _body: any;
        json: () => ErrorResponse;
    }, requestOptions: RequestOptions): Observable<Response>;
    /**
     * Use this method to handle an error from the OAuth Provider API.
     * @param error
     * @param requestOptions
     */
    handleOAuthError(error: OAuthErrorResponse, requestOptions: RequestOptions): Observable<Response>;
    /**
     * Use to create a new [ErrorResponse] with the specified message.
     * @param message The message for the specified [ErrorResponse].
     */
    createErrorResponse(message: string): ErrorResponse;
    /**
     * Use a generic method to finish service requests that return [Observables].
     * @param sourceName
     */
    finishRequest(sourceName: string): void;
    /**
     * Use to reset the service context when you want to clear messages from the [ServiceContext]. If you want to
     * append messages from subsequent service calls, do not use this method.
     */
    resetServiceContext(): void;
}
