export declare function debounce<T extends (...args: any[]) => void>(fn: T, wait?: number, leading?: boolean): (this: unknown, ...args: Parameters<T>) => void;
