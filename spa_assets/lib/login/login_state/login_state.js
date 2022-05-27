import describeState from "redux-describe-state";
import currentUser from "./current_user";
import resetStoreState from "new_store/reset_store_state";

let loginState = describeState({
    name: "login",
    getInitialState: () => {
        let user = currentUser.get();
        return sessionState(user);
    }
});

export default loginState;

export function signIn(user) {
    return loginState.newAction(() => {
        const serializedState = JSON.stringify(user);
        localStorage.setItem('user', serializedState);
        sessionState(user);
    });
}

export function signOut() {
    return function(dispatch) {
        localStorage.removeItem('user');
        dispatch(resetStoreState());
    };
}

function sessionState(user) {
    return { currentUser: user };
}

import { useSelector } from "react-redux";

export function useCurrentUser() {
    // return useSelector(state => state.login.currentUser);
    let userLoggedIn = localStorage.getItem('user');
    return userLoggedIn;
}