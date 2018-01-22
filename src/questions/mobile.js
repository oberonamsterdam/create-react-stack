import path from 'path';
import { PROMISIFIED_METHODS } from '../globals/constants';
import { reactNativeSnippets } from '../globals/snippets';
import run from '../services/run';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'mobile',
    message: 'Are you building a mobile project? (https://facebook.github.io/react-native/)',
};

export class MobileExec extends BaseQuestion {
    appname = this.answers.appname;
    files = ['App.js', 'App.test.js'];

    default = async () => {
        const { writeFile, mkdir, mv, readFile } = PROMISIFIED_METHODS;
        const componentsDir = path.join(this.src, 'components');
        await run(`npx create-react-native-app ${this.appname}`);
        // make src & components folder
        await mkdir(this.src);
        await mkdir(componentsDir);

        // replace App.js with webTemplate
        await writeFile(path.join(this.dir, 'App.js'), reactNativeSnippets.app);

        // move files into src/components
        for (const file of this.files) {
            await mv(path.join(this.dir, file), path.join(componentsDir, file));
        }

        // Get package.json and edit the object returned, then overwrite the entirity of package.json
        // This is for changing the new entry point for expo.
        let npmPackageJson = await readFile(path.join(this.dir, 'package.json'), 'utf8');
        npmPackageJson = JSON.parse(npmPackageJson);
        npmPackageJson.main = './src/components/App.js';
        await writeFile(path.join(this.dir, 'package.json'), JSON.stringify(npmPackageJson));
    };
}