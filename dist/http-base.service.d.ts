import { Headers, Http, RequestMethod, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { LoggingService } from '@buildmotion/logging/';
import { ErrorResponse } from './models/error-response.model';
/**
 * Use to create and execute HTTP service requests.
 * 1. Create Headers
 * 2. Create RequestOptions
 * 3. Execute Request
 */
export declare class HttpBaseService {
    http: Http;
    loggingService: LoggingService;
    serviceName: string;
    accessToken: string;
    constructor(http: Http, loggingService: LoggingService);
    /**
     * Use to create a [Header] for [multipart/form-data].
     */
    createMultipartFormDataHeader(requiresAuthToken: boolean): Headers;
    /**
     * Use to create a [Header] for Content-Type [application/x-www-form-urlencoded].
     */
    createFormUrlencodedHeader(): Headers;
    /**
     * Use to create a [Header] for the HTTP request. If the [requiresAuthToken] indicator
     * is true, the request will use the current Authorization security token.
     * @param isSecure
     */
    createHeader(requiresAuthToken: boolean): Headers;
    /**
     * Use to create a new instance of a [RequestOptions] object.
     * See RequestOptions: https://angular.io/docs/ts/latest/api/http/index/RequestOptions-class.html
     * See RequestMethod: https://angular.io/docs/ts/latest/api/http/index/RequestMethod-enum.html
     */
    createRequestOptions(method: RequestMethod, headers: Headers, url: string, body: any): RequestOptions;
    /**
     * Use to execute an HTTP request using the specified header and URL.
     * See Request: https://angular.io/docs/ts/latest/api/http/index/Request-class.html
     */
    executeRequest(requestOptions: RequestOptions): Observable<any>;
    /**
     * Use to handle HTTP errors when calling web api(s).
     */
    handleHttpError(error: any, requestOptions: RequestOptions): Observable<Response>;
    handleUnexpectedError(error?: Error): Observable<any>;
    createErrorResponse(error?: Error): ErrorResponse;
}
