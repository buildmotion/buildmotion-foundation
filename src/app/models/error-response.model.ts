import { ServiceError} from './service-error.model';

export class ErrorResponse {
    IsSuccess: boolean = false; // default for ErrorResponse
    Message: string;
    Errors: Array<ServiceError> = new Array<ServiceError>();
    Exception: any;
}
