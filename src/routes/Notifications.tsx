import * as React from 'react';
import { NotificationManager } from '../notifications/Manager';

export class Notifications extends React.Component {
    public constructor(props: {}) {
        super(props);

        this.requestPermission = this.requestPermission.bind(this);
        this.holidayFaker = this.holidayFaker.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <div className="a-container">
                <div className="a-btn__row">
                    <button className="a-btn a-btn--primary" onClick={this.requestPermission}>Request notification permission</button>
                    <button className="a-btn a-btn--primary" onClick={this.holidayFaker}>Holiday faker</button>
                </div>
            </div>
        )
    }

    private holidayFaker(): void {
        fetch('https://hellopwa.azurewebsites.net/weather?lon=4.7023787&lat=52.2910026');
    }

    private requestPermission(): void {
      NotificationManager.requestPermission();
    }
}