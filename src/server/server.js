const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser')
const util = require('util');
const cors = require('cors');
const fetch = require('node-fetch');

require('dotenv').config();

const app = express();
app.use(cors());

// TODO: save subscribers somewhere
let subscribers = [];

// The reason for the email address is so that if a web push service needs to get in touch with the sender, they have some information that will enable them to. (https://developers.google.com/web/fundamentals/push-notifications/sending-messages-with-web-push-libraries)
const vapidSubject = 'mailto:erwin.smit@macaw.nl';
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

console.log("publicVapidKey", process.env.PUBLIC_VAPID_KEY);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

webpush.setVapidDetails(vapidSubject, publicVapidKey, privateVapidKey);

function alreadySubscribed(subscription) {
    const subscriptions = JSON.stringify(subscribers);

    return subscriptions.indexOf(JSON.stringify(subscription)) > -1;
}

app.post('/subscribe', function (req, res) {
    const endpoint = req.body['notificationEndPoint'];
    const publicKey = req.body['publicKey'];
    const auth = req.body['auth'];

    const pushSubscription = {
        endpoint: endpoint,
        keys: {
            p256dh: publicKey,
            auth: auth
        }
    };

    if (alreadySubscribed(pushSubscription)) {
        res.send('Already subscribed!');
        return;
    }

    subscribers.push({ push: pushSubscription, name: '' });

    res.send('Subscription accepted!');
});

app.post('/unsubscribe', function (req, res) {
    const endpoint = req.body['notificationEndPoint'];

    subscribers = subscribers.filter(subscriber => { endpoint === subscriber.push.endpoint });

    res.send('Subscription removed!');
});

app.get('/subscribers', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(subscribers));
});

app.post('/save/name', function (req, res) {
    const endpoint = req.body['endpoint'];
    const name = req.body['name'];

    subscribers.forEach(subscriber => {
        console.log(subscriber, endpoint, name);
        if (subscriber.push.endpoint === endpoint) {
            subscriber.name = name;
        }
    });

    res.send('Saved name!');
});

// E.g. /notify/all?title=Take%20a%20break!&message=We%20found%20some%20nice%20campings%20nearby.%20Come%20take%20a%20look.&clickTarget=http://www.nu.nl
app.get('/notify/all', function (req, res) {
    let message = req.query.message || `test test test`;
    let clickTarget = req.query.clickTarget || `http://macaw.nl`;
    let title = req.query.title || `Push notification received!`;

    subscribers.forEach(function (pushSubscription) {
        //Can be anything you want. No specific structure necessary.
        let payload = JSON.stringify({ message: message, clickTarget: clickTarget, title: title });

        webpush.sendNotification(pushSubscription.push, payload, {}).then((response) => {
            console.log("Status : " + util.inspect(response.statusCode));
            console.log("Headers : " + JSON.stringify(response.headers));
            console.log("Body : " + JSON.stringify(response.body));
        }).catch((error) => {
            console.log("Status : " + util.inspect(error.statusCode));
            console.log("Headers : " + JSON.stringify(error.headers));
            console.log("Body : " + JSON.stringify(error.body));
        });
    });

    res.send('Notification sent!');
});

// E.g. /weather?lon=4.7023787&lat=52.2910026
app.get('/weather', function (req, res) {
    const key = '6eccf768843d468db0d141839182808';
    const lat = req.query.lat;
    const lon = req.query.lon;

    fetch(`http://api.apixu.com/v1/forecast.json?key=${key}&q=${lat},${lon}&days=2`).then(function (res) { return res.json(); }).then(function (data) {
        const forecast = data.forecast.forecastday[data.forecast.forecastday.length - 1];
        const temperature = parseFloat(forecast.day.avgtemp_c);
        const cold = temperature <= 18;
        let message = cold ? 'It will be a cold, take a coat.' : 'It will be warm, don\'t forget your sunglasses!';

        subscribers.forEach(function (pushSubscription) {
            if (pushSubscription.name) {
                message = `Hi ${pushSubscription.name}. ${message}`;
            }

            const payload = JSON.stringify({ message: message, title: `Your holiday temperature will be ${temperature} degrees!` });
            webpush.sendNotification(pushSubscription.push, payload, {});
        });
    });

    res.send('Notification sent!');
});

app.get('/', (req, res) => res.send('Hello World!'))

const port = process.env.PORT || 3001;

app.listen(port, () => console.log('Example app listening on port ' + port))