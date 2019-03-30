import { ADDNAV, TOGGLENAV, REMOVENAV  } from '../action/nav'

export default (store = {}, action) => {
    switch(action.type){
        case ADDNAV:
            return Object.assgin({}, store, {
                navKey: [...action.navKey, action.navKey]
            })
        case TOGGLENAV:
            return Object.assgin({}, store, {
                navKey: action.navKey
            })
        case REMOVENAV:
            const navList = store.navList || [],
                index = navList.indexOf(action.navKey)
            return Object.assgin({}, store, {
                navList: [
                    ...navList.slice(0, index),
                    ...navList.slice(index + 1)
                ]
            })
        default:
            return store
    }
}
