import { GENERATOR_TYPES } from './constants';
import chalk from 'chalk';
import log from './services/log';
import os from 'os';
import run from './services/run';
import path from 'path';
import { createDirectorySnapshot } from './services/createDirectorySnapshot';
import _package from '../package.json';
import fs from 'fs';
import promisify from 'es6-promisify';

const TMP_DIR = os.tmpdir();
const writeFile = promisify(fs.writeFile);

(async () => {
    const promises = Object.keys(GENERATOR_TYPES)
        .map(async key => {
            const cwd = TMP_DIR;
            const generator = GENERATOR_TYPES[key];
            const version = _package.devDependencies[generator];
            const project = `${key.toLowerCase()}${Math.round(Math.random() * 1000000)}`;
            log(chalk`Executing {cyan ${generator}}@{cyan ${version}}...`);
            await run(`npx ${GENERATOR_TYPES[key]}@${version} ${project}`, { cwd, stdio: 'pipe' });
            log(chalk`Creating fs snapshot for {dim ${key}}...`);
            const snap = await createDirectorySnapshot(path.join(cwd, project));
            await writeFile(path.join(__dirname, '..', 'snapshots', `${key}.json`), JSON.stringify(snap));
        });

    await Promise.all(promises);
    log('All snapshots written.');
})().catch(err => {
    log(err, 'error');
    process.exit(1);
});
