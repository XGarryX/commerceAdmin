import { ADDTAB, TOGGLETAB, REMOVETAB } from '../action/tab'

export default (store = {}, action) => {
    switch(action.type){
        case ADDTAB:
            return Object.assign({}, store, {
                tabList: [...store.tabList, action.tabKey]
            })
        case TOGGLETAB:
            return Object.assign({}, store, {
                tabKey: action.tabKey
            })
        case REMOVETAB:
            const tabList = store.tabList || [],
                index = tabList.findIndex(item => item.tabKey === action.tabKey)
            return Object.assign({}, store, {
                tabList: [
                    ...tabList.slice(0, index),
                    ...tabList.slice(index + 1)
                ]
            })
        default:
            return store
    }
}
