import tabReduce from './tab'
import siderState from './sider'

export default (state = {}, action) => {
    return {
        tab: tabReduce(state.tab, action),
        sider: siderState(state.sider, action)
    }
}
