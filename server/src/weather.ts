import { Request, Response } from 'express';
import { db } from './datastore';
import fetch from 'node-fetch';
import * as webpush from 'web-push';
import { WeatherForecastResponse } from './types/apixu-weather';

export class Weather {
    public static get(req: Request, res: Response): void {
        const key = '6eccf768843d468db0d141839182808';
        const lat = req.query.lat;
        const lon = req.query.lon;
    
        fetch(`http://api.apixu.com/v1/forecast.json?key=${key}&q=${lat},${lon}&days=2`).then(res => res.json()).then((data: WeatherForecastResponse) => {
            const forecast = data.forecast.forecastday[data.forecast.forecastday.length - 1];
            const temperature = forecast.day.avgtemp_c;
            const cold = temperature <= 18;
            let message = cold ? 'It will be a cold, take a coat.' : 'It will be warm, don\'t forget your sunglasses!';
    
            db.find({}, (err: Error, docs: PushSubscriptions) => {
                docs.forEach((pushSubscription: PushSubscriptionModel) => {
                    if (pushSubscription.name) {
                        message = `Hi ${pushSubscription.name}. ${message}`;
                    }
    
                    const payload = JSON.stringify({ message: message, title: `Your holiday temperature will be ${temperature} degrees!` });
                    webpush.sendNotification(pushSubscription.push, payload, {});
                });
            });
        });
    
        res.send('Notification sent!');
    }
}