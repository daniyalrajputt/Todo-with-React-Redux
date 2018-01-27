import firebase from 'firebase';


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCMfhxdcE2yukne07ui0QIedtN_KSzZxN8",
    authDomain: "reactappfirebase.firebaseapp.com",
    databaseURL: "https://reactappfirebase.firebaseio.com",
    projectId: "reactappfirebase",
    storageBucket: "reactappfirebase.appspot.com",
    messagingSenderId: "911863194826"
};
firebase.initializeApp(config);


export function addingTodoAction(todo) {
    return dispatch => {
        firebase.database().ref("/").child("todos").push(todo)
    }
}
export function renderingTodoAction(data) {
    return dispatch => {

        dispatch({
            type: "RECEIVINGTODO",
            payload: data
        })

    }
}

export function deleteAllAction() {
    return dispatch => {
        firebase.database().ref("/").child("todos").remove()
        let todos = []
        dispatch({
            type: "DELETEALL",
            payload: todos
        })

    }
}
