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
} = GENERATOR_TYPES;
const expoGeneratorType = GENERATOR_TYPES.expo;

const generators = {
    all: [createReactApp, reactNativeCli, razzle, expoGeneratorType],
    notExpo: [createReactApp, razzle, reactNativeCli],
};

// requirements are for skipping exec functions of questions.
// condition should return true if should exist
// generators are to say which generators are supported by this question.
// TODO check for generators in src/index.js aswell
export default {
    mobile: {
        question: mobileQuestion,
        execute: executeMobile,
        type: mobile,
        generators: generators.all,
        requirements: [
            {
                condition: ({ answer }) => !!answer,
            },
        ],
    },
    expo: {
        question: expoQuestion,
        execute: executeExpo,
        type: expo,
        generators: generators.all,
        requirements: [
            {
                condition: ({ answers: { mobile } }) => !!mobile,
            },
        ],
    },
    ssr: {
        question: ssrQuestion,
        execute: executeSSR,
        type: ssr,
        generators: generators.all,
        requirements: [
            {
                condition: ({ mobile }) => !mobile,
            },
        ],
    },
    flow: {
        question: flowQuestion,
        execute: executeFlow,
        type: flow,
        generators: generators.notExpo,
        requirements: [
            {
                condition: ({ answer }) => !!answer,
            },
        ],
    },
    redux: {
        question: reduxQuestion,
        execute: executeRedux,
        type: redux,
        generators: generators.notExpo,
        requirements: [],
    },
    reduxPersist: {
        question: reduxPersistQuestion,
        execute: executeReduxPersist,
        type: reduxPersist,
        generators: generators.notExpo,
        requirements: [
            {
                condition: ({ answers: { redux } }) => redux,
            },
        ],
    },
    eslint: {
        question: eslintQuestion,
        execute: executeEslint,
        type: eslint,
        generators: generators.notExpo,
        requirements: [
            {
                condition: ({ answer }) => !!answer,
            },
        ],
    },
    eslintConfig: {
        question: eslintConfigQuestion,
        execute: executeEslintConfig,
        type: eslintConfig,
        generators: generators.notExpo,
        requirements: [
            {
                condition: ({ answers: { mobile, eslint } }) => !(mobile && !eslint),
            },
        ],
    },
    polyfill: {
        question: polyfillQuestion,
        execute: executePolyfill,
        type: polyfill,
        generators: generators.notExpo,
        requirements: [
            {
                condition: ({ answer, answers: { mobile } }) => {
                    return !!answer && mobile !== true;
                },
            },
        ],
    },
    styledComponents: {
        question: styledComponentsQuestion,
        execute: executeStyledComponents,
        type: styledComponents,
        generators: generators.notExpo,
        requirements: [
            {
                condition: ({ answer }) => !!answer,
            },
        ],
    },
};

export const postInstall = {
    eslint: eslintPostInstall,
    flow: flowPostInstall,
};