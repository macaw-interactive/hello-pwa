import * as React from 'react';
import { NotificationManager } from '../notifications/Manager';

interface SettingsState {
    nameValue: string;
}

export class Settings extends React.Component<{}, SettingsState> {
    public constructor(props: {}) {
        super(props);

        this.state = {
            nameValue: ''
        };

        this.handleNameChange = this.handleNameChange.bind(this); 
        this.saveName = this.saveName.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <div className="a-container">
                <form onSubmit={this.saveName}>
                    <label htmlFor="">Naam</label>
                    <input type="text" value={this.state.nameValue} onChange={this.handleNameChange} />
                    <button className="a-btn a-btn--primary" type="submit">Save</button>
                </form>
            </div>
        );
    }

    private handleNameChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({ nameValue: event.currentTarget.value });
    }

    private saveName(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        NotificationManager.saveName(this.state.nameValue);
    }
}