import * as React from 'react';

export class NotificationHandler extends React.Component {
    // private requestPermission(): void {
    //     Notification.requestPermission().then((value: NotificationPermission) => {
    //         if (value !== 'granted') {
    //             console.log('No notification access granted');
    //             return;
    //         }

    //         this.subscribeUserToPush();
    //     });
    // }

    // private subscribeUserToPush(): void {
    //     const subscribeOptions = {
    //         userVisibleOnly: true,
    //         applicationServerKey: urlBase64ToUint8Array(
    //             'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
    //         )
    //     };
        
    //     return registration.pushManager.subscribe(subscribeOptions);
    // }
}