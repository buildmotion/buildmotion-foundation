import { LoggingService } from 'buildmotion-logging/logging.service';
import { ServiceContext } from 'angular-rules-engine/service/index';
/**
 * Use the business provider base class to access common elements of the business provider.
 *
 * serviceContext: This is initialized for each instance of a business provider - its purpose is to collect information during the processing of business logic.
 */
export declare class BusinessProviderBase {
    loggingService: LoggingService;
    serviceName: string;
    serviceContext: ServiceContext;
    accessToken: string;
    constructor(loggingService: LoggingService);
    handleError(error: any): void;
    finishRequest(sourceName: string): void;
}
