import React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { Store } from 'redux';
import { Provider } from 'react-redux';
import Home from './Home';

const App = (props) => (
    <Provider store={props.store}>
        <Switch>
            <Route exact path="/" component={Home} />
        </Switch>
    </Provider>
);

export default App;