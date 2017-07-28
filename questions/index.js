import ssr, { execute as executeSSR } from './ssr';
import flow, { execute as executeFlow } from './flow';
import redux, { execute as executeRedux } from './redux';
import eslint, { execute as executeEslint } from './eslint';
import styledComponents, { execute as executeStyledComponents } from './styled-components';
import eslintConfig, { execute as executeEslintConfig, postInstall as eslintPostInstall } from './eslint-config';
import polyfill, { execute as executePolyfill } from './polyfill';
import reduxPersist, { execute as executeReduxPersist } from './redux-persist';

export default {
    ssr: {
        question: ssr,
        execute: executeSSR
    },
    flow: {
        question: flow,
        execute: executeFlow
    },
    redux: {
        question: redux,
        execute: executeRedux
    },
    reduxPersist: {
        question: reduxPersist,
        execute: executeReduxPersist
    },
    eslint: {
        question: eslint,
        execute: executeEslint
    },
    eslintConfig: {
        question: eslintConfig,
        execute: executeEslintConfig
    },
    polyfill: {
        question: polyfill,
        execute: executePolyfill
    },
    styledComponents: {
        question: styledComponents,
        execute: executeStyledComponents
    }
};

export const postInstall = {
    eslint: eslintPostInstall
};