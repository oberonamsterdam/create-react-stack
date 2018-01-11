import { GENERATOR_TYPES, QUESTION_TYPES } from '../globals/constants';
import eslintQuestion, { EslintExecute } from './eslint';
import eslintConfigQuestion, { EslintConfigExecute } from './eslint-config';
import flowQuestion, { FlowExecute } from './flow';
import mobileQuestion, { MobileExec } from './mobile';
import polyfillQuestion, { PolyFillExecute } from './polyfill';
import reduxQuestion, { ReduxExecute } from './redux';
import reduxPersistQuestion, { ReduxPersistExecute } from './redux-persist';
import ssrQuestion, { SsrExecute } from './ssr';
import styledComponentsQuestion, { StyledComponentsExecute, } from './styled-components';

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
    reactNative,
} = GENERATOR_TYPES;

const generators = {
    all: [createReactApp, razzle, reactNative],
    web: [createReactApp, razzle],
    native: [reactNative],
};

const questions = {
    [mobile]: {
        question: mobileQuestion,
        execute: MobileExec,
        type: mobile,
        generators: generators.all,
    },
    [ssr]: {
        question: ssrQuestion,
        execute: SsrExecute,
        type: ssr,
        generators: generators.all,
    },
    [flow]: {
        question: flowQuestion,
        execute: FlowExecute,
        type: flow,
        generators: generators.web,
    },
    [redux]: {
        question: reduxQuestion,
        execute: ReduxExecute,
        type: redux,
        generators: generators.web,
    },
    [reduxPersist]: {
        question: reduxPersistQuestion,
        execute: ReduxPersistExecute,
        type: reduxPersist,
        generators: generators.web,
    },
    [eslint]: {
        question: eslintQuestion,
        execute: EslintExecute,
        type: eslint,
        generators: generators.web,
    },
    [eslintConfig]: {
        question: eslintConfigQuestion,
        execute: EslintConfigExecute,
        type: eslintConfig,
        generators: generators.web,

    },
    [polyfill]: {
        question: polyfillQuestion,
        execute: PolyFillExecute,
        type: polyfill,
        generators: generators.web,
    },
    [styledComponents]: {
        question: styledComponentsQuestion,
        execute: StyledComponentsExecute,
        type: styledComponents,
        generators: generators.all,
    },
};

export default questions;