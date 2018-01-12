import path from 'path';
import { PROMISIFIED_METHODS } from '../globals/constants';
import { reactNative, reactNativeSnippets } from '../globals/snippets';
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
        this.files = ['App.js', 'App.test.js'];
        this.dir = path.join(process.cwd(), this.appname);
        this.src = path.join(this.dir, 'src');
    }

    default = async () => {
        const { writeFile, mkdir, mv, rm, readFile } = PROMISIFIED_METHODS;
        const componentsDir = path.join(this.src, 'components');
        await run(`npx create-react-native-app ${this.appname}`);
        // make src & components folder
        await mkdir(this.src);
        await mkdir(componentsDir);

        // replace App.js with template
        await writeFile(path.join(this.dir, 'App.js'), reactNativeSnippets.app);

        // move files into src/components
        for (const file of this.files) {
            await mv(path.join(this.dir, file), componentsDir);
        }

        // Get package.json and edit the object returned, then overwrite the entirity of package.json
        // This is for changing the new entry point for expo.
        const npmPackageJson = await readFile(path.join(this.dir, 'package.json'), 'utf8');
        npmPackageJson.main = './component/App.js';
        await writeFile('package.json', npmPackageJson);

    };
}