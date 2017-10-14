import { Injectable } from '@angular/core';
import { Headers, Http, Request, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { Severity } from 'buildmotion-logging/severity.enum';
import { LoggingService } from 'buildmotion-logging/logging.service';
import { ErrorResponse } from './models/error-response.model';
/**
 * Use to create and execute HTTP service requests.
 * 1. Create Headers
 * 2. Create RequestOptions
 * 3. Execute Request
 */
var HttpBaseService = /** @class */ (function () {
    function HttpBaseService(http, loggingService) {
        this.http = http;
        this.loggingService = loggingService;
        this.serviceName = 'HttpBaseService';
    }
    /**
     * Use to create a [Header] for [multipart/form-data].
     */
    HttpBaseService.prototype.createMultipartFormDataHeader = function (requiresAuthToken) {
        this.loggingService.log(this.serviceName, Severity.Information, "Preparing to create header for the [multipart/form-data] HTTP request. RequiresAuthToken: " + requiresAuthToken + ".");
        var headers = new Headers();
        if (requiresAuthToken) {
            // create header request with security token;
            headers.append('Authorization', "Bearer " + this.accessToken);
        }
        return headers;
    };
    /**
     * Use to create a [Header] for Content-Type [application/x-www-form-urlencoded].
     */
    HttpBaseService.prototype.createFormUrlencodedHeader = function () {
        this.loggingService.log(this.serviceName, Severity.Information, "Preparing to create header for the [application/x-www-form-urlencoded] HTTP request.");
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return headers;
    };
    /**
     * Use to create a [Header] for the HTTP request. If the [requiresAuthToken] indicator
     * is true, the request will use the current Authorization security token.
     * @param isSecure
     */
    HttpBaseService.prototype.createHeader = function (requiresAuthToken) {
        this.loggingService.log(this.serviceName, Severity.Information, "Preparing to create header for the HTTP request. RequiresAuthToken: " + requiresAuthToken + ".");
        var headers = new Headers({ 'Content-Type': 'application/json' });
        if (requiresAuthToken) {
            // create header request with security token;
            headers.append('Authorization', "Bearer " + this.accessToken);
        }
        return headers;
    };
    /**
     * Use to create a new instance of a [RequestOptions] object.
     * See RequestOptions: https://angular.io/docs/ts/latest/api/http/index/RequestOptions-class.html
     * See RequestMethod: https://angular.io/docs/ts/latest/api/http/index/RequestMethod-enum.html
     */
    HttpBaseService.prototype.createRequestOptions = function (method, headers, url, body) {
        this.loggingService.log(this.serviceName, Severity.Information, "Preparing to create request options for the HTTP request.");
        return new RequestOptions({
            method: method,
            headers: headers,
            url: url,
            body: body
        });
    };
    /**
     * Use to execute an HTTP request using the specified header and URL.
     * See Request: https://angular.io/docs/ts/latest/api/http/index/Request-class.html
     */
    HttpBaseService.prototype.executeRequest = function (requestOptions) {
        var _this = this;
        this.loggingService.log(this.serviceName, Severity.Information, "Preparing to execute HTTP request. Url: " + requestOptions.url + ", Method: " + requestOptions.method);
        return this.http.request(new Request(requestOptions))
            .map(function (response) { return response.json(); }) // maps the observable response to a JSON object;
            .catch(function (error) { return _this.handleHttpError(error, requestOptions); }) // use to handle any exception during service call;
            .cache(); // use [cache] to eliminate possibility of duplicate calls;
    };
    /**
     * Use to handle HTTP errors when calling web api(s).
     */
    HttpBaseService.prototype.handleHttpError = function (error, requestOptions) {
        var message = error.toString() + " " + requestOptions.url + ", " + JSON.stringify(requestOptions.body);
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
                var response = error.json();
                if (response) {
                    var subject = new BehaviorSubject(response);
                    return subject.asObservable();
                }
                else {
                    return this.handleUnexpectedError();
                }
            }
            catch (error) {
                this.loggingService.log(this.serviceName, Severity.Error, error.toString());
                return this.handleUnexpectedError();
            }
        }
        else {
            return this.handleUnexpectedError();
        }
    };
    HttpBaseService.prototype.handleUnexpectedError = function () {
        var response = this.createErrorResponse('Unexpected error while processing response.');
        var subject = new BehaviorSubject(response);
        return subject.asObservable();
    };
    HttpBaseService.prototype.createErrorResponse = function (message) {
        var response = new ErrorResponse();
        response.Message = message;
        return response;
    };
    HttpBaseService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    HttpBaseService.ctorParameters = function () { return [
        { type: Http, },
        { type: LoggingService, },
    ]; };
    return HttpBaseService;
}());
export { HttpBaseService };
//# sourceMappingURL=http-base.service.js.map