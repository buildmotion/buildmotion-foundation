var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { Action } from 'angular-actions/action/Action';
import { ValidationContext } from 'angular-rules-engine/validation/ValidationContext';
import { ServiceMessage } from 'angular-rules-engine/service/ServiceMessage';
import { MessageType } from 'angular-rules-engine/service/MessageType';
import { ServiceContext } from 'angular-rules-engine/service/ServiceContext';
import { ActionResult } from 'angular-actions/action/ActionResult';
import { CompositeRule } from 'angular-rules-engine/rules/CompositeRule';
import { RuleResult } from 'angular-rules-engine/rules/RuleResult';
import { LoggingService } from 'buildmotion-logging/logging.service';
import { Severity } from 'buildmotion-logging/severity.enum';
import { HttpBaseService } from './http-base.service';
import { ErrorResponse } from './models/error-response.model';
import { ServiceError } from './models/service-error.model';
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
var /**
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
ActionBase = /** @class */ (function (_super) {
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
        this.loggingService.log(this.actionName, Severity.Information, "Preparing to determine if the action contains validation errors in " + this.actionName);
        if (this.validationContext.hasRuleViolations()) {
            this.loggingService.log(this.actionName, Severity.Information, "The target contains validation errors in " + this.actionName);
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
        if (this.actionResult === ActionResult.Fail) {
            this.serviceContext.Messages.forEach(function (e) {
                if (e.MessageType === MessageType.Error) {
                    _this.loggingService.log(_this.actionName, Severity.Error, e.toString());
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
        this.loggingService.log(this.actionName, Severity.Information, "Running [validateActionResult] for " + this.actionName + ".");
        // determine the status of the action based on any rule violations;
        if (this._validationContext.hasRuleViolations()) {
            this.loggingService.log(this.actionName, Severity.Error, "The " + this.actionName + " contains rule violations.");
            this.actionResult = ActionResult.Fail;
            var errorResponse = new ErrorResponse();
            errorResponse.IsSuccess = false;
            errorResponse.Message = "Validation errors exist.";
            this.response = Observable.throw(errorResponse);
        }
        this.actionResult = this.serviceContext.isGood() ? ActionResult.Success : ActionResult.Fail;
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
        if (ruleResult.rulePolicy instanceof CompositeRule) {
            var composite = ruleResult.rulePolicy;
            if (composite && composite.hasErrors) {
                var errors = composite.results.filter(function (result) { return !result.isValid && result.rulePolicy.isDisplayable; });
                errors.forEach(function (errorResult) {
                    _this.publishRuleResult(errorResult);
                    if (errorResult.rulePolicy instanceof CompositeRule) {
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
        var serviceMessage = new ServiceMessage(ruleResult.rulePolicy.name, ruleResult.rulePolicy.message, MessageType.Error);
        serviceMessage.DisplayToUser = ruleResult.rulePolicy.isDisplayable;
        serviceMessage.Source = this.actionName;
        this.serviceContext.Messages.push(serviceMessage);
        this.loggingService.log(this.actionName, Severity.Error, "" + serviceMessage.toString());
    };
    return ActionBase;
}(Action));
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
export { ActionBase };
//# sourceMappingURL=action-base.action.js.map