import * as React from 'react';
import { NotificationManager } from '../notifications/Manager';

export class Notifications extends React.Component {
    public constructor(props: {}) {
        super(props);

        this.requestPermission = this.requestPermission.bind(this);
        this.holidayFaker = this.holidayFaker.bind(this);
        this.broadcast = this.broadcast.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <div className="a-container">
                <div className="a-btn__row">
                    <button className="a-btn a-btn--primary" onClick={this.requestPermission}>Request notification permission</button>
                    <button className="a-btn a-btn--primary" onClick={this.broadcast}>Broadcast notification</button>
                    <button className="a-btn a-btn--primary" onClick={this.holidayFaker}>Holiday faker</button>
                </div>
            </div>
        )
    }

    private broadcast(): void {
        NotificationManager.broadcastNotification();
    }

    private holidayFaker(): void {
        NotificationManager.holidayFaker();
    }

    private requestPermission(): void {
        NotificationManager.requestPermission();
    }
}