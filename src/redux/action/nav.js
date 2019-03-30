
export const ADDNAV = 'ADD_NAV'
export const TOGGLENAV = 'TOGGLE_NAV'
export const REMOVENAV = 'REMOVE_NAV'

export const addeNav = navKey => {
    return {
        type: ADDNAV,
        navKey
    }
}

export const toggleNav = navKey => {
    return {
        type: TOGGLENAV,
        navKey
    }
}

export const removeNav = navKey => {
    return {
        type: REMOVENAV,
        navKey
    }
}
