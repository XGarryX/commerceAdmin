import tabReduce from './tab'

export default (state = {}, action) => {
    return {
        tab: tabReduce(state.tab, action)
    }
}
