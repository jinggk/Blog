export interface ResponseData {
    Code: number;
    Message: string;
    Value: any;
}

export interface TimeoutRequest {
    api: string;
    param: Object | string;
    method: string;
}
