(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('buildmotion-alert'), require('buildmotion-logging'), require('rxjs/Observable'), require('@angular/http'), require('angular-actions/action/Action'), require('angular-rules-engine/validation/ValidationContext'), require('angular-rules-engine/service/index'), require('angular-actions/action/ActionResult'), require('angular-rules-engine/rules/CompositeRule'), require('angular-rules-engine/rules/RuleResult'), require('buildmotion-logging/logging.service'), require('buildmotion-logging/severity.enum'), require('rxjs/add/operator/cache'), require('rxjs/Rx')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'buildmotion-alert', 'buildmotion-logging', 'rxjs/Observable', '@angular/http', 'angular-actions/action/Action', 'angular-rules-engine/validation/ValidationContext', 'angular-rules-engine/service/index', 'angular-actions/action/ActionResult', 'angular-rules-engine/rules/CompositeRule', 'angular-rules-engine/rules/RuleResult', 'buildmotion-logging/logging.service', 'buildmotion-logging/severity.enum', 'rxjs/add/operator/cache', 'rxjs/Rx'], factory) :
	(factory((global['buildmotion-foundation'] = {}),global.ng.core,global.ng.common,global.buildmotionAlert,global.buildmotionLogging,global.Rx,global.ng.http,global.Action,global.angularRulesEngine.validation.prototype,global.index,global.ActionResult,global.CompositeRule,global.RuleResult,global.logging_service,global.severity_enum,null,global.Rx));
}(this, (function (exports,core,common,buildmotionAlert,buildmotionLogging,Observable,http,Action,ValidationContext,index,ActionResult,CompositeRule,RuleResult,logging_service,severity_enum,cache,Rx) { 'use strict';

var BuildMotionFoundationModule = /** @class */ (function () {
    function BuildMotionFoundationModule() {
    }
    return BuildMotionFoundationModule;
}());

/**
 * Use this model to represent service error/message information from the
 * application's service APIs.
 *
 * The DisplayToUser boolean value indicates whether the message should be
 * displayed to the user if desired.
 */

var ErrorResponse = /** @class */ (function () {
    function ErrorResponse() {
    }
    return ErrorResponse;
}());

/**
 * Use to create and execute HTTP service requests.
 * 1. Create Headers
 * 2. Create RequestOptions
 * 3. Execute Request
 */
var HttpBaseService = /** @class */ (function () {
    function HttpBaseService(http$$1, loggingService) {
        this.http = http$$1;
        this.loggingService = loggingService;
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
                    return this.handleUnexpectedError();
                }
            }
            catch (error) {
                this.loggingService.log(this.serviceName, severity_enum.Severity.Error, error.toString());
                return this.handleUnexpectedError();
            }
        }
        else {
            return this.handleUnexpectedError();
        }
    };
    HttpBaseService.prototype.handleUnexpectedError = function () {
        var response = this.createErrorResponse('Unexpected error while processing response.');
        var subject = new Rx.BehaviorSubject(response);
        return subject.asObservable();
    };
    HttpBaseService.prototype.createErrorResponse = function (message) {
        var response = new ErrorResponse();
        response.Message = message;
        return response;
    };
    return HttpBaseService;
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
var ActionBase = /** @class */ (function (_super) {
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
        this.loggingService.log(this.actionName, severity_enum.Severity.Information, "Preparing to determine if the action contains validation errors in " + this.actionName);
        if (this.validationContext.hasRuleViolations()) {
            this.loggingService.log(this.actionName, severity_enum.Severity.Information, "The target contains validation errors in " + this.actionName);
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
        if (this.actionResult === ActionResult.ActionResult.Fail) {
            this.serviceContext.Messages.forEach(function (e) {
                if (e.MessageType === index.MessageType.Error) {
                    _this.loggingService.log(_this.actionName, severity_enum.Severity.Error, e.toString());
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
        this.loggingService.log(this.actionName, severity_enum.Severity.Information, "Running [validateActionResult] for " + this.actionName + ".");
        // determine the status of the action based on any rule violations;
        if (this._validationContext.hasRuleViolations()) {
            this.loggingService.log(this.actionName, severity_enum.Severity.Error, "The " + this.actionName + " contains rule violations.");
            this.actionResult = ActionResult.ActionResult.Fail;
            var errorResponse = new ErrorResponse();
            errorResponse.IsSuccess = false;
            errorResponse.Message = "Validation errors exist.";
            this.response = Observable.Observable.throw(errorResponse);
        }
        this.actionResult = this.serviceContext.isGood() ? ActionResult.ActionResult.Success : ActionResult.ActionResult.Fail;
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
        if (ruleResult.rulePolicy instanceof CompositeRule.CompositeRule) {
            var composite = ruleResult.rulePolicy;
            if (composite && composite.hasErrors) {
                var errors = composite.results.filter(function (result) { return !result.isValid && result.rulePolicy.isDisplayable; });
                errors.forEach(function (errorResult) {
                    _this.publishRuleResult(errorResult);
                    if (errorResult.rulePolicy instanceof CompositeRule.CompositeRule) {
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
        var serviceMessage = new index.ServiceMessage(ruleResult.rulePolicy.name, ruleResult.rulePolicy.message, index.MessageType.Error);
        serviceMessage.DisplayToUser = ruleResult.rulePolicy.isDisplayable;
        serviceMessage.Source = this.actionName;
        this.serviceContext.Messages.push(serviceMessage);
        this.loggingService.log(this.actionName, severity_enum.Severity.Error, "" + serviceMessage.toString());
    };
    return ActionBase;
}(Action.Action));

/**
 * Use the business provider base class to access common elements of the business provider.
 *
 * serviceContext: This is initialized for each instance of a business provider - its purpose is to collect information during the processing of business logic.
 */
var BusinessProviderBase = /** @class */ (function () {
    function BusinessProviderBase(loggingService) {
        this.loggingService = loggingService;
        this.loggingService.log(this.serviceName, severity_enum.Severity.Information, "Running constructor for the [BusinessProviderBase].");
    }
    BusinessProviderBase.prototype.handleError = function (error) {
        var _this = this;
        var message = new index.ServiceMessage(error.name, error.message)
            .WithDisplayToUser(true)
            .WithMessageType(index.MessageType.Error)
            .WithSource(this.serviceName);
        this.loggingService.log(this.serviceName, severity_enum.Severity.Error, message.toString());
        this.serviceContext.Messages.forEach(function (e) {
            if (e.DisplayToUser) {
                _this.loggingService.log(_this.serviceName, severity_enum.Severity.Error, e.toString());
            }
        });
    };
    BusinessProviderBase.prototype.finishRequest = function (sourceName) {
        var _this = this;
        this.loggingService.log(this.serviceName, severity_enum.Severity.Information, "Request for [" + sourceName + "] by " + this.serviceName + " is complete.");
        if (this.serviceContext.hasErrors()) {
            this.loggingService.log(this.serviceName, severity_enum.Severity.Information, "Preparing to write out the errors.");
            this.serviceContext.Messages.filter(function (f) { return f.DisplayToUser && f.MessageType === index.MessageType.Error; })
                .forEach(function (e) { return _this.loggingService.log(_this.serviceName, severity_enum.Severity.Error, e.toString()); });
        }
    };
    return BusinessProviderBase;
}());

/**
 * Use this class as a base for application [services]. Add and/or implement
 * common behavior. For example, this base service class will
 * always initialize a new [ServiceContext] for the specified service
 * instance.
 */
var ServiceBase = /** @class */ (function () {
    function ServiceBase(loggingService) {
        this.loggingService = loggingService;
    }
    ServiceBase.prototype.extractData = function (res) {
        var body = res.json();
        return body.data || {};
    };
    ServiceBase.prototype.handleError = function (error) {
        var _this = this;
        var message = new index.ServiceMessage(error.name, error.message)
            .WithDisplayToUser(true)
            .WithMessageType(index.MessageType.Error)
            .WithSource(this.serviceName);
        this.loggingService.log(this.serviceName, severity_enum.Severity.Error, message.toString());
        this.serviceContext.Messages.forEach(function (e) {
            if (e.MessageType === index.MessageType.Error && e.DisplayToUser) {
                _this.loggingService.log(_this.serviceName, severity_enum.Severity.Error, e.toString());
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
        this.loggingService.log(this.serviceName, severity_enum.Severity.Error, message);
        if (error && error._body) {
            try {
                var response_1 = error.json();
                var subject_1 = new Rx.BehaviorSubject(response_1);
                return subject_1.asObservable();
            }
            catch (error) {
                this.loggingService.log(this.serviceName, severity_enum.Severity.Error, error.toString());
            }
        }
        // default return behavior;
        var response = this.createErrorResponse('Unexpected error while processing response.');
        var subject = new Rx.BehaviorSubject(response);
        return subject.asObservable();
    };
    ServiceBase.prototype.handleOAuthError = function (error, requestOptions) {
        var message = error.toString() + " " + requestOptions.url + ", " + JSON.stringify(requestOptions.body);
        this.loggingService.log(this.serviceName, severity_enum.Severity.Error, message);
        if (error && error._body) {
            try {
                var response_2 = this.createErrorResponse("Unable to validate credentials.");
                var subject_2 = new Rx.BehaviorSubject(response_2);
                return subject_2.asObservable();
            }
            catch (e) {
                this.loggingService.log(this.serviceName, severity_enum.Severity.Error, e.toString());
            }
        }
        // default return behavior;
        var response = this.createErrorResponse("Unable to validate credentials.");
        var subject = new Rx.BehaviorSubject(response);
        return subject.asObservable();
    };
    ServiceBase.prototype.createErrorResponse = function (message) {
        var response = new ErrorResponse();
        response.Message = message;
        return response;
    };
    ServiceBase.prototype.finishRequest = function (sourceName) {
        var _this = this;
        this.loggingService.log(this.serviceName, severity_enum.Severity.Information, "Request for [" + sourceName + "] by " + this.serviceName + " is complete.");
        if (this.serviceContext.hasErrors()) {
            this.loggingService.log(this.serviceName, severity_enum.Severity.Information, "Preparing to write out the errors.");
            this.serviceContext.Messages.filter(function (f) { return f.MessageType === index.MessageType.Error && f.DisplayToUser; })
                .forEach(function (e) { return _this.loggingService.log(_this.serviceName, severity_enum.Severity.Error, e.toString()); });
        }
    };
    return ServiceBase;
}());

exports.BuildMotionFoundationModule = BuildMotionFoundationModule;
exports.ActionBase = ActionBase;
exports.BusinessProviderBase = BusinessProviderBase;
exports.HttpBaseService = HttpBaseService;
exports.ServiceBase = ServiceBase;

Object.defineProperty(exports, '__esModule', { value: true });

})));
