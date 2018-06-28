// sample usage:
// const state = store.getState();
// console.log(state);
// store.changeState({
//     hi: 'world',
//     aThing: 'aModifiedValue',
// });
// console.log(store.getState());
// {
//     hi: 'world',
//     aThing: 'aModifiedValue',
// }

class Store {
    constructor (defaultState) {
        this.state = defaultState;
    }

    getState () {
        return this.state;
    }

    changeState (payload) {
        this.state = {
            ...this.state,
            ...payload,
        };
    }
}

export default (defaultState = {}) => new Store(defaultState);