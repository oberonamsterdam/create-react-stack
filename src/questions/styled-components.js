/* eslint-disable no-useless-constructor */
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'styledComponents',
    message: 'Use styled-components? (http://styled-components.com)',
};

export class StyledComponentsExecute extends BaseQuestion {
    constructor (data) {
        super(data);
    }

    default = async () => {
        this.packages.push('styled-components');
    };
}