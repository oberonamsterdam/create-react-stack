import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { registerRootComponent } from 'expo';
import { store, persistor } from '../redux/createStore.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react'

// Your loading view before redux-persist has rehydrated store
const Loading = () => null;

class App extends React.Component {
    render () {
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor} loading={<Loading/>}>
                    <View style={styles.container}>
                        <Text>Open up App.js to start working on your app!</Text>
                        <Text>Changes you make will automatically reload.</Text>
                        <Text>Shake your phone to open the developer menu.</Text>
                    </View>
                </PersistGate>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default registerRootComponent(App);