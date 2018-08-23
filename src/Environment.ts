export class Environment {
    public static get isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }

    // Are we on the server? Note that sometimes libs define windows as {}, so extra checks are needed.
    public static get isServer(): boolean {
        return typeof window === 'undefined' ||
        (Object.keys(window).length === 0 && window.constructor === Object);
    }
}