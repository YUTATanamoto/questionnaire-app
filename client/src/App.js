import React from 'react';
import './App.css';
import MyRouter from './components/MyRouter';
import { makeStyles } from '@material-ui/core';
import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyB8VjAuaLLeUj9JSKOlElJFOkYeV5vZgYk",
  authDomain: "children-drawing-annotation.firebaseapp.com",
  databaseURL: "https://children-drawing-annotation-default-rtdb.firebaseio.com",
  projectId: "children-drawing-annotation",
  storageBucket: "children-drawing-annotation.appspot.com",
  messagingSenderId: "203641275137",
  appId: "1:203641275137:web:8f411e9bbbc038ac491100",
  measurementId: "G-N8YYC9ZD83"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app();
}
firebase.analytics();

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
  },
});

function App() {
  const classes = useStyles();
  return (
    <div classesname={classes.root}>
      <MyRouter />
    </div>
  );
}

export default App;
