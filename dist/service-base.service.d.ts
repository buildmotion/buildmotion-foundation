import { RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LoggingService } from 'buildmotion-logging/logging.service';
import { ServiceContext } from 'angular-rules-engine/service/index';
import { ErrorResponse } from './models/error-response.model';
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
    handleError(error: any): void;
    /**
        * Use to handle HTTP errors when calling web api(s).
        */
    handleHttpError(error: any, requestOptions: RequestOptions): Observable<Response>;
    handleOAuthError(error: any, requestOptions: RequestOptions): Observable<Response>;
    createErrorResponse(message: string): ErrorResponse;
    finishRequest(sourceName: string): void;
}
