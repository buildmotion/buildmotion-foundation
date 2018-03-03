import { RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { BehaviorSubject } from 'rxjs';

import { LoggingService } from '@buildmotion/logging';
import { MessageType } from 'angular-rules-engine';
import { ServiceContext } from 'angular-rules-engine';
import { ServiceMessage } from 'angular-rules-engine';
import { Severity } from '@buildmotion/logging';
import { ErrorResponse } from './models/error-response.model';
import { ServiceError } from './models/service-error.model';
import { OAuthErrorResponse } from './models/oauth-error-response.model';

/**
 * Use this class as a base for application [services]. Add and/or implement
 * common behavior. For example, this base service class will 
 * always initialize a new [ServiceContext] for the specified service 
 * instance.
 */
export class ServiceBase {
    serviceInitDateTime: Date = new Date();

    /**
     * Use this public property to set/retrieve the user's
     * security token. Most of the web api calls will require an
     * authorization token for the authenticated user.
     */
    accessToken: string = '';
    serviceName: string;
    serviceContext: ServiceContext = new ServiceContext();

    constructor(public loggingService: LoggingService) {
    }

    extractData(res: Response) {
        const body = res.json();
        return body.data || {};
    }

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
     handleUnexpectedError(error: Error): void {
        let message = new ServiceMessage(error.name, error.message)
            .WithDisplayToUser(true)
            .WithMessageType(MessageType.Error)
            .WithSource(this.serviceName);

        const logItem = `${message.toString()}; ${error.stack}`;
        this.loggingService.log(this.serviceName, Severity.Error, logItem);

        this.serviceContext.addMessage(message);
    }

    handleError(error: { name: string; message: string | undefined; }): void {
        let message = new ServiceMessage(error.name, error.message)
            .WithDisplayToUser(true)
            .WithMessageType(MessageType.Error)
            .WithSource(this.serviceName);

        this.loggingService.log(this.serviceName, Severity.Error, message.toString());

        this.serviceContext.Messages.forEach(e => {
            if (e.MessageType === MessageType.Error && e.DisplayToUser) {
                this.loggingService.log(this.serviceName, Severity.Error, e.toString());
            }
        });
    }

    /**
        * Use to handle HTTP errors when calling web api(s).
        */
    handleHttpError(error: { toString: () => void; _body: any; json: () => ErrorResponse; }, requestOptions: RequestOptions): Observable<Response> {
        let message = `${error.toString()} ${requestOptions.url}, ${JSON.stringify(requestOptions.body)}`;
        this.loggingService.log(this.serviceName, Severity.Error, message);
        if (error && error._body) {
            try {
                let response: ErrorResponse = error.json();
                let subject: BehaviorSubject<any> = new BehaviorSubject(response);
                return subject.asObservable();
            } catch (error) {
                this.loggingService.log(this.serviceName, Severity.Error, error.toString());
            }
        }

        // default return behavior;
        let response = this.createErrorResponse('Unexpected error while processing response.');
        let subject: BehaviorSubject<any> = new BehaviorSubject(response);
        return subject.asObservable();
    }

    /**
     * Use this method to handle an error from the OAuth Provider API. 
     * @param error
     * @param requestOptions 
     */
    handleOAuthError(error: OAuthErrorResponse, requestOptions: RequestOptions): Observable<Response> {
        let message = `${error.toString()} ${requestOptions.url}, ${JSON.stringify(requestOptions.body)}`;
        this.loggingService.log(this.serviceName, Severity.Error, message);
        if (error && error._body) {
            try {
                let response = this.createErrorResponse(`Unable to validate credentials.`);
                let subject: BehaviorSubject<any> = new BehaviorSubject(response);
                return subject.asObservable();
            } catch (e) {
                this.loggingService.log(this.serviceName, Severity.Error, e.toString());
            }
        }

        // default return behavior;
        let response = this.createErrorResponse(`Unable to validate credentials.`);
        let subject: BehaviorSubject<any> = new BehaviorSubject(response);
        return subject.asObservable();
    }

    /**
     * Use to create a new [ErrorResponse] with the specified message.
     * @param message The message for the specified [ErrorResponse].
     */
    createErrorResponse(message: string): ErrorResponse {
        const response: ErrorResponse = new ErrorResponse();
        response.Message = message;
        return response;
    }

    /**
     * Use a generic method to finish service requests that return [Observables]. 
     * @param sourceName
     */
    finishRequest(sourceName: string): void {
        this.loggingService.log(this.serviceName, Severity.Information, `Request for [${sourceName}] by ${this.serviceName} is complete.`);
        if (this.serviceContext.hasErrors()) {
            this.loggingService.log(this.serviceName, Severity.Information, `Preparing to write out the errors.`);
            this.serviceContext.Messages.filter(f => f.MessageType === MessageType.Error && f.DisplayToUser)
                .forEach(e => this.loggingService.log(this.serviceName, Severity.Error, e.toString()));
        }
    }

    /**
     * Use to reset the service context when you want to clear messages from the [ServiceContext]. If you want to 
     * append messages from subsequent service calls, do not use this method.
     */
    resetServiceContext() {
        this.loggingService.log(this.serviceName, Severity.Information, `Preparing to reset the Messages of the current [ServiceContext].`);
        if (this.serviceContext && this.serviceContext.Messages) {
            if (this.serviceContext.Messages.length > 0) {
                this.loggingService.log(this.serviceName, Severity.Information, `Resetting the Messages of the current [ServiceContext].`);
                this.serviceContext.Messages = new Array<ServiceMessage>();
            } else {
                this.loggingService.log(this.serviceName, Severity.Information, `The current [ServiceContext] does not contain any [Messages].`);
            }
        } else {
            this.loggingService.log(this.serviceName, Severity.Warning, `The current [ServiceContext] is not valid.`);
        }
        this.loggingService.log(this.serviceName, Severity.Information, `Finished  processing request to [reset] the Messages of the current [ServiceContext].`);
    }
}
