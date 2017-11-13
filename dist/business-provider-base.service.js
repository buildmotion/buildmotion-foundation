import { LoggingService } from 'buildmotion-logging/logging.service';
import { ServiceContext } from 'angular-rules-engine/service/index';
import { ServiceMessage } from 'angular-rules-engine/service/index';
import { MessageType } from 'angular-rules-engine/service/index';
import { Severity } from 'buildmotion-logging/severity.enum';
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
BusinessProviderBase = /** @class */ (function () {
    function BusinessProviderBase(loggingService) {
        this.loggingService = loggingService;
        this.loggingService.log(this.serviceName, Severity.Information, "Running constructor for the [BusinessProviderBase].");
    }
    BusinessProviderBase.prototype.handleError = function (error) {
        var _this = this;
        var message = new ServiceMessage(error.name, error.message)
            .WithDisplayToUser(true)
            .WithMessageType(MessageType.Error)
            .WithSource(this.serviceName);
        this.loggingService.log(this.serviceName, Severity.Error, message.toString());
        this.serviceContext.Messages.forEach(function (e) {
            if (e.DisplayToUser) {
                _this.loggingService.log(_this.serviceName, Severity.Error, e.toString());
            }
        });
    };
    BusinessProviderBase.prototype.finishRequest = function (sourceName) {
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
//# sourceMappingURL=business-provider-base.service.js.map