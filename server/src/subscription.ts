import { Request, Response } from 'express';
import * as Datastore from 'nedb';
import { db } from './datastore';

export class Subscription {
    public static subscribe(req: Request, res: Response): void {
        const endpoint = req.body['notificationEndPoint'];
        const publicKey = req.body['publicKey'];
        const auth = req.body['auth'];

        function alreadySubscribed(subscription: PushSubscriptionModel): Datastore.CursorCount {
            return db.count({ push: subscription.push });
        }

        const pushSubscription: PushSubscriptionModel = {
            push: {
                endpoint: endpoint,
                keys: {
                    p256dh: publicKey,
                    auth: auth
                }
            },
            name: ''
        };

        alreadySubscribed(pushSubscription).exec((err: Error, count: number) => {
            if (count > 0) {
                res.send('Already subscribed!');
            } else {
                db.insert(pushSubscription);
            
                res.send('Subscription accepted!');
            }
        });
    }

    public static unsubscribe(req: Request, res: Response): void {
        const endpoint = req.body['endpoint'];

        db.remove({ 'push.endpoint': endpoint }, (err: Error, numRemoved: number) => {
            if (numRemoved > 0) {
                res.send('Subscription removed!');
            } else {
                res.send('No subscriptions removed');
            }
        });
    }

    public static subscribers(req: Request, res: Response): void {
        db.find({}, (err: Error, docs: PushSubscriptions) => {
            res.send(docs);
        });
    }

    public static isSubscribed(req: Request, res: Response): void {
        const endpoint = req.body['endpoint'];

        db.count({ 'push.endpoint': endpoint }, (err, count) => {
            res.send(count > 0);
        });
    }
}