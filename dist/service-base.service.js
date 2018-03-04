/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { BehaviorSubject } from "rxjs";
import { MessageType } from "angular-rules-engine";
import { ServiceContext } from "angular-rules-engine";
import { ServiceMessage } from "angular-rules-engine";
import { Severity } from "@buildmotion/logging";
import { ErrorResponse } from "./models/error-response.model";
/**
 * Use this class as a base for application [services]. Add and/or implement
 * common behavior. For example, this base service class will
 * always initialize a new [ServiceContext] for the specified service
 * instance.
 */
var /**
 * Use this class as a base for application [services]. Add and/or implement
 * common behavior. For example, this base service class will
 * always initialize a new [ServiceContext] for the specified service
 * instance.
 */
ServiceBase = (function () {
    function ServiceBase(loggingService) {
        this.loggingService = loggingService;
        this.serviceInitDateTime = new Date();
        /**
         * Use this public property to set/retrieve the user's
         * security token. Most of the web api calls will require an
         * authorization token for the authenticated user.
         */
        this.accessToken = '';
        this.serviceContext = new ServiceContext();
    }
    /**
     * @param {?} res
     * @return {?}
     */
    ServiceBase.prototype.extractData = /**
     * @param {?} res
     * @return {?}
     */
    function (res) {
        var /** @type {?} */ body = res.json();
        return body.data || {};
    };
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
    /**
     * Use to handle an unexpected error in the application. The error should implement
     * the specified interface. The method will add a new [ServiceMessage] to the
     * specified [ServiceContext].
     * @param {?} error An unexpected application error that implements the [Error] interface.
     *
     * interface Error {
     *  name: string;
     *  message: string;
     *  stack?: string;
     * }
     * @return {?}
     */
    ServiceBase.prototype.handleUnexpectedError = /**
     * Use to handle an unexpected error in the application. The error should implement
     * the specified interface. The method will add a new [ServiceMessage] to the
     * specified [ServiceContext].
     * @param {?} error An unexpected application error that implements the [Error] interface.
     *
     * interface Error {
     *  name: string;
     *  message: string;
     *  stack?: string;
     * }
     * @return {?}
     */
    function (error) {
        var /** @type {?} */ message = new ServiceMessage(error.name, error.message)
            .WithDisplayToUser(true)
            .WithMessageType(MessageType.Error)
            .WithSource(this.serviceName);
        var /** @type {?} */ logItem = message.toString() + "; " + error.stack;
        this.loggingService.log(this.serviceName, Severity.Error, logItem);
        this.serviceContext.addMessage(message);
    };
    /**
     * @param {?} error
     * @return {?}
     */
    ServiceBase.prototype.handleError = /**
     * @param {?} error
     * @return {?}
     */
    function (error) {
        var _this = this;
        var /** @type {?} */ message = new ServiceMessage(error.name, error.message)
            .WithDisplayToUser(true)
            .WithMessageType(MessageType.Error)
            .WithSource(this.serviceName);
        this.loggingService.log(this.serviceName, Severity.Error, message.toString());
        this.serviceContext.Messages.forEach(function (e) {
            if (e.MessageType === MessageType.Error && e.DisplayToUser) {
                _this.loggingService.log(_this.serviceName, Severity.Error, e.toString());
            }
        });
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
    ServiceBase.prototype.handleHttpError = /**
     * Use to handle HTTP errors when calling web api(s).
     * @param {?} error
     * @param {?} requestOptions
     * @return {?}
     */
    function (error, requestOptions) {
        var /** @type {?} */ message = error.toString() + " " + requestOptions.url + ", " + JSON.stringify(requestOptions.body);
        this.loggingService.log(this.serviceName, Severity.Error, message);
        if (error && error._body) {
            try {
                var /** @type {?} */ response_1 = error.json();
                var /** @type {?} */ subject_1 = new BehaviorSubject(response_1);
                return subject_1.asObservable();
            }
            catch (/** @type {?} */ error) {
                this.loggingService.log(this.serviceName, Severity.Error, error.toString());
            }
        }
        // default return behavior;
        var /** @type {?} */ response = this.createErrorResponse('Unexpected error while processing response.');
        var /** @type {?} */ subject = new BehaviorSubject(response);
        return subject.asObservable();
    };
    /**
     * Use this method to handle an error from the OAuth Provider API.
     * @param error
     * @param requestOptions
     */
    /**
     * Use this method to handle an error from the OAuth Provider API.
     * @param {?} error
     * @param {?} requestOptions
     * @return {?}
     */
    ServiceBase.prototype.handleOAuthError = /**
     * Use this method to handle an error from the OAuth Provider API.
     * @param {?} error
     * @param {?} requestOptions
     * @return {?}
     */
    function (error, requestOptions) {
        var /** @type {?} */ message = error.toString() + " " + requestOptions.url + ", " + JSON.stringify(requestOptions.body);
        this.loggingService.log(this.serviceName, Severity.Error, message);
        if (error && error._body) {
            try {
                var /** @type {?} */ response_2 = this.createErrorResponse("Unable to validate credentials.");
                var /** @type {?} */ subject_2 = new BehaviorSubject(response_2);
                return subject_2.asObservable();
            }
            catch (/** @type {?} */ e) {
                this.loggingService.log(this.serviceName, Severity.Error, e.toString());
            }
        }
        // default return behavior;
        var /** @type {?} */ response = this.createErrorResponse("Unable to validate credentials.");
        var /** @type {?} */ subject = new BehaviorSubject(response);
        return subject.asObservable();
    };
    /**
     * Use to create a new [ErrorResponse] with the specified message.
     * @param message The message for the specified [ErrorResponse].
     */
    /**
     * Use to create a new [ErrorResponse] with the specified message.
     * @param {?} message The message for the specified [ErrorResponse].
     * @return {?}
     */
    ServiceBase.prototype.createErrorResponse = /**
     * Use to create a new [ErrorResponse] with the specified message.
     * @param {?} message The message for the specified [ErrorResponse].
     * @return {?}
     */
    function (message) {
        var /** @type {?} */ response = new ErrorResponse();
        response.Message = message;
        return response;
    };
    /**
     * Use a generic method to finish service requests that return [Observables].
     * @param sourceName
     */
    /**
     * Use a generic method to finish service requests that return [Observables].
     * @param {?} sourceName
     * @return {?}
     */
    ServiceBase.prototype.finishRequest = /**
     * Use a generic method to finish service requests that return [Observables].
     * @param {?} sourceName
     * @return {?}
     */
    function (sourceName) {
        var _this = this;
        this.loggingService.log(this.serviceName, Severity.Information, "Request for [" + sourceName + "] by " + this.serviceName + " is complete.");
        if (this.serviceContext.hasErrors()) {
            this.loggingService.log(this.serviceName, Severity.Information, "Preparing to write out the errors.");
            this.serviceContext.Messages.filter(function (f) { return f.MessageType === MessageType.Error && f.DisplayToUser; })
                .forEach(function (e) { return _this.loggingService.log(_this.serviceName, Severity.Error, e.toString()); });
        }
    };
    /**
     * Use to reset the service context when you want to clear messages from the [ServiceContext]. If you want to
     * append messages from subsequent service calls, do not use this method.
     */
    /**
     * Use to reset the service context when you want to clear messages from the [ServiceContext]. If you want to
     * append messages from subsequent service calls, do not use this method.
     * @return {?}
     */
    ServiceBase.prototype.resetServiceContext = /**
     * Use to reset the service context when you want to clear messages from the [ServiceContext]. If you want to
     * append messages from subsequent service calls, do not use this method.
     * @return {?}
     */
    function () {
        this.loggingService.log(this.serviceName, Severity.Information, "Preparing to reset the Messages of the current [ServiceContext].");
        if (this.serviceContext && this.serviceContext.Messages) {
            if (this.serviceContext.Messages.length > 0) {
                this.loggingService.log(this.serviceName, Severity.Information, "Resetting the Messages of the current [ServiceContext].");
                this.serviceContext.Messages = new Array();
            }
            else {
                this.loggingService.log(this.serviceName, Severity.Information, "The current [ServiceContext] does not contain any [Messages].");
            }
        }
        else {
            this.loggingService.log(this.serviceName, Severity.Warning, "The current [ServiceContext] is not valid.");
        }
        this.loggingService.log(this.serviceName, Severity.Information, "Finished  processing request to [reset] the Messages of the current [ServiceContext].");
    };
    return ServiceBase;
}());
/**
 * Use this class as a base for application [services]. Add and/or implement
 * common behavior. For example, this base service class will
 * always initialize a new [ServiceContext] for the specified service
 * instance.
 */
export { ServiceBase };
function ServiceBase_tsickle_Closure_declarations() {
    /** @type {?} */
    ServiceBase.prototype.serviceInitDateTime;
    /**
     * Use this public property to set/retrieve the user's
     * security token. Most of the web api calls will require an
     * authorization token for the authenticated user.
     * @type {?}
     */
    ServiceBase.prototype.accessToken;
    /** @type {?} */
    ServiceBase.prototype.serviceName;
    /** @type {?} */
    ServiceBase.prototype.serviceContext;
    /** @type {?} */
    ServiceBase.prototype.loggingService;
}
//# sourceMappingURL=service-base.service.js.map