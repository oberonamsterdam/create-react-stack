import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../createStore.js';

const App = (props) => (
    <Provider store={store}>
        <Switch>
            <Route exact path="/" component={Home}/>
        </Switch>
    </Provider>
);

export default App;