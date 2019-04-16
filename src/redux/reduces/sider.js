import { TAGGLESIDER } from '../action/sider'

export default (state = {}, action) => {
    switch(action.type){
        case TAGGLESIDER:
            return Object.assign({}, state, {
                collapsed: action.collapsed
            })
        default:
            return state
    }
}