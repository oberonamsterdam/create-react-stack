import { GENERATOR_TYPES, QUESTION_TYPES } from '../constants';
import eslintQuestion, { execute as executeEslint } from './eslint';
import eslintConfigQuestion, {
    execute as executeEslintConfig,
    postInstall as eslintPostInstall,
} from './eslint-config';
import expoQuestion, { execute as executeExpo } from './expo';
import flowQuestion, { execute as executeFlow, postInstall as flowPostInstall } from './flow';
import mobileQuestion, { execute as executeMobile } from './mobile';
import polyfillQuestion, { execute as executePolyfill } from './polyfill';
import reduxQuestion, { execute as executeRedux } from './redux';
import reduxPersistQuestion, { execute as executeReduxPersist } from './redux-persist';
import ssrQuestion, { execute as executeSSR } from './ssr';
import styledComponentsQuestion, { execute as executeStyledComponents } from './styled-components';

const {
    mobile,
    ssr,
    redux,
    reduxPersist,
    eslint,
    eslintConfig,
    polyfill,
    styledComponents,
    flow,
    expo,
} = QUESTION_TYPES;

const {
    createReactApp,
    razzle,
    reactNativeCli,
    expo: expoGeneratorType,
} = GENERATOR_TYPES;

const generators = {
    all: [createReactApp, reactNativeCli, razzle, expoGeneratorType],
    notExpo: [createReactApp, razzle, reactNativeCli],
};

const questions = {
    [mobile]: {
        question: mobileQuestion,
        execute: executeMobile,
        type: mobile,
        generators: generators.all,
    },
    [expo]: {
        question: expoQuestion,
        execute: executeExpo,
        type: expo,
        generators: generators.all,
    },
    [ssr]: {
        question: ssrQuestion,
        execute: executeSSR,
        type: ssr,
        generators: generators.all,
    },
    [flow]: {
        question: flowQuestion,
        execute: executeFlow,
        type: flow,
        generators: generators.notExpo,
    },
    [redux]: {
        question: reduxQuestion,
        execute: executeRedux,
        type: redux,
        generators: generators.notExpo,
    },
    [reduxPersist]: {
        question: reduxPersistQuestion,
        execute: executeReduxPersist,
        type: reduxPersist,
        generators: generators.notExpo,
    },
    [eslint]: {
        question: eslintQuestion,
        execute: executeEslint,
        type: eslint,
        generators: generators.notExpo,
    },
    [eslintConfig]: {
        question: eslintConfigQuestion,
        execute: executeEslintConfig,
        type: eslintConfig,
        generators: generators.notExpo,

    },
    [polyfill]: {
        question: polyfillQuestion,
        execute: executePolyfill,
        type: polyfill,
        generators: generators.notExpo,
    },
    [styledComponents]: {
        question: styledComponentsQuestion,
        execute: executeStyledComponents,
        type: styledComponents,
        generators: generators.notExpo,
    },
};

export default questions;

export const postInstall = {
    eslint: eslintPostInstall,
    flow: flowPostInstall,
};