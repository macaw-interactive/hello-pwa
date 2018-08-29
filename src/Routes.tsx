import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Notifications } from './routes/Notifications';
import { Home } from './routes/Home';
import { Menu } from './components/Menu';

export class ApplicationRoutes extends React.Component {
    public render(): React.ReactNode {
        return (
            <Router>
                <div>
                    <Menu />
                    <Switch>
                        <Route path="/" exact={true} component={Home} />
                        <Route path="/notifications" exact={true} component={Notifications} />
                    </Switch>
                </div>
            </Router>
        )
    }
}