
export interface NightwatchError extends Error {
    detailedErr: string;
    link: string;
    help: string[];
}

export interface Deferred<T> {
    promise: Promise<T> | null;
    resolve: ((value: T | PromiseLike<T>) => void) | null;
    reject: ((reason?: any) => void) | null;
}
