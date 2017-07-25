import ssr from './ssr';
import { execute as executeSSR } from './ssr';
import flow from './flow';
import { execute as executeFlow } from './flow';
import redux from './redux';
import { execute as executeRedux } from './redux';
import eslint from './eslint';
import { execute as executeEslint } from './eslint';
import styledComponents from './styled-components';
import { execute as executeStyledComponents } from './styled-components';

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
    eslint: {
        question: eslint,
        execute: executeEslint
    },
    styledComponents: {
        question: styledComponents,
        execute: executeStyledComponents
    }
}