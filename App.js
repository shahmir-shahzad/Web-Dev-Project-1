import React, { Component } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router,Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import LogIn from './Components/login';
import NotFound from './Components/notFound';
import SignUp from './Components/signup';
import Home from './Components/home';
import ProtectedRoute from './ProtectedRoute';
import NavBar from './Components/navBar';
import './App.css';

class App extends React.Component {
  render() { 
    return  (
      <React.Fragment>
        <Router>
        <NavBar  />
        <Switch>
          <Route exact path="/" >
            <LogIn />
          </Route>
          <Route path="/login">
            <LogIn />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <ProtectedRoute path="/home" component={Home}/>
            {/* <Home />
          </ProtectedRoute> */}
          <Route>
            <NotFound />
          </Route>
        </Switch>
        </Router>
      </React.Fragment>
    );
  }
}
 
export default App;


