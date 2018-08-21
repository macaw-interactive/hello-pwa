import * as React from 'react';
import './assets/css/app.css';

import logo from './assets/images/logo.svg';
import { LocationFetcher } from './components/LocationFetcher';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
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
