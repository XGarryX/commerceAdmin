export const ADDTAB = 'ADD_TAB'
export const TOGGLETAB = 'TOGGLE_TAB'
export const REMOVETAB = 'REMOVE_TAB'

export const addTab = tabKey => {
    return {
        type: ADDTAB,
        tabKey
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
