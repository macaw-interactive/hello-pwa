import * as React from 'react';
import { NavLink } from 'react-router-dom';

export class Menu extends React.Component {
    public render(): React.ReactNode {
        return (
            <div className="m-menu">
                <ul>
                    <li><NavLink to="/" exact={true} activeClassName="active">Home</NavLink></li>
                    <li><NavLink to="/notifications" activeClassName="active">Notifications</NavLink></li>
                    <li><NavLink to="/settings" activeClassName="active">Settings</NavLink></li>
                </ul>
            </div>
        );
    }
} 