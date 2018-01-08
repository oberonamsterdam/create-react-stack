import run from '../services/run';

export default {
    type: 'confirm',
    name: 'expo',
    message: 'Use Expo? (create-react-native-app)',
    when: ({ mobile }) => mobile,
};
export const execute = async ({ answers: { appname } }) => {
    await run(`npx create-react-native-app ${appname}`);
};