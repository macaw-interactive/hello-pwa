import * as React from 'react';
import { LocationFetcher } from '../components/LocationFetcher';

export class Home extends React.Component {
    public render(): React.ReactNode {
        return (
            <div className="a-container">
                <LocationFetcher />
            </div>
        )
    }
}