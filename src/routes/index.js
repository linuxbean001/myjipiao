import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, NavLink, Redirect} from 'react-router-dom';
import HomeHeader from '../components/HomeHeader/index'
import Footer from '../components/Footer/index'
import Home from '../pages/Home'
import Fare from '../pages/Fare'
import Passenger from '../pages/Passenger'
import CreateBooking from '../pages/CreateBooking'
import Info from '../pages/Info'



const Routes = () => (
    <Router>
        <div className="all-div">
          <HomeHeader/>
          <Switch>
              <Route path="/" exact component={Home}/>
              <Route path='/Fare' component={Fare}/>
              <Route path='/Passenger' component={Passenger}/>
              <Route path='/CreateBooking' component={CreateBooking}/>
              <Route path='/Info' component={Info}/>
          </Switch>
          <Footer />
        </div>
    </Router>
);
export default Routes;
