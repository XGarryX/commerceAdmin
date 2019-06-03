export const ADDTAB = 'ADD_TAB'
export const TOGGLETAB = 'TOGGLE_TAB'
export const REMOVETAB = 'REMOVE_TAB'
export const SETTABPROPS = 'SET_TAB_PROPS'
export const CHANGESTATE = 'CHANGE_STATE'

export const addTab = tab => {
    return {
        type: ADDTAB,
        tab,
    }
}

export const toggleTab = tabKey => {
    return {
        type: TOGGLETAB,
        tabKey
    }
}

export const removeTab = tabKey => {
    return {
        type: REMOVETAB,
        tabKey
    }
}

export const setTabProps = (tabKey, props) => {
    return {
        type: SETTABPROPS,
        tabKey,
        props
    }
}

export const changeState = state => {
    return {
        type: CHANGESTATE,
        state
    }
}
