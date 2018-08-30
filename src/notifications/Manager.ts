import { UrlB64 } from './UrlB64';

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://hellopwa.azurewebsites.net';

export class NotificationManager {
    // We need to save the endpoint somewhere else. We need to save it per client as unique identifier...
    private static endpoint: string;

    public static subscribe(): Promise<{}> {
      return new Promise((resolve, reject) => { 

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((reg: ServiceWorkerRegistration) => {
              var subscribeParams: PushSubscriptionOptionsInit = {
                userVisibleOnly: true,
                applicationServerKey: undefined
              };
        
              //Setting the public key of our VAPID key pair.
              var applicationServerKey = UrlB64.toUint8Array('BHickT1zRpYQN7XQyPs4gd3oV5wUS7JJGgpdyLsqHyBb9dh1NUTvc2Py48gVl0oDsV0S3vF7Qk9oYfDKuFyaj8w');
              subscribeParams.applicationServerKey = applicationServerKey;
        
              reg.pushManager.subscribe(subscribeParams)
                  .then(function (subscription: PushSubscription): void {
        
                      // Update status to subscribe current user on server, and to let
                      // other users know this user has subscribed
                      NotificationManager.endpoint = subscription.endpoint;
                      var key = subscription.getKey('p256dh');
                      var auth = subscription.getKey('auth');
                      NotificationManager.sendSubscriptionToServer(NotificationManager.endpoint, key, auth);
                      // isSubscribed = true;
                      // makeButtonUnsubscribable();

                      resolve();
                  })
                  .catch(e => {
                      // A problem occurred with the subscription.
                      console.log('Unable to subscribe to push.', e);
                      reject();
                  });
            });
          }
      });
    }

    public static unsubscribe(): Promise<{}> {
      return fetch(`${baseUrl}/unsubscribe`, {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: NotificationManager.endpoint
        })
      });
    }

    public static sendSubscriptionToServer(endpoint: string, key: ArrayBuffer | null, auth: ArrayBuffer | null): void {
        if (!key || !auth) {
          return;
        }
      
        var encodedKey = btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
        var encodedAuth = btoa(String.fromCharCode.apply(null, new Uint8Array(auth)));
      
        fetch(`${baseUrl}/subscribe`, {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            publicKey: encodedKey, 
            auth: encodedAuth, 
            notificationEndPoint: endpoint
          })
        });
    }

    public static requestPermission(): void {
      Notification.requestPermission().then(function(result: NotificationPermission): void {
        if (result === 'denied') {
          console.log('Permission wasn\'t granted. Allow a retry.');
          return;
        }
        
        if (result === 'default') {
          console.log('The permission request was dismissed.');
          return;
        }
      });
  
      NotificationManager.subscribe();
    }

    public static holidayFaker(): void {        
      fetch(`${baseUrl}/weather?lon=4.7023787&lat=52.2910026`);
    }

    public static broadcastNotification(): void {
      fetch(`${baseUrl}/notify/all?title=Take%20a%20break!&message=We%20found%20some%20nice%20campings%20nearby.%20Come%20take%20a%20look.&clickTarget=https://www.macaw.nl`);
    }

    public static saveName(name: string): void {
      fetch(`${baseUrl}/save/name`, {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: NotificationManager.endpoint,
          name: name
        })
      });
    }

    public static getSubscribedStatus(): Promise<boolean|undefined> {
      if (NotificationManager.endpoint) {
        return fetch(`${baseUrl}/is-subscribed`, {
            method: 'post',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              endpoint: NotificationManager.endpoint
            })
          })
          .then(res => res.json());
      } else {
        return new Promise((resolve, reject) => { resolve(undefined); });
      }
    }
}