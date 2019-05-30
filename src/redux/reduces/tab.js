import { ADDTAB, TOGGLETAB, REMOVETAB, SETTABPROPS } from '../action/tab'

export default (store = {}, action) => {
    switch(action.type){
        case ADDTAB:
            return Object.assign({}, store, {
                tabList: [...store.tabList, action.tab]
            })
        case TOGGLETAB:
            return Object.assign({}, store, {
                tabKey: action.tabKey
            })
        case REMOVETAB:
            var tabList = store.tabList || [],
                index = tabList.findIndex(item => item.tabKey === action.tabKey)
            return Object.assign({}, store, {
                tabList: [
                    ...tabList.slice(0, index),
                    ...tabList.slice(index + 1)
                ]
            })
        case SETTABPROPS:
            var tabList = store.tabList || [],
            index = tabList.findIndex(item => item.tabKey === action.tabKey)
            store.tabList[index].props = action.props
            return store
        default:
            return store
    }
}
