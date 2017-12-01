import { GENERATOR_TYPES } from '../constants';
import { store } from '../createStore';
import run from '../services/run';

export default {
    type: 'confirm',
    name: 'expo',
    message: 'Use Expo? (create-react-native-app)',
    when: ({ mobile }) => mobile,
};
export const execute = async ({ answers: { appname } }) => {
    store.changeState({
        generator: GENERATOR_TYPES.expo,
    });
    await run(`npx create-react-native-app ${appname}`);
};