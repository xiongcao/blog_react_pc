const user = (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN':
            console.log('reduces：', state, action.user)
            return Object.assign({}, state, action.user)
        default:
            return state
    }
}

export default user