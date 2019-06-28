const user = (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN':
            return Object.assign({}, state, action.user)
        default:
            return state
    }
}

export default user