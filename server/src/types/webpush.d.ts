declare module 'web-push' {
    import { IncomingHttpHeaders } from "http";

    interface PushSubscriptionSettings {
        endpoint: string;
        keys: {
            p256dh: ArrayBuffer | null;
            auth: ArrayBuffer | null;
        }
    }
    
    interface SendNotificationOptions {
        gcmAPIKey?: string;
        vapidDetails?: {
          subject: string;
          publicKey: string;
          privateKey: string;
        };
        TTL?: number;
        headers?: {};
        contentEncoding?: string;
        proxy?: string;
    }
    
    export interface Response {
        statusCode: number;
        headers: IncomingHttpHeaders;
        body: any;
    } 

    export function sendNotification(pushSubscription: PushSubscriptionSettings, payload?: string, options?: SendNotificationOptions): Promise<Response>;
    export function setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
}