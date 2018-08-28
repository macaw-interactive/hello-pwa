import * as React from 'react';
import './assets/css/app.css';

import logo from './assets/images/logo.svg';
import { LocationFetcher } from './components/LocationFetcher';
import { BuildTime } from './components/BuildTime';
import { NotificationManager } from './notifications/Manager';

class App extends React.Component {
  constructor(props: {}) {
    super(props);

    this.requestPermission = this.requestPermission.bind(this);
  }

  public componentDidMount(): void {
    NotificationManager.subscribeUser();
  }
 
  public render(): React.ReactNode {
    return (
      <div className="App">
        <BuildTime />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="a-container">
          <div className="a-btn__row">
            <button className="a-btn a-btn--primary" onClick={this.requestPermission}>Request notification permission</button>
          </div>
          <LocationFetcher />
        </div>
      </div>
    );
  }

  private requestPermission(): void {
    NotificationManager.requestPermission();
  }
}

export default App;
