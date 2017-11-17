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
var /**
 * Use this class as a base for application [services]. Add and/or implement
 * common behavior. For example, this base service class will
 * always initialize a new [ServiceContext] for the specified service
 * instance.
 */
ServiceBase = /** @class */ (function () {
    function ServiceBase(loggingService) {
        this.loggingService = loggingService;
    }
    ServiceBase.prototype.extractData = function (res) {
        var body = res.json();
        return body.data || {};
    };
    ServiceBase.prototype.handleError = function (error) {
        var _this = this;
        var message = new ServiceMessage(error.name, error.message)
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
            */
    ServiceBase.prototype.handleHttpError = /**
            * Use to handle HTTP errors when calling web api(s).
            */
    function (error, requestOptions) {
        var message = error.toString() + " " + requestOptions.url + ", " + JSON.stringify(requestOptions.body);
        this.loggingService.log(this.serviceName, Severity.Error, message);
        if (error && error._body) {
            try {
                var response_1 = error.json();
                var subject_1 = new BehaviorSubject(response_1);
                return subject_1.asObservable();
            }
            catch (error) {
                this.loggingService.log(this.serviceName, Severity.Error, error.toString());
            }
        }
        // default return behavior;
        var response = this.createErrorResponse('Unexpected error while processing response.');
        var subject = new BehaviorSubject(response);
        return subject.asObservable();
    };
    ServiceBase.prototype.handleOAuthError = function (error, requestOptions) {
        var message = error.toString() + " " + requestOptions.url + ", " + JSON.stringify(requestOptions.body);
        this.loggingService.log(this.serviceName, Severity.Error, message);
        if (error && error._body) {
            try {
                var response_2 = this.createErrorResponse("Unable to validate credentials.");
                var subject_2 = new BehaviorSubject(response_2);
                return subject_2.asObservable();
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