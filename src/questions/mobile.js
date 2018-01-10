import run from '../services/run';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'mobile',
    message: 'Are you building a mobile project? (https://facebook.github.io/react-native/)',
};

export class MobileExec extends BaseQuestion {
    constructor (data) {
        super(data);
        this.appname = this.answers.appname;
    }

    default = async () => {
        await run(`npx create-react-native-app ${this.appname}`);
    };
}