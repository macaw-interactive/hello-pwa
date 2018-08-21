import * as React from 'react';
import { format, parse, differenceInSeconds } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import { Fragment } from 'react';
const haversine = require('haversine');

interface Location {
    latitude: number;
    longitude: number;
}

interface LocationHistory {
    date: Date;
    location: Location;
    accuracyInMeters?: number;
    distanceInBetween?: number;
    timeInBetween?: number;
}

interface LocationFetcherState {
    history: LocationHistory[];
    isGeoLoading: boolean;
}

export class LocationFetcher extends React.Component<any, LocationFetcherState> {
    public constructor(props: any) {
        super(props);

        this.state = {
            history: [{
                date: new Date(),
                location: {
                    latitude: 52.3089248,
                    longitude: 4.7586070
                },
                accuracyInMeters: 26
            }],
            isGeoLoading: false
        };

        this.fetchLocation = this.fetchLocation.bind(this);
        this.geoSuccess = this.geoSuccess.bind(this);
        this.geoError = this.geoError.bind(this);
    }

    public render() {
        return (
            <Fragment>
                <div className="o-location-fetcher">
                    <button className={`a-btn o-location-fetcher__fetch ${this.state.isGeoLoading ? 'a-btn--loading': ''}`} onClick={!this.state.isGeoLoading ? this.fetchLocation : ()=>{}}>
                        Fetch my location
                        <span className="a-loader" />
                    </button>

                    {this.state.history.length > 0 && 
                        <table className="m-table o-location-fetcher__overview">
                            <thead>
                                <tr>
                                    <th>Date/time</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                    <th>Accuracy</th>
                                    <th>Distance (relative to prev.)</th>
                                    <th>Time (relative to prev.)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.history.map((historyItem: LocationHistory, index: number) => (
                                    <tr key={index}>
                                        <td>{this.getFormattedDate(historyItem.date)}</td>
                                        <td>{historyItem.location.latitude}</td>
                                        <td>{historyItem.location.longitude}</td>
                                        <td>{historyItem.accuracyInMeters ? `${historyItem.accuracyInMeters}m` : '-'}</td>
                                        <td>{typeof historyItem.distanceInBetween !== 'undefined' ? `${historyItem.distanceInBetween}m` : '-'}</td>
                                        <td>{typeof historyItem.timeInBetween !== 'undefined' ? `${historyItem.timeInBetween}s` : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
                <ToastContainer />
            </Fragment>
        );
    }

    private fetchLocation(): void {
        this.setState({ isGeoLoading: true });
        navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError, { timeout: 5000, enableHighAccuracy: true });
    }

    private geoSuccess(location: Position): void {
        this.addNewLocation(location);
    }

    private geoError(error: PositionError): void {
        console.log('Error fetching geo:', error.message);
        toast.error(`Could not fetch location: ${error.message}`, {
            position: 'bottom-right'
        });
        this.setState({ isGeoLoading: false });
    }

    private addNewLocation(location: Position): void {
        const date = new Date();

        this.setState({
            history: [
                {
                    date: date,
                    location: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    },
                    accuracyInMeters: location.coords.accuracy,
                    distanceInBetween: this.calculateMetersBetween(location),
                    timeInBetween: this.calculateSecondsBetween(date)
                },
                ...this.state.history
            ],
            isGeoLoading: false
        });
    }

    // private getDistanceBetween(location: Position) {
        
    // }

    private calculateMetersBetween(currentLocation: Position): number | undefined {
        if (this.state.history && this.state.history[0]) {
            return haversine(currentLocation.coords, this.state.history[0].location, { unit: 'meter' });
        } 

        return undefined;
    }

    // private getTimeBetween(currentDate: Date) {
    // }

    private calculateSecondsBetween(currentDate: Date): number | undefined {
        if (this.state.history && this.state.history[0]) {
            return differenceInSeconds(currentDate, this.state.history[0].date);
        }

        return undefined;
    }

    private getFormattedDate(date: Date): string {
        if (date) {
            return format(parse(date), 'YYYY-MM-DD HH:mm:ss');
        }

        return '';
    }
}