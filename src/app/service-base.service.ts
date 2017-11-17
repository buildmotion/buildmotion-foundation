import { RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

import { LoggingService } from 'buildmotion-logging/logging.service';
import { MessageType } from 'angular-rules-engine/service/MessageType';
import { ServiceContext } from 'angular-rules-engine/service/ServiceContext';
import { ServiceMessage } from 'angular-rules-engine/service/ServiceMessage';
import { Severity } from 'buildmotion-logging/severity.enum';
import { ErrorResponse } from './models/error-response.model';
import { ServiceError } from './models/service-error.model';

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

    handleError(error): void {
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
    handleHttpError(error, requestOptions: RequestOptions): Observable<Response> {
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

    handleOAuthError(error, requestOptions: RequestOptions): Observable<Response> {
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

    createErrorResponse(message: string): ErrorResponse {
        const response: ErrorResponse = new ErrorResponse();
        response.Message = message;
        return response;
    }

    finishRequest(sourceName: string): void {
        this.loggingService.log(this.serviceName, Severity.Information, `Request for [${sourceName}] by ${this.serviceName} is complete.`);
        if (this.serviceContext.hasErrors()) {
            this.loggingService.log(this.serviceName, Severity.Information, `Preparing to write out the errors.`);
            this.serviceContext.Messages.filter(f => f.MessageType === MessageType.Error && f.DisplayToUser)
                .forEach(e => this.loggingService.log(this.serviceName, Severity.Error, e.toString()));
        }
    }
}
