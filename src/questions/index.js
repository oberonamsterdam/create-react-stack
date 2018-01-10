import { GENERATOR_TYPES, QUESTION_TYPES } from '../constants';
import eslintQuestion, { execute as executeEslint } from './eslint';
import eslintConfigQuestion, {
    execute as executeEslintConfig,
    postInstall as eslintPostInstall,
} from './eslint-config';
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
} = QUESTION_TYPES;

const {
    createReactApp,
    razzle,
    reactNative
} = GENERATOR_TYPES;

const generators = {
    all: [createReactApp, razzle, reactNative ],
};

const questions = {
    [mobile]: {
        question: mobileQuestion,
        execute: executeMobile,
        type: mobile,
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
        generators: generators.all,
    },
    [redux]: {
        question: reduxQuestion,
        execute: executeRedux,
        type: redux,
        generators: generators.all,
    },
    [reduxPersist]: {
        question: reduxPersistQuestion,
        execute: executeReduxPersist,
        type: reduxPersist,
        generators: generators.all,
    },
    [eslint]: {
        question: eslintQuestion,
        execute: executeEslint,
        type: eslint,
        generators: generators.all,
    },
    [eslintConfig]: {
        question: eslintConfigQuestion,
        execute: executeEslintConfig,
        type: eslintConfig,
        generators: generators.all,

    },
    [polyfill]: {
        question: polyfillQuestion,
        execute: executePolyfill,
        type: polyfill,
        generators: generators.all,
    },
    [styledComponents]: {
        question: styledComponentsQuestion,
        execute: executeStyledComponents,
        type: styledComponents,
        generators: generators.all,
    },
};

export default questions;

export const postInstall = {
    eslint: eslintPostInstall,
    flow: flowPostInstall,
};