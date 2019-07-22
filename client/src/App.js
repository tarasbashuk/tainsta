import React, { Fragment, useEffect } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Navbar from './components/layout/Navbar'
import PrivateRoute from './components/routing/PrivateRoute'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'

import Alert from './components/layout/Alert'

// Redux
import { Provider } from "react-redux"
import store from "./store"

// auth
import setAuthToken from "./utils/setAuthToken"
import { loadUser } from "./actions/auth"

import './App.css'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar/>
          <Route exact path="/" component = {Landing}/>
          <section className='container'>
            <Alert/>
            <Switch>
              <Route exact path="/register" component = {Register}/>
              <Route exact path="/login" component = {Login}/>
              <PrivateRoute exact path="/dashboard" component = {Landing}/>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App
