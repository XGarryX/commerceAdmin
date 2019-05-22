import { CHANGETOKEN } from '../action/token'

export default (state, action) => {
    switch(action.type) {
        case CHANGETOKEN:
            return action.value
        default:
            return state
    }
}