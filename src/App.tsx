import * as React from 'react';
import './assets/css/app.css';

import logo from './assets/images/logo.svg';
import { LocationFetcher } from './components/LocationFetcher';
import { BuildTime } from './components/BuildTime';

function urlB64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendSubscriptionToServer(endpoint: string, key: ArrayBuffer | null, auth: ArrayBuffer | null): void {
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

  // $.ajax({
  //     type: 'POST',
  //     url: url,
  //     data: {publicKey: encodedKey, auth: encodedAuth, notificationEndPoint: endpoint},
  //     success: function (response) {
  //         console.log('Subscribed successfully! ' + JSON.stringify(response));
  //     },
  //     dataType: 'json'
  // });
}

function subscribeUser(): void {
  if ('serviceWorker' in navigator) {

    navigator.serviceWorker.ready.then(function(reg: ServiceWorkerRegistration): void {
      var subscribeParams: { userVisibleOnly: boolean, applicationServerKey: undefined | Uint8Array } = {
        userVisibleOnly: true,
        applicationServerKey: undefined
      };

      //Setting the public key of our VAPID key pair.
      var applicationServerKey = urlB64ToUint8Array('BHickT1zRpYQN7XQyPs4gd3oV5wUS7JJGgpdyLsqHyBb9dh1NUTvc2Py48gVl0oDsV0S3vF7Qk9oYfDKuFyaj8w');
      subscribeParams.applicationServerKey = applicationServerKey;

      reg.pushManager.subscribe(subscribeParams)
          .then(function (subscription: PushSubscription): void {

              // Update status to subscribe current user on server, and to let
              // other users know this user has subscribed
              var endpoint = subscription.endpoint;
              var key = subscription.getKey('p256dh');
              var auth = subscription.getKey('auth');
              sendSubscriptionToServer(endpoint, key, auth);
              // isSubscribed = true;
              // makeButtonUnsubscribable();
          })
          .catch(function (e): void {
              // A problem occurred with the subscription.
              console.log('Unable to subscribe to push.', e);
          });
    })
  }
}

class App extends React.Component {
  constructor(props: {}) {
    super(props);

    this.requestPermission = this.requestPermission.bind(this);
  }

  public componentDidMount(): void {
    // 
    console.log('component mounted');
    subscribeUser();
  }
 
  public render(): React.ReactNode {
    return (
      <div className="App">
        <button onClick={this.requestPermission}>Request notification permission</button>
        <BuildTime />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="a-container">
          <LocationFetcher />
        </div>
      </div>
    );
  }

  private requestPermission(): void {
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

    subscribeUser();
  }
}

export default App;
