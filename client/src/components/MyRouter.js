import React from 'react';
import Questionnaire from './Questionnaire';
import PreQuestionnaire from './PreQuestionnaire';
import Home from './Home.js';
import { BrowserRouter as Router, Route } from "react-router-dom";

export default function MyRouter() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/pre_questionnaire" exact component={PreQuestionnaire} />
      <Route path="/questionnaire" exact component={Questionnaire} />
    </Router>
  );
}
