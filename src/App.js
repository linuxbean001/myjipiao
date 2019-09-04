import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import Home from "./pages/home/index";
import Dashboard from "./pages/dashboard/index";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Router>
            <div>
              <ul>
                <li>
                  <NavLink activeClassName="active"  to="/">Home</NavLink>
                </li>
               <li>
                 <Link to="/">Home</Link>
               </li>
               <li>
               <Link to={{
                  pathname: '/dashboard',
                  search: '?filter='+JSON.stringify({id:0, name:'hahaha'}),
                  state: { fromNavBar: true }
                }}>Admin</Link>
               </li>
               <li>
                 <Link  to="/child">Child</Link>
               </li>
             </ul>

            <Route path="/" exact component={Home} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/child"  children={(props) => {
                if(props.match) {

               }
               return null;
              }} />
            </div>
          </Router>

        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
