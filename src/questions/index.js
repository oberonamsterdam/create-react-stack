import { QUESTION_TYPES } from '../constants';
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

// not used atm but nice to have
const { mobile, ssr, redux, reduxPersist, eslint, eslintConfig, polyfill, styledComponent } = QUESTION_TYPES;

// requirements are for skipping exec functions of questions.
// condition should return true if should exist
export default {
    mobile: {
        question: mobileQuestion,
        execute: executeMobile,
        requirements: [
            {
                condition: ({ answer }) => !!answer,
            },
        ],
    },
    ssr: {
        question: ssrQuestion,
        execute: executeSSR,
        requirements: [
            {
                condition: ({ mobile }) => !mobile,
            },
        ],
    },
    flow: {
        question: flowQuestion,
        execute: executeFlow,
        requirements: [
            {
                condition: ({ answer }) => !!answer,
            },
        ],
    },
    redux: {
        question: reduxQuestion,
        execute: executeRedux,
        requirements: [],
    },
    reduxPersist: {
        question: reduxPersistQuestion,
        execute: executeReduxPersist,
        requirements: [
            {
                condition: ({ answers: { redux } }) => redux,
            },
        ],
    },
    eslint: {
        question: eslintQuestion,
        execute: executeEslint,
        requirements: [
            {
                condition: ({ answer }) => !!answer,
            },
        ],
    },
    eslintConfig: {
        question: eslintConfigQuestion,
        execute: executeEslintConfig,
        requirements: [
            {
                condition: ({ answers: { mobile, eslint } }) => !(mobile && !eslint),
            },
        ],
    },
    polyfill: {
        question: polyfillQuestion,
        execute: executePolyfill,
        requirements: [
            {
                condition: ({ answer }) => !!answer,
            },
        ],
    },
    styledComponents: {
        question: styledComponentsQuestion,
        execute: executeStyledComponents,
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