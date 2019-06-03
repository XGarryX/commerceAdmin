function setState() {
    let setState = this.setState
    let componentWillUnmount = this.componentWillUnmount

    this._isMounted = false

    this.setState = function (...arg) {
        if ( this._isMounted ) return
        setState.apply(this, arg)
    }
    
    this.componentWillUnmount = function(...arg) {
        this._isMounted = true
        componentWillUnmount && componentWillUnmount.apply(this, arg)
    }
}

export default setState
