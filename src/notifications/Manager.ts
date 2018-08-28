import { UrlB64 } from './UrlB64';

export class NotificationManager {
    public static subscribeUser(): void {
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
                      var endpoint = subscription.endpoint;
                      var key = subscription.getKey('p256dh');
                      var auth = subscription.getKey('auth');
                      NotificationManager.sendSubscriptionToServer(endpoint, key, auth);
                      // isSubscribed = true;
                      // makeButtonUnsubscribable();
                  })
                  .catch(e => {
                      // A problem occurred with the subscription.
                      console.log('Unable to subscribe to push.', e);
                  });
            });
          }
    }

    public static sendSubscriptionToServer(endpoint: string, key: ArrayBuffer | null, auth: ArrayBuffer | null): void {
        if (!key || !auth) {
          return;
        }
      
        var encodedKey = btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
        var encodedAuth = btoa(String.fromCharCode.apply(null, new Uint8Array(auth)));
      
        fetch('https://hellopwa.azurewebsites.net/subscribe', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            publicKey: encodedKey, 
            auth: encodedAuth, 
            notificationEndPoint: endpoint
          })
        }).then(result => {
          console.log('result', result);
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
  
      NotificationManager.subscribeUser();
    }
}