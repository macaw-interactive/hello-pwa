
import * as express from 'express';
import { Request, Response } from 'express';
import * as webpush from 'web-push';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Subscription } from './subscription';
import { Save } from './save';
import { Notify } from './notify';
import { Weather } from './weather';
import { Admin } from './admin';

require('dotenv').config();

const app = express();
app.use(cors());

// The reason for the email address is so that if a web push service needs to get in touch with the sender, they have some information that will enable them to. (https://developers.google.com/web/fundamentals/push-notifications/sending-messages-with-web-push-libraries)
const vapidSubject = 'mailto:erwin.smit@macaw.nl';
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (publicVapidKey && privateVapidKey) {
    webpush.setVapidDetails(vapidSubject, publicVapidKey, privateVapidKey);
}

app.post('/subscribe',      Subscription.subscribe);
app.post('/unsubscribe',    Subscription.unsubscribe);
app.post('/is-subscribed',  Subscription.isSubscribed);
app.get('/subscribers',     Subscription.subscribers);

app.post('/save/name',      Save.myName);

// E.g. /notify/all?title=Take%20a%20break!&message=We%20found%20some%20nice%20campings%20nearby.%20Come%20take%20a%20look.&clickTarget=http://www.nu.nl
app.get('/notify/all',      Notify.all);

// // E.g. /weather?lon=4.7023787&lat=52.2910026
app.get('/weather',         Weather.get);

app.get('/admin',           Admin.get);
app.get('/admin/clear-subscriptions', Admin.clearSubscriptions);

app.get('/', (req: Request, res: Response) => res.send('Hello World!'));

const port = process.env.PORT || 3001;

app.listen(port, () => console.log('Example app listening on port ' + port));