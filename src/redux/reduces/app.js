import navActive from './nav'

export default (state = {}, action) => {
    return {
        navActive: navActive(state.navActive, action.type)
    }
}
