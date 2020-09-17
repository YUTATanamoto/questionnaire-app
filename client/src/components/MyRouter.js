import React from 'react';
import Questionnaire from './Questionnaire';
import Home from './Home.js';
import HeaderBar from './HeaderBar';
import { BrowserRouter as Router, Route } from "react-router-dom";

export default function MyRouter() {
  return (
    <Router>
      <HeaderBar />
      <Route path="/" exact component={Home} />
      <Route path="/questionnaire" exact component={Questionnaire} />
    </Router>
  );
}
