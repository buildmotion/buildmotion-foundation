(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('buildmotion-logging'), require('rxjs/Observable'), require('angular-actions'), require('angular-rules-engine'), require('@angular/http'), require('rxjs/Rx'), require('buildmotion-logging/severity.enum'), require('buildmotion-logging/logging.service'), require('rxjs')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'buildmotion-logging', 'rxjs/Observable', 'angular-actions', 'angular-rules-engine', '@angular/http', 'rxjs/Rx', 'buildmotion-logging/severity.enum', 'buildmotion-logging/logging.service', 'rxjs'], factory) :
	(factory((global.buildmotionFoundation = {}),global.ng.core,global.ng.common,global.buildmotionLogging,global.Rx.Observable.prototype,global.angularActions,global.angularRulesEngine,global.ng.http,global.Rx,global['buildmotionLogging/Severity'],global['buildmotionLogging/LoggingService'],global.Rx));
}(this, (function (exports,core,common,buildmotionLogging,Observable,angularActions,angularRulesEngine,http,Rx,severity_enum,logging_service,rxjs) { 'use strict';

var BuildMotionFoundationModule = (function () {
    function BuildMotionFoundationModule() {
    }
    BuildMotionFoundationModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule,
                        buildmotionLogging.BuildMotionLoggingModule
                    ],
                    declarations: []
                },] },
    ];
    /** @nocollapse */
    BuildMotionFoundationModule.ctorParameters = function () { return []; };
    return BuildMotionFoundationModule;
}());

var ErrorResponse = (function () {
    function ErrorResponse() {
        this.IsSuccess = false;
        this.Errors = new Array();
    }
    return ErrorResponse;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * This is the application's base Action class that provides implementation of pipeline methods - pre/post
 * execution methods.
 *
 * The pre-execute methods that can be implemented are:
 *		1. start();
 *		2. audit();
 *		3. preValidateAction();
 *		4. evaluateRules();
 *		5. postValidateAction();
 *		6. preExecuteAction();
 *
 *If the status of action is good, the business logic will be executed using the:
 *		1. processAction();
 *
 * The post-execution methods that can be implemented are:
 *		1. postExecuteAction();
 *		2. validateActionResult();
 *		3. finish();
 */
var ActionBase = (function (_super) {
    __extends(ActionBase, _super);
    function ActionBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * This is a required implementation if you want to render/execute the rules that
     * are associated to the specified action.
     */
    /**
         * This is a required implementation if you want to render/execute the rules that
         * are associated to the specified action.
         */
    ActionBase.prototype.validateAction = /**
         * This is a required implementation if you want to render/execute the rules that
         * are associated to the specified action.
         */
    function () {
        return this.validationContext.renderRules();
    };
    ActionBase.prototype.postValidateAction = function () {
        var _this = this;
        this.loggingService.log(this.actionName, buildmotionLogging.Severity.Information, "Preparing to determine if the action contains validation errors in " + this.actionName);
        if (this.validationContext.hasRuleViolations()) {
            this.loggingService.log(this.actionName, buildmotionLogging.Severity.Information, "The target contains validation errors in " + this.actionName);
            // Load the error/rule violations into the ServiceContext so that the information bubbles up to the caller of the service;
            this.validationContext.results.forEach(function (result) {
                if (!result.isValid) {
                    _this.publishRuleResult(result);
                    _this.retrieveRuleDetails(result);
                }
            });
        }
    };
    ActionBase.prototype.postExecuteAction = function () {
        var _this = this;
        if (this.actionResult === angularActions.ActionResult.Fail) {
            this.serviceContext.Messages.forEach(function (e) {
                if (e.MessageType === angularRulesEngine.MessageType.Error) {
                    _this.loggingService.log(_this.actionName, buildmotionLogging.Severity.Error, e.toString());
                }
            });
        }
    };
    /**
    * All concrete actions must override and implement this method. It is defined in the [Action] framework class.
    */
    /**
        * All concrete actions must override and implement this method. It is defined in the [Action] framework class.
        */
    ActionBase.prototype.validateActionResult = /**
        * All concrete actions must override and implement this method. It is defined in the [Action] framework class.
        */
    function () {
        this.loggingService.log(this.actionName, buildmotionLogging.Severity.Information, "Running [validateActionResult] for " + this.actionName + ".");
        // determine the status of the action based on any rule violations;
        if (this.validationContext.hasRuleViolations()) {
            this.loggingService.log(this.actionName, buildmotionLogging.Severity.Error, "The " + this.actionName + " contains rule violations.");
            this.actionResult = angularActions.ActionResult.Fail;
            var errorResponse = new ErrorResponse();
            errorResponse.IsSuccess = false;
            errorResponse.Message = "Validation errors exist.";
            this.response = Observable.Observable.throw(errorResponse);
        }
        this.actionResult = this.serviceContext.isGood() ? angularActions.ActionResult.Success : angularActions.ActionResult.Fail;
        return this.actionResult;
    };
    /**
     * Use to process rule results for composite rules. Note, that this function is recursive
     * and will process all composite rules in the rule set contained in the ValidationContext.
     * @param ruleResult: the result of a rendered rule.
     */
    /**
         * Use to process rule results for composite rules. Note, that this function is recursive
         * and will process all composite rules in the rule set contained in the ValidationContext.
         * @param ruleResult: the result of a rendered rule.
         */
    ActionBase.prototype.retrieveRuleDetails = /**
         * Use to process rule results for composite rules. Note, that this function is recursive
         * and will process all composite rules in the rule set contained in the ValidationContext.
         * @param ruleResult: the result of a rendered rule.
         */
    function (ruleResult) {
        var _this = this;
        if (ruleResult.rulePolicy instanceof angularRulesEngine.CompositeRule) {
            var composite = ruleResult.rulePolicy;
            if (composite && composite.hasErrors) {
                var errors = composite.results.filter(function (result) { return !result.isValid && result.rulePolicy.isDisplayable; });
                errors.forEach(function (errorResult) {
                    _this.publishRuleResult(errorResult);
                    if (errorResult.rulePolicy instanceof angularRulesEngine.CompositeRule) {
                        _this.retrieveRuleDetails(errorResult);
                    }
                });
            }
        }
    };
    /**
     * A helper function to publish a new [ServiceMessage] to the [ServiceContext.Messages] list.
     * @param ruleResult
     */
    /**
         * A helper function to publish a new [ServiceMessage] to the [ServiceContext.Messages] list.
         * @param ruleResult
         */
    ActionBase.prototype.publishRuleResult = /**
         * A helper function to publish a new [ServiceMessage] to the [ServiceContext.Messages] list.
         * @param ruleResult
         */
    function (ruleResult) {
        var serviceMessage = new angularRulesEngine.ServiceMessage(ruleResult.rulePolicy.name, ruleResult.rulePolicy.message, angularRulesEngine.MessageType.Error);
        serviceMessage.DisplayToUser = ruleResult.rulePolicy.isDisplayable;
        serviceMessage.Source = this.actionName;
        this.serviceContext.Messages.push(serviceMessage);
        this.loggingService.log(this.actionName, buildmotionLogging.Severity.Error, "" + serviceMessage.toString());
    };
    return ActionBase;
}(angularActions.Action));

/**
 * Use the business provider base class to access common elements of the business provider.
 *
 * serviceContext: This is initialized for each instance of a business provider - its purpose is to collect information during the processing of business logic.
 */
var BusinessProviderBase = (function () {
    function BusinessProviderBase(loggingService) {
        this.loggingService = loggingService;
        this.loggingService.log(this.serviceName, buildmotionLogging.Severity.Information, "Running constructor for the [BusinessProviderBase].");
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
    BusinessProviderBase.prototype.handleUnexpectedError = /**
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
        var message = new angularRulesEngine.ServiceMessage(error.name, error.message)
            .WithDisplayToUser(true)
            .WithMessageType(angularRulesEngine.MessageType.Error)
            .WithSource(this.serviceName);
        var logItem = message.toString() + "; " + error.stack;
        this.loggingService.log(this.serviceName, buildmotionLogging.Severity.Error, logItem);
        this.serviceContext.addMessage(message);
    };
    BusinessProviderBase.prototype.finishRequest = function (sourceName) {
        var _this = this;
        this.loggingService.log(this.serviceName, buildmotionLogging.Severity.Information, "Request for [" + sourceName + "] by " + this.serviceName + " is complete.");
        if (this.serviceContext.hasErrors()) {
            this.loggingService.log(this.serviceName, buildmotionLogging.Severity.Information, "Preparing to write out the errors.");
            this.serviceContext.Messages.filter(function (f) { return f.DisplayToUser && f.MessageType === angularRulesEngine.MessageType.Error; })
                .forEach(function (e) { return _this.loggingService.log(_this.serviceName, buildmotionLogging.Severity.Error, e.toString()); });
        }
    };
    return BusinessProviderBase;
}());

/**
 * Use to create and execute HTTP service requests.
 * 1. Create Headers
 * 2. Create RequestOptions
 * 3. Execute Request
 */
var HttpBaseService = (function () {
    function HttpBaseService(http$$1, loggingService) {
        this.http = http$$1;
        this.loggingService = loggingService;
        this.serviceName = 'HttpBaseService';
    }
    /**
     * Use to create a [Header] for [multipart/form-data].
     */
    /**
         * Use to create a [Header] for [multipart/form-data].
         */
    HttpBaseService.prototype.createMultipartFormDataHeader = /**
         * Use to create a [Header] for [multipart/form-data].
         */
    function (requiresAuthToken) {
        this.loggingService.log(this.serviceName, severity_enum.Severity.Information, "Preparing to create header for the [multipart/form-data] HTTP request. RequiresAuthToken: " + requiresAuthToken + ".");
        var headers = new http.Headers();
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
         */
    HttpBaseService.prototype.createFormUrlencodedHeader = /**
         * Use to create a [Header] for Content-Type [application/x-www-form-urlencoded].
         */
    function () {
        this.loggingService.log(this.serviceName, severity_enum.Severity.Information, "Preparing to create header for the [application/x-www-form-urlencoded] HTTP request.");
        var headers = new http.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
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
         * @param isSecure
         */
    HttpBaseService.prototype.createHeader = /**
         * Use to create a [Header] for the HTTP request. If the [requiresAuthToken] indicator
         * is true, the request will use the current Authorization security token.
         * @param isSecure
         */
    function (requiresAuthToken) {
        this.loggingService.log(this.serviceName, severity_enum.Severity.Information, "Preparing to create header for the HTTP request. RequiresAuthToken: " + requiresAuthToken + ".");
        var headers = new http.Headers({ 'Content-Type': 'application/json' });
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
         */
    HttpBaseService.prototype.createRequestOptions = /**
         * Use to create a new instance of a [RequestOptions] object.
         * See RequestOptions: https://angular.io/docs/ts/latest/api/http/index/RequestOptions-class.html
         * See RequestMethod: https://angular.io/docs/ts/latest/api/http/index/RequestMethod-enum.html
         */
    function (method, headers, url, body) {
        this.loggingService.log(this.serviceName, severity_enum.Severity.Information, "Preparing to create request options for the HTTP request.");
        return new http.RequestOptions({
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
         */
    HttpBaseService.prototype.executeRequest = /**
         * Use to execute an HTTP request using the specified header and URL.
         * See Request: https://angular.io/docs/ts/latest/api/http/index/Request-class.html
         */
    function (requestOptions) {
        var _this = this;
        this.loggingService.log(this.serviceName, severity_enum.Severity.Information, "Preparing to execute HTTP request. Url: " + requestOptions.url + ", Method: " + requestOptions.method);
        return this.http.request(new http.Request(requestOptions))
            .map(function (response) { return response.json(); }) // maps the observable response to a JSON object;
            .catch(function (error) { return _this.handleHttpError(error, requestOptions); }); // use to handle any exception during service call;
        //.cache(); // use [cache] to eliminate possibility of duplicate calls;
    };
    /**
     * Use to handle HTTP errors when calling web api(s).
     */
    /**
         * Use to handle HTTP errors when calling web api(s).
         */
    HttpBaseService.prototype.handleHttpError = /**
         * Use to handle HTTP errors when calling web api(s).
         */
    function (error, requestOptions) {
        var message = error.toString() + " " + requestOptions.url + ", " + JSON.stringify(requestOptions.body);
        this.loggingService.log(this.serviceName, severity_enum.Severity.Error, message);
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
                    var subject = new Rx.BehaviorSubject(response);
                    return subject.asObservable();
                }
                else {
                    // TODO: RETRIEVE ERROR DETAILS; STATUS, MESSAGE; ETC. AND PROVIDE TO HANDLER;
                    return this.handleUnexpectedError(error);
                }
            }
            catch (ex) {
                var err = ex;
                var errorMessage = err.name + "; " + err.message;
                this.loggingService.log(this.serviceName, severity_enum.Severity.Error, errorMessage);
                return this.handleUnexpectedError(err);
            }
        }
        else {
            return this.handleUnexpectedError(error);
        }
    };
    HttpBaseService.prototype.handleUnexpectedError = function (error) {
        var response = this.createErrorResponse(error);
        var subject = new Rx.BehaviorSubject(response);
        return subject.asObservable();
    };
    HttpBaseService.prototype.createErrorResponse = function (error) {
        var message = 'Unexpected error while processing response.';
        var response = new ErrorResponse();
        if (error instanceof Error) {
            message = error.name + " - " + error.message;
            response.Exception = error;
        }
        response.Message = message;
        return response;
    };
    HttpBaseService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    HttpBaseService.ctorParameters = function () { return [
        { type: http.Http, },
        { type: logging_service.LoggingService, },
    ]; };
    return HttpBaseService;
}());

/**
 * Use this class as a base for application [services]. Add and/or implement
 * common behavior. For example, this base service class will
 * always initialize a new [ServiceContext] for the specified service
 * instance.
 */
var ServiceBase = (function () {
    function ServiceBase(loggingService) {
        this.loggingService = loggingService;
        this.serviceInitDateTime = new Date();
        /**
             * Use this public property to set/retrieve the user's
             * security token. Most of the web api calls will require an
             * authorization token for the authenticated user.
             */
        this.accessToken = '';
        this.serviceContext = new angularRulesEngine.ServiceContext();
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
        var message = new angularRulesEngine.ServiceMessage(error.name, error.message)
            .WithDisplayToUser(true)
            .WithMessageType(angularRulesEngine.MessageType.Error)
            .WithSource(this.serviceName);
        var logItem = message.toString() + "; " + error.stack;
        this.loggingService.log(this.serviceName, buildmotionLogging.Severity.Error, logItem);
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
        this.loggingService.log(this.serviceName, buildmotionLogging.Severity.Error, message);
        if (error && error._body) {
            try {
                var response_1 = this.createErrorResponse("Unable to validate credentials.");
                var subject_1 = new rxjs.BehaviorSubject(response_1);
                return subject_1.asObservable();
            }
            catch (e) {
                this.loggingService.log(this.serviceName, buildmotionLogging.Severity.Error, e.toString());
            }
        }
        // default return behavior;
        var response = this.createErrorResponse("Unable to validate credentials.");
        var subject = new rxjs.BehaviorSubject(response);
        return subject.asObservable();
    };
    ServiceBase.prototype.createErrorResponse = function (message) {
        var response = new ErrorResponse();
        response.Message = message;
        return response;
    };
    ServiceBase.prototype.finishRequest = function (sourceName) {
        var _this = this;
        this.loggingService.log(this.serviceName, buildmotionLogging.Severity.Information, "Request for [" + sourceName + "] by " + this.serviceName + " is complete.");
        if (this.serviceContext.hasErrors()) {
            this.loggingService.log(this.serviceName, buildmotionLogging.Severity.Information, "Preparing to write out the errors.");
            this.serviceContext.Messages.filter(function (f) { return f.MessageType === angularRulesEngine.MessageType.Error && f.DisplayToUser; })
                .forEach(function (e) { return _this.loggingService.log(_this.serviceName, buildmotionLogging.Severity.Error, e.toString()); });
        }
    };
    return ServiceBase;
}());

/**
 * Use this model to represent service error/message information from the
 * application's service APIs.
 *
 * The DisplayToUser boolean value indicates whether the message should be
 * displayed to the user if desired.
 */
var ServiceError = (function () {
    function ServiceError() {
    }
    return ServiceError;
}());

var ServiceResponse = (function () {
    function ServiceResponse() {
        this.Errors = new Array();
    }
    return ServiceResponse;
}());

exports.BuildMotionFoundationModule = BuildMotionFoundationModule;
exports.ActionBase = ActionBase;
exports.BusinessProviderBase = BusinessProviderBase;
exports.HttpBaseService = HttpBaseService;
exports.ServiceBase = ServiceBase;
exports.ErrorResponse = ErrorResponse;
exports.ServiceError = ServiceError;
exports.ServiceResponse = ServiceResponse;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=buildmotion-foundation.umd.js.map
