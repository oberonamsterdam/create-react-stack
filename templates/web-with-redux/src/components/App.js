import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Home from './Home';

const App = (props) => (
    <Provider store={props.store}>
        <Switch>
            <Route exact path="/" component={Home}/>
        </Switch>
    </Provider>
);

App.propTypes = {
    store: React.propTypes.object,
};

export default App;