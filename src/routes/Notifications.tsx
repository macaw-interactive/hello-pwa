import * as React from 'react';
import { NotificationManager } from '../notifications/Manager';
import { ToastContainer, toast } from 'react-toastify';

interface NotificationsState {
    subscribed: boolean | undefined;
}

export class Notifications extends React.Component<{}, NotificationsState> {
    public constructor(props: {}) {
        super(props);

        this.state = {
            subscribed: undefined
        };

        this.requestPermission = this.requestPermission.bind(this);
        this.holidayFaker = this.holidayFaker.bind(this);
        this.broadcast = this.broadcast.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.subscribe = this.subscribe.bind(this);
    }

    public componentDidMount(): void {
        this.getSubscribedStatus();            
    }

    public render(): React.ReactNode {
        return (
            <div className="a-container">
                <span className="a-subscribed">{this.subscribedStatus}</span>
                <br/>


                <div className="a-btn__row">
                    <button className="a-btn a-btn--primary" onClick={this.requestPermission}>Request notification permission</button>
                    <br />
                    <button className="a-btn a-btn--primary" onClick={this.broadcast}>Broadcast notification</button>
                    <button className="a-btn a-btn--primary" onClick={this.holidayFaker}>Holiday faker</button>
                    <br />
                    <button className="a-btn a-btn--secondary" onClick={this.unsubscribe}>Unsubscribe</button>
                    <button className="a-btn a-btn--secondary" onClick={this.subscribe}>Subscribe</button>
                </div>

                <ToastContainer position="bottom-right" />
            </div>
        )
    }

    private get subscribedStatus(): boolean | string {
        if (this.state.subscribed === true || this.state.subscribed === false) {
            return this.state.subscribed ? 'Subscribed' : 'Not subscribed';
        } else {
            return '-';
        }
    }

    private getSubscribedStatus(): void {
        NotificationManager.getSubscribedStatus().then((status) => { 
            if (status !== undefined) {
                this.setState({
                    subscribed: status
                });
            }
        });
    }

    private unsubscribe(): void {
        NotificationManager.unsubscribe().then(() => {
            this.getSubscribedStatus();
            toast.success(`Unsubscribed from notifications`);
        });
    }

    private subscribe(): void {
        NotificationManager.subscribe().then(() => {
            this.getSubscribedStatus();
            toast.success(`Subscribed to notifications`);
        });
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