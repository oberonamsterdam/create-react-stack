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
        if (defaultState) {
            this.state = defaultState;
        } else {
            this.state = {};
        }
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

    dispatch (action) {

    }
}

export default (defaultState = {}) => new Store(defaultState);