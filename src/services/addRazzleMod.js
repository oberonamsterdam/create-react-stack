import path from 'path';
import { PROMISIFIED_METHODS } from '../globals/constants';

export default async appname => {

    await PROMISIFIED_METHODS.writeFile(path.join(process.cwd(), appname, 'razzle.config.js'), `
const usePolyfill = false;

module.exports = {
    modify: require('oberon-razzle-modifications')({ usePolyfill: usePolyfill})
}
    `);
};
