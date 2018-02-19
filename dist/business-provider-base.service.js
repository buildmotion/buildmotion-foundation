/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { ServiceMessage } from "angular-rules-engine";
import { MessageType } from "angular-rules-engine";
import { Severity } from "@buildmotion/logging";
/**
 * Use the business provider base class to access common elements of the business provider.
 *
 * serviceContext: This is initialized for each instance of a business provider - its purpose is to collect information during the processing of business logic.
 */
var /**
 * Use the business provider base class to access common elements of the business provider.
 *
 * serviceContext: This is initialized for each instance of a business provider - its purpose is to collect information during the processing of business logic.
 */
BusinessProviderBase = (function () {
    function BusinessProviderBase(loggingService) {
        this.loggingService = loggingService;
        this.loggingService.log(this.serviceName, Severity.Information, "Running constructor for the [BusinessProviderBase].");
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
     * @param {?} error An unexpected application error that implements the [Error] interface.
     *
     * interface Error {
     *  name: string;
     *  message: string;
     *  stack?: string;
     * }
     * @return {?}
     */
    BusinessProviderBase.prototype.handleUnexpectedError = /**
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
     * @param {?} sourceName
     * @return {?}
     */
    BusinessProviderBase.prototype.finishRequest = /**
     * @param {?} sourceName
     * @return {?}
     */
    function (sourceName) {
        var _this = this;
        this.loggingService.log(this.serviceName, Severity.Information, "Request for [" + sourceName + "] by " + this.serviceName + " is complete.");
        if (this.serviceContext.hasErrors()) {
            this.loggingService.log(this.serviceName, Severity.Information, "Preparing to write out the errors.");
            this.serviceContext.Messages.filter(function (f) { return f.DisplayToUser && f.MessageType === MessageType.Error; })
                .forEach(function (e) { return _this.loggingService.log(_this.serviceName, Severity.Error, e.toString()); });
        }
    };
    return BusinessProviderBase;
}());
/**
 * Use the business provider base class to access common elements of the business provider.
 *
 * serviceContext: This is initialized for each instance of a business provider - its purpose is to collect information during the processing of business logic.
 */
export { BusinessProviderBase };
function BusinessProviderBase_tsickle_Closure_declarations() {
    /** @type {?} */
    BusinessProviderBase.prototype.serviceName;
    /** @type {?} */
    BusinessProviderBase.prototype.serviceContext;
    /** @type {?} */
    BusinessProviderBase.prototype.accessToken;
    /** @type {?} */
    BusinessProviderBase.prototype.loggingService;
}
//# sourceMappingURL=business-provider-base.service.js.map