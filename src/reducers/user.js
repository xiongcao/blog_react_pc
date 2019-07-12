const user = (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN':
            return Object.assign({}, state, action.user)
        case 'OUT_LOGIN':
            return {}
        default:
            return state
    }
}

export default user