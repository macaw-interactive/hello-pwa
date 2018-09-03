import { Request, Response } from 'express';
import * as util from 'util';
import * as webpush from 'web-push';
import { db } from './datastore';

export class Notify {
    public static all(req: Request, res: Response): void {
        let message = req.query.message || `test test test`;
        let clickTarget = req.query.clickTarget || `http://macaw.nl`;
        let title = req.query.title || `Push notification received!`;
    
        db.find({}, (err: Error, docs: PushSubscriptions) => {
            docs.forEach((pushSubscription: PushSubscriptionModel) => {
                //Can be anything you want. No specific structure necessary.
                let payload = JSON.stringify({ message: message, clickTarget: clickTarget, title: title });
        
                webpush.sendNotification(pushSubscription.push, payload, {}).then((response: webpush.Response) => {
                    console.log("Status : " + util.inspect(response.statusCode));
                    console.log("Headers : " + JSON.stringify(response.headers));
                    console.log("Body : " + JSON.stringify(response.body));
                }).catch((error: Error) => {
                    console.log("Error : " + error);
                });
            });
    
            res.send('Notification sent!');
        });
    }
}