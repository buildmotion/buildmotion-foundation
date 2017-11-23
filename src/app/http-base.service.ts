import { Injectable } from '@angular/core';
import { Headers, Http, Request, RequestMethod, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/observable';
import  'rxjs/add/operator/cache';
import { BehaviorSubject } from 'rxjs/Rx';

import { Severity } from 'buildmotion-logging/severity.enum';
import { LoggingService } from 'buildmotion-logging/logging.service';
import { ErrorResponse } from './models/error-response.model';
import { ServiceError } from './models/service-error.model';

/**
 * Use to create and execute HTTP service requests.
 * 1. Create Headers
 * 2. Create RequestOptions
 * 3. Execute Request
 */
@Injectable()
export class HttpBaseService {
    serviceName: string = 'HttpBaseService';
    accessToken: string;

    constructor(
        public http: Http,
        public loggingService: LoggingService) {
    }

    /**
     * Use to create a [Header] for [multipart/form-data].
     */
    createMultipartFormDataHeader(requiresAuthToken: boolean) {
        this.loggingService.log(this.serviceName, Severity.Information, `Preparing to create header for the [multipart/form-data] HTTP request. RequiresAuthToken: ${requiresAuthToken}.`);
        const headers = new Headers();
        if (requiresAuthToken) {
            // create header request with security token;
            headers.append('Authorization', `Bearer ${this.accessToken}`);
        }
        return headers;
    }

    /**
     * Use to create a [Header] for Content-Type [application/x-www-form-urlencoded]. 
     */
    createFormUrlencodedHeader() {
        this.loggingService.log(this.serviceName, Severity.Information, `Preparing to create header for the [application/x-www-form-urlencoded] HTTP request.`);
        const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return headers;
    }

    /**
     * Use to create a [Header] for the HTTP request. If the [requiresAuthToken] indicator
     * is true, the request will use the current Authorization security token.
     * @param isSecure
     */
    createHeader(requiresAuthToken: boolean) {
        this.loggingService.log(this.serviceName, Severity.Information, `Preparing to create header for the HTTP request. RequiresAuthToken: ${requiresAuthToken}.`);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        if (requiresAuthToken) {
            // create header request with security token;
            headers.append('Authorization', `Bearer ${this.accessToken}`);
        }
        return headers;
    }

    /**
     * Use to create a new instance of a [RequestOptions] object. 
     * See RequestOptions: https://angular.io/docs/ts/latest/api/http/index/RequestOptions-class.html 
     * See RequestMethod: https://angular.io/docs/ts/latest/api/http/index/RequestMethod-enum.html
     */
    createRequestOptions(method: RequestMethod, headers: Headers, url: string, body: any) {
        this.loggingService.log(this.serviceName, Severity.Information, `Preparing to create request options for the HTTP request.`);
        return new RequestOptions({
            method: method,
            headers: headers,
            url: url,
            body: body
        });
    }

    /**
     * Use to execute an HTTP request using the specified header and URL.
     * See Request: https://angular.io/docs/ts/latest/api/http/index/Request-class.html
     */
    executeRequest(requestOptions: RequestOptions) {
        this.loggingService.log(this.serviceName, Severity.Information, `Preparing to execute HTTP request. Url: ${requestOptions.url}, Method: ${requestOptions.method}`);
        return this.http.request(new Request(requestOptions))
            .map(response => response.json()) // maps the observable response to a JSON object;
            .catch(error => this.handleHttpError(error, requestOptions)); // use to handle any exception during service call;
            //.cache(); // use [cache] to eliminate possibility of duplicate calls;
    }

    /**
     * Use to handle HTTP errors when calling web api(s).
     */
    handleHttpError(error: any, requestOptions: RequestOptions): Observable<Response> {
        const message = `${error.toString()} ${requestOptions.url}, ${JSON.stringify(requestOptions.body)}`;
        this.loggingService.log(this.serviceName, Severity.Error, message);
        if (error && error._body) {
            /**
             * This is an error that contains a body - a [Response] from the application web api. Includes:
             * 1. IsSuccess
             * 2. Message
             * 3. Array of ServiceError items
             * 4. Exception (optional)
             */
            try {
                let response: ErrorResponse = error.json();
                if (response) {
                    let subject: BehaviorSubject<any> = new BehaviorSubject(response);
                    return subject.asObservable();
                } else {
                    // TODO: RETRIEVE ERROR DETAILS; STATUS, MESSAGE; ETC. AND PROVIDE TO HANDLER;
                    return this.handleUnexpectedError(error);
                }
            } catch (ex) {
                const err = <Error>ex;
                const errorMessage = `${err.name}; ${err.message}`;
                this.loggingService.log(this.serviceName, Severity.Error, errorMessage);
                return this.handleUnexpectedError(err);
            }
        } else {
            return this.handleUnexpectedError(error);
        }
    }

    handleUnexpectedError(error?: Error) {
        let response = this.createErrorResponse(error);
        let subject: BehaviorSubject<any> = new BehaviorSubject(response);
        return subject.asObservable();
    }

    createErrorResponse(error?: Error): ErrorResponse {
        let message = 'Unexpected error while processing response.';
        let response: ErrorResponse = new ErrorResponse();
        if(error instanceof Error) {
            message = `${error.name} - ${error.message}`;
            response.Exception = error;
        }
        response.Message = message;
        return response;
    }
}
