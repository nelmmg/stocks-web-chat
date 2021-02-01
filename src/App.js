import './App.css';
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Stock from './Stock';
import Login from './Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import firebase from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import NoStock from './NoStocks';

const auth = firebase.auth();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
          <div className="app_body">
            <Router>
              <Sidebar />
              <Switch>
                <Route path="/stocks/:stockId">
                  <Stock />
                </Route>
                <Route path="/">
                  <NoStock />
                </Route>
              </Switch>
            </Router>
          </div>
        )}

    </div>
  );
}

export default App;
