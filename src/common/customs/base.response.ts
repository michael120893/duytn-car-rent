export class ResponseUtil {
    static generateResponse<T>(responseOptions: ResponseOptions<T>): Promise<T> | T | any {
        if (responseOptions.response instanceof Promise) {
            return responseOptions.response.then((response: T) => {
                if (responseOptions.isArray) {
                    return { data: { items: response } }
                } else {
                    return { data: response }
                }

            }) as Promise<T>;
        }
        if (responseOptions.isArray) {
            return { data: { items: responseOptions.response } }
        } else {
            return { data: responseOptions.response }
        }
    }
}

export interface ResponseOptions<T> {
    response: Promise<T> | any;
    isArray?: boolean;
}