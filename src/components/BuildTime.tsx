import * as React from 'react';

export class BuildTime extends React.Component {
    public render(): React.ReactNode {
        return (
            <div className="a-build-time">Build: {process.env.REACT_APP_BUILD_TIME}</div>
        )
    }
}