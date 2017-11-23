import { BehaviorSubject } from 'rxjs';
import { MessageType } from 'angular-rules-engine';
import { ServiceContext } from 'angular-rules-engine';
import { ServiceMessage } from 'angular-rules-engine';
import { Severity } from 'buildmotion-logging';
import { ErrorResponse } from './models/error-response.model';
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
    ServiceBase.prototype.extractData = function (res) {
        var body = res.json();
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
         * @param error An unexpected application error that implements the [Error] interface.
         *
         * interface Error {
         *  name: string;
         *  message: string;
         *  stack?: string;
         * }
         */
    ServiceBase.prototype.handleUnexpectedError = /**
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
    function (error) {
        var message = new ServiceMessage(error.name, error.message)
            .WithDisplayToUser(true)
            .WithMessageType(MessageType.Error)
            .WithSource(this.serviceName);
        var logItem = message.toString() + "; " + error.stack;
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
         * @param error
         * @param requestOptions
         */
    ServiceBase.prototype.handleOAuthError = /**
         * Use this method to handle an error from the OAuth Provider API.
         * @param error
         * @param requestOptions
         */
    function (error, requestOptions) {
        var message = error.toString() + " " + requestOptions.url + ", " + JSON.stringify(requestOptions.body);
        this.loggingService.log(this.serviceName, Severity.Error, message);
        if (error && error._body) {
            try {
                var response_1 = this.createErrorResponse("Unable to validate credentials.");
                var subject_1 = new BehaviorSubject(response_1);
                return subject_1.asObservable();
            }
            catch (e) {
                this.loggingService.log(this.serviceName, Severity.Error, e.toString());
            }
        }
        // default return behavior;
        var response = this.createErrorResponse("Unable to validate credentials.");
        var subject = new BehaviorSubject(response);
        return subject.asObservable();
    };
    ServiceBase.prototype.createErrorResponse = function (message) {
        var response = new ErrorResponse();
        response.Message = message;
        return response;
    };
    ServiceBase.prototype.finishRequest = function (sourceName) {
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
//# sourceMappingURL=service-base.service.js.map