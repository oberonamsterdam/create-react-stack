import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { store } from '../createStore.js';
import Home from './Home';

const App = () => (
    <Provider store={store}>
        <Switch>
            <Route exact path="/" component={Home}/>
        </Switch>
    </Provider>
);

export default App;