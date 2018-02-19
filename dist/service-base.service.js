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
                var /** @type {?} */ response_1 = this.createErrorResponse("Unable to validate credentials.");
                var /** @type {?} */ subject_1 = new BehaviorSubject(response_1);
                return subject_1.asObservable();
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
     * @param {?} message
     * @return {?}
     */
    ServiceBase.prototype.createErrorResponse = /**
     * @param {?} message
     * @return {?}
     */
    function (message) {
        var /** @type {?} */ response = new ErrorResponse();
        response.Message = message;
        return response;
    };
    /**
     * @param {?} sourceName
     * @return {?}
     */
    ServiceBase.prototype.finishRequest = /**
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