import * as React from 'react';
import './assets/css/app.css';

import logo from './assets/images/logo.svg';
import { LocationFetcher } from './components/LocationFetcher';
import { BuildTime } from './components/BuildTime';
// Test
class App extends React.Component {
  public render(): React.ReactNode {
    return (
      <div className="App">
        <BuildTime />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="a-container">
          <LocationFetcher />
        </div>
      </div>
    );
  }
}

export default App;
