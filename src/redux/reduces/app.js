import tabReduce from './tab'
import siderState from './sider'
import token from './token'
import lastTime from './lastTime'

export default (state = {}, action) => {
    return {
        tab: tabReduce(state.tab, action),
        sider: siderState(state.sider, action),
        token: token(state.token, action),
        api: state.api,
        lastTime: lastTime(state.lastTime, action)
    }
}
