const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser')
const util = require('util');
var cors = require('cors');

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

app.post('/subscribe', function (req, res) {
  let endpoint = req.body['notificationEndPoint'];
  let publicKey = req.body['publicKey'];
  let auth = req.body['auth'];

  let pushSubscription = {
      endpoint: endpoint,
      keys: {
          p256dh: publicKey,
          auth: auth
      }
  };

  subscribers.push(pushSubscription);

  res.send('Subscription accepted!');
});

app.post('/unsubscribe', function (req, res) {
  let endpoint = req.body['notificationEndPoint'];

  subscribers = subscribers.filter(subscriber => { endpoint == subscriber.endpoint });

  res.send('Subscription removed!');
});

app.get('/notify/all', function (req, res) {
  let message = req.query.message || `test test test`;
  let clickTarget = req.query.clickTarget || `http://macaw.nl`;
  let title = req.query.title || `Push notification received!`;

  subscribers.forEach(function(pushSubscription) {
      //Can be anything you want. No specific structure necessary.
      let payload = JSON.stringify({message : message, clickTarget: clickTarget, title: title});

      webpush.sendNotification(pushSubscription, payload, {}).then((response) =>{
          console.log("Status : "+util.inspect(response.statusCode));
          console.log("Headers : "+JSON.stringify(response.headers));
          console.log("Body : "+JSON.stringify(response.body));
      }).catch((error) =>{
          console.log("Status : "+util.inspect(error.statusCode));
          console.log("Headers : "+JSON.stringify(error.headers));
          console.log("Body : "+JSON.stringify(error.body));
      });
  });

  res.send('Notification sent!');
});

app.get('/', (req, res) => res.send('Hello World!'))

const port = process.env.PORT || 3001;

app.listen(port, () => console.log('Example app listening on port ' + port))