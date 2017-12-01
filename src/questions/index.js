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

const { mobile, ssr, redux, reduxPersist, eslint, eslintConfig, polyfill, styledComponents, flow } = QUESTION_TYPES;

// requirements are for skipping exec functions of questions.
// condition should return true if should exist
export default {
    mobile: {
        question: mobileQuestion,
        execute: executeMobile,
        type: mobile,
        requirements: [
            {
                condition: ({ answer }) => !!answer,
            },
        ],
    },
    ssr: {
        question: ssrQuestion,
        execute: executeSSR,
        type: ssr,
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
        requirements: [],
    },
    reduxPersist: {
        question: reduxPersistQuestion,
        execute: executeReduxPersist,
        type: reduxPersist,
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
        requirements: [
            {
                condition: ({ answer, answers: { mobile } }) => {
                    console.log(mobile !== true, !!answer);
                    return !!answer && mobile !== true;
                },
            },
        ],
    },
    styledComponents: {
        question: styledComponentsQuestion,
        execute: executeStyledComponents,
        type: styledComponents,
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