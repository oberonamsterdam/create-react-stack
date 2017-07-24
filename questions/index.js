import ssr from './ssr';
import { execute as executeSSR } from './ssr';
import flow from './flow';
import { execute as executeFlow } from './flow';
import redux from './redux';
import { execute as executeRedux } from './redux';

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
    }
}