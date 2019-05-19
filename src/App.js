import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Admin from './page/admin'
import Login from './page/login'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/admin" component={Admin} />
          <Route path="/login" component={Login} />
          <Redirect path="/" to={{pathname: '/admin'}} />
        </Switch>
      </Router>
    )
  }
}

export default App
