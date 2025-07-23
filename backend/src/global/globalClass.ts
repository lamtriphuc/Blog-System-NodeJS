export class ResponseData<T> {
    constructor(
        public data: T | T[] | null,
        public statusCode: number,
        public message: string
    ) { }
}