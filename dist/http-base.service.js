/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from "@angular/core";
import { Headers, Http, Request, RequestOptions } from "@angular/http";
import { BehaviorSubject } from "rxjs/Rx";
import { Severity } from "@buildmotion/logging";
import { LoggingService } from "@buildmotion/logging/";
import { ErrorResponse } from "./models/error-response.model";
/**
 * Use to create and execute HTTP service requests.
 * 1. Create Headers
 * 2. Create RequestOptions
 * 3. Execute Request
 */
var HttpBaseService = (function () {
    function HttpBaseService(http, loggingService) {
        this.http = http;
        this.loggingService = loggingService;
        this.serviceName = 'HttpBaseService';
    }
    /**
     * Use to create a [Header] for [multipart/form-data].
     */
    /**
     * Use to create a [Header] for [multipart/form-data].
     * @param {?} requiresAuthToken
     * @return {?}
     */
    HttpBaseService.prototype.createMultipartFormDataHeader = /**
     * Use to create a [Header] for [multipart/form-data].
     * @param {?} requiresAuthToken
     * @return {?}
     */
    function (requiresAuthToken) {
        this.loggingService.log(this.serviceName, Severity.Information, "Preparing to create header for the [multipart/form-data] HTTP request. RequiresAuthToken: " + requiresAuthToken + ".");
        var /** @type {?} */ headers = new Headers();
        if (requiresAuthToken) {
            // create header request with security token;
            headers.append('Authorization', "Bearer " + this.accessToken);
        }
        return headers;
    };
    /**
     * Use to create a [Header] for Content-Type [application/x-www-form-urlencoded].
     */
    /**
     * Use to create a [Header] for Content-Type [application/x-www-form-urlencoded].
     * @return {?}
     */
    HttpBaseService.prototype.createFormUrlencodedHeader = /**
     * Use to create a [Header] for Content-Type [application/x-www-form-urlencoded].
     * @return {?}
     */
    function () {
        this.loggingService.log(this.serviceName, Severity.Information, "Preparing to create header for the [application/x-www-form-urlencoded] HTTP request.");
        var /** @type {?} */ headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return headers;
    };
    /**
     * Use to create a [Header] for the HTTP request. If the [requiresAuthToken] indicator
     * is true, the request will use the current Authorization security token.
     * @param isSecure
     */
    /**
     * Use to create a [Header] for the HTTP request. If the [requiresAuthToken] indicator
     * is true, the request will use the current Authorization security token.
     * @param {?} requiresAuthToken
     * @return {?}
     */
    HttpBaseService.prototype.createHeader = /**
     * Use to create a [Header] for the HTTP request. If the [requiresAuthToken] indicator
     * is true, the request will use the current Authorization security token.
     * @param {?} requiresAuthToken
     * @return {?}
     */
    function (requiresAuthToken) {
        this.loggingService.log(this.serviceName, Severity.Information, "Preparing to create header for the HTTP request. RequiresAuthToken: " + requiresAuthToken + ".");
        var /** @type {?} */ headers = new Headers({ 'Content-Type': 'application/json' });
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
    /**
     * Use to create a new instance of a [RequestOptions] object.
     * See RequestOptions: https://angular.io/docs/ts/latest/api/http/index/RequestOptions-class.html
     * See RequestMethod: https://angular.io/docs/ts/latest/api/http/index/RequestMethod-enum.html
     * @param {?} method
     * @param {?} headers
     * @param {?} url
     * @param {?} body
     * @return {?}
     */
    HttpBaseService.prototype.createRequestOptions = /**
     * Use to create a new instance of a [RequestOptions] object.
     * See RequestOptions: https://angular.io/docs/ts/latest/api/http/index/RequestOptions-class.html
     * See RequestMethod: https://angular.io/docs/ts/latest/api/http/index/RequestMethod-enum.html
     * @param {?} method
     * @param {?} headers
     * @param {?} url
     * @param {?} body
     * @return {?}
     */
    function (method, headers, url, body) {
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
    /**
     * Use to execute an HTTP request using the specified header and URL.
     * See Request: https://angular.io/docs/ts/latest/api/http/index/Request-class.html
     * @param {?} requestOptions
     * @return {?}
     */
    HttpBaseService.prototype.executeRequest = /**
     * Use to execute an HTTP request using the specified header and URL.
     * See Request: https://angular.io/docs/ts/latest/api/http/index/Request-class.html
     * @param {?} requestOptions
     * @return {?}
     */
    function (requestOptions) {
        var _this = this;
        this.loggingService.log(this.serviceName, Severity.Information, "Preparing to execute HTTP request. Url: " + requestOptions.url + ", Method: " + requestOptions.method);
        return this.http.request(new Request(requestOptions))
            .map(function (response) { return response.json(); }) // maps the observable response to a JSON object;
            .catch(function (error) { return _this.handleHttpError(error, requestOptions); }); // use to handle any exception during service call;
        //.cache(); // use [cache] to eliminate possibility of duplicate calls;
    };
    /**
     * Use to handle HTTP errors when calling web api(s).
     */
    /**
     * Use to handle HTTP errors when calling web api(s).
     * @param {?} error
     * @param {?} requestOptions
     * @return {?}
     */
    HttpBaseService.prototype.handleHttpError = /**
     * Use to handle HTTP errors when calling web api(s).
     * @param {?} error
     * @param {?} requestOptions
     * @return {?}
     */
    function (error, requestOptions) {
        var /** @type {?} */ message = error.toString() + " " + requestOptions.url + ", " + JSON.stringify(requestOptions.body);
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
                var /** @type {?} */ response = error.json();
                if (response) {
                    var /** @type {?} */ subject = new BehaviorSubject(response);
                    return subject.asObservable();
                }
                else {
                    // TODO: RETRIEVE ERROR DETAILS; STATUS, MESSAGE; ETC. AND PROVIDE TO HANDLER;
                    return this.handleUnexpectedError(error);
                }
            }
            catch (/** @type {?} */ ex) {
                var /** @type {?} */ err = /** @type {?} */ (ex);
                var /** @type {?} */ errorMessage = err.name + "; " + err.message;
                this.loggingService.log(this.serviceName, Severity.Error, errorMessage);
                return this.handleUnexpectedError(err);
            }
        }
        else {
            return this.handleUnexpectedError(error);
        }
    };
    /**
     * @param {?=} error
     * @return {?}
     */
    HttpBaseService.prototype.handleUnexpectedError = /**
     * @param {?=} error
     * @return {?}
     */
    function (error) {
        var /** @type {?} */ response = this.createErrorResponse(error);
        var /** @type {?} */ subject = new BehaviorSubject(response);
        return subject.asObservable();
    };
    /**
     * @param {?=} error
     * @return {?}
     */
    HttpBaseService.prototype.createErrorResponse = /**
     * @param {?=} error
     * @return {?}
     */
    function (error) {
        var /** @type {?} */ message = 'Unexpected error while processing response.';
        var /** @type {?} */ response = new ErrorResponse();
        if (error instanceof Error) {
            message = error.name + " - " + error.message;
            response.Exception = error;
        }
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
function HttpBaseService_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    HttpBaseService.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    HttpBaseService.ctorParameters;
    /** @type {?} */
    HttpBaseService.prototype.serviceName;
    /** @type {?} */
    HttpBaseService.prototype.accessToken;
    /** @type {?} */
    HttpBaseService.prototype.http;
    /** @type {?} */
    HttpBaseService.prototype.loggingService;
}
//# sourceMappingURL=http-base.service.js.map