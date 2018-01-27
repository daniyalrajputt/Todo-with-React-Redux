const INITIAL_STATE = {
    todos:[],
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "RECEIVINGTODO":
            return ({
                ...state,
                todos:action.payload
            })
            case "DELETEALL":
            return ({
                todos:action.payload
            })
        default:
            return state;
    }

}