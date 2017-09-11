import path from 'path';
import replace from 'replace-in-file';

export default {
    type: 'confirm',
    name: 'reduxPersist',
    message: 'Use redux-persist? (https://github.com/rt2zz/redux-persist)',
    when: ({ redux }) => redux,
};

export const execute = async (answer, { appname, redux }, packages) => {
    if (!redux) {
        return;
    }

    let stripSection;
    if (!answer) {
        stripSection = /\s\/\/ @crs-with-persist-start([\s\S]*?)\/\/ @crs-with-persist-end/gm;
    } else {
        packages.push('redux-persist');
        stripSection = /\s\/\/ @crs-without-persist-start([\s\S]*?)\/\/ @crs-without-persist-end/gm;
    }

    await replace({
        from: [stripSection, /\s*\/\/ @crs-(with|without)-persist-(start|end)/gm],
        to: ['', ''],
        files: path.join(process.cwd(), appname, 'src', 'createStore.js'),
    });
};