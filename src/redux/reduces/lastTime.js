import base64url from 'base64url'
import { UPDATETIME, SETTIMEFN } from '../action/app'

export default (state = {}, action) => {
    switch(action.type) {
        case UPDATETIME:
            return Object.assign(state, {
                time: action.time
            })
        case SETTIMEFN:
            return Object.assign(state, {
                checkTimeOut: function () {
                    const token = localStorage.getItem('token')
                    const time = new Date().getTime()
                    if(!token || JSON.parse(base64url.decode(token.split(".")[1])).exp * 1000 < time && time - state.time > 1000 * 60) {
                        action.fn('/login')
                    }
                }
            })
        default:
            return state
    }
}
