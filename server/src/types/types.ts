type PushSubscriptions = PushSubscriptionModel[];

interface PushSubscriptionModel {
    push: PushSubscriptionSettings;
    name: string;
}

interface PushSubscriptionSettings {
    endpoint: string;
    keys: {
        p256dh: ArrayBuffer | null;
        auth: ArrayBuffer | null;
    }
}