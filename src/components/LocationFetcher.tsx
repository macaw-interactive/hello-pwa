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
    locationSource?: LocationSource
}

interface LocationFetcherState {
    history: LocationHistory[];
    isGeoLoading: boolean;
}

enum LocationSource {
    PREDEFINED = 'predefined',
    MANUAL = 'manual',
    VISIBILITY_CHANGE = 'visibility_change',
    PAGE_LOAD = 'page_load',
}

export class LocationFetcher extends React.Component<{}, LocationFetcherState> {
    private readonly storageKeys = {
        history: 'location_history',
        permission: 'location_permission'
    };

    // private readonly timeTrigger = 4*60*60; // 4 hours
    private readonly timeTrigger = 1800; // Testing purposes

    public constructor(props: {}) {
        super(props);
        this.setInitialLocalStorage();

        this.state = {
            history: this.getHistoryFromStorage(),
            isGeoLoading: false
        };

        this.geoError = this.geoError.bind(this);
        this.clearLocationHistory = this.clearLocationHistory.bind(this);
    }

    public componentDidMount(): void {
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this, LocationSource.VISIBILITY_CHANGE), false);
        window.addEventListener('load', this.handleVisibilityChange.bind(this, LocationSource.PAGE_LOAD));
    }

    public componentDidUpdate(): void {
        if (this.state.history.length !== this.getHistoryFromStorage().length) {
            this.locationHasUpdated();
        }

        localStorage.setItem(this.storageKeys.history, JSON.stringify(this.state.history));
    }

    public render(): React.ReactNode {
        return (
            <Fragment>
                <div className="o-location-fetcher">
                    <div className="o-location-fetcher__btn-row a-btn__row">
                        <button className={`a-btn a-btn--primary o-location-fetcher__fetch ${this.state.isGeoLoading ? 'a-btn--loading': ''}`} onClick={!this.state.isGeoLoading ? this.fetchLocation.bind(this, LocationSource.MANUAL) : ()=>{}}>
                            Fetch my location
                            <span className="a-loader" />
                        </button>
                        <button className="a-btn a-btn--secondary" onClick={this.clearLocationHistory}>
                            Clear location history
                        </button>
                    </div>

                    {this.state.history.length > 0 && 
                        <div className="m-table__container">
                            <table className="m-table o-location-fetcher__overview">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date/time</th>
                                        <th>Latitude</th>
                                        <th>Longitude</th>
                                        <th>Accuracy</th>
                                        <th>Distance (relative to prev.)</th>
                                        <th>Time (relative to prev.)</th>
                                        <th>Location source</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.history.map((historyItem: LocationHistory, index: number) => (
                                        <tr key={index}>
                                            <td>{this.state.history.length - index}</td>
                                            <td>{this.getFormattedDate(historyItem.date)}</td>
                                            <td>{historyItem.location.latitude}</td>
                                            <td>{historyItem.location.longitude}</td>
                                            <td>{historyItem.accuracyInMeters ? `${historyItem.accuracyInMeters}m` : '-'}</td>
                                            <td>{typeof historyItem.distanceInBetween !== 'undefined' ? `${historyItem.distanceInBetween}m` : '-'}</td>
                                            <td>{typeof historyItem.timeInBetween !== 'undefined' ? `${historyItem.timeInBetween}s` : '-'}</td>
                                            <td>{historyItem.locationSource}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
                <ToastContainer position="bottom-right" />
            </Fragment>
        );
    }

    private fetchLocation(locationSource: LocationSource): void {
        this.setState({ isGeoLoading: true });
        navigator.geolocation.getCurrentPosition(this.geoSuccess.bind(this, locationSource), this.geoError, { timeout: 5000, enableHighAccuracy: true });
    }

    private geoSuccess(locationSource: LocationSource, location: Position): void {
        this.addNewLocation(location, locationSource);
        localStorage.setItem(this.storageKeys.permission, JSON.stringify(true));
    }

    private geoError(error: PositionError): void {
        console.log('Error fetching geo:', error.message);
        toast.error(`Could not fetch location: ${error.message}`);
        this.setState({ isGeoLoading: false });
    }

    private handleVisibilityChange(locationSource: LocationSource): void {
        if (!document.hidden && !this.state.isGeoLoading && this.hasLocationPermission()) {
            this.fetchLocation(locationSource);
        }
    }

    private addNewLocation(location: Position, locationSource?: LocationSource): void {
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
                    timeInBetween: this.calculateSecondsBetween(date),
                    locationSource: locationSource || undefined
                },
                ...this.state.history
            ],
            isGeoLoading: false
        });
    }

    // Todo: Register when notification has already been sent. Perhaps add a "route" concept? 
    // For example: Add all relevant history records to a route and don't count it again  
    private locationHasUpdated(): void {
        const history = this.getHistoryFromStorage();
        let totalSeconds = 0;
        let totalMeters = 0;
        let hasExeededTimeTrigger = () => totalSeconds > this.timeTrigger;

        for (let i = 0; i < history.length; i++) {
            const currentHistoryItem = history[i];
            const timeDifference = currentHistoryItem.timeInBetween;
            const distanceDifference = currentHistoryItem.distanceInBetween;
                
            if (typeof timeDifference !== 'undefined' && typeof distanceDifference !== 'undefined') {
                totalSeconds = totalSeconds + timeDifference;
                totalMeters = totalMeters + distanceDifference;
            }
        }
        
        // Do stuff here based on time and distance length
        if (hasExeededTimeTrigger()) {
            toast.warn('You drove more than 4 hours, take a break!');
        }
    }

    private calculateMetersBetween(currentLocation: Position): number | undefined {
        if (this.state.history && this.state.history[0]) {
            return haversine(currentLocation.coords, this.state.history[0].location, { unit: 'meter' });
        } 

        return undefined;
    }

    private getHistoryFromStorage(): LocationHistory[] {
        const rawStorage = localStorage.getItem(this.storageKeys.history);

        if (rawStorage) {
            return JSON.parse(rawStorage);
        }       
        
        return [];
    }

    private hasLocationPermission(): boolean {
        const rawStorage = localStorage.getItem(this.storageKeys.permission);

        if (rawStorage) {
            return JSON.parse(rawStorage);
        }

        return false;
    }

    private clearLocationHistory(): void {
        localStorage.setItem(this.storageKeys.history, JSON.stringify([]));
        this.setState({ history: this.getHistoryFromStorage() });
    }

    private setInitialLocalStorage(): void {
        this.addInitialHistoryItem();
        this.setInitialPermissionState();
    }

    private addInitialHistoryItem(): void {
        const history = this.getHistoryFromStorage();

        if (history.length === 0) {
            localStorage.setItem(this.storageKeys.history, JSON.stringify([{
                date: new Date(),
                location: {
                    latitude: 52.3089248,
                    longitude: 4.7586070
                },
                locationSource: LocationSource.PREDEFINED,
                accuracyInMeters: 26
            }]));
        }
    }

    private setInitialPermissionState(): void {
        if (!localStorage.getItem(this.storageKeys.permission)) {
            localStorage.setItem(this.storageKeys.permission, JSON.stringify(false));
        }
    }

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