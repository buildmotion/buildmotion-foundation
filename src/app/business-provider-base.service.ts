import { LoggingService } from 'buildmotion-logging/logging.service';

import { ServiceContext } from 'angular-rules-engine/service/ServiceContext';
import { ServiceMessage } from 'angular-rules-engine/service/ServiceMessage';
import { MessageType } from 'angular-rules-engine/service/MessageType';
import { Severity } from 'buildmotion-logging/severity.enum';

/**
 * Use the business provider base class to access common elements of the business provider.
 *
 * serviceContext: This is initialized for each instance of a business provider - its purpose is to collect information during the processing of business logic.
 */
export class BusinessProviderBase {
    serviceName: string;
    serviceContext: ServiceContext;
    accessToken: string;

    constructor(public loggingService: LoggingService) {
        this.loggingService.log(this.serviceName, Severity.Information, `Running constructor for the [BusinessProviderBase].`);
    }

    handleError(error): void {
        let message = new ServiceMessage(error.name, error.message)
            .WithDisplayToUser(true)
            .WithMessageType(MessageType.Error)
            .WithSource(this.serviceName);

        this.loggingService.log(this.serviceName, Severity.Error, message.toString());

        this.serviceContext.Messages.forEach(e => {
            if (e.DisplayToUser) {
                this.loggingService.log(this.serviceName, Severity.Error, e.toString());
            }
        });
    }

    finishRequest(sourceName: string): void {
        this.loggingService.log(this.serviceName, Severity.Information, `Request for [${sourceName}] by ${this.serviceName} is complete.`);
        if (this.serviceContext.hasErrors()) {
            this.loggingService.log(this.serviceName, Severity.Information, `Preparing to write out the errors.`);
            this.serviceContext.Messages.filter(f => f.DisplayToUser && f.MessageType === MessageType.Error)
                .forEach(e => this.loggingService.log(this.serviceName, Severity.Error, e.toString()));
        }
    }
}
