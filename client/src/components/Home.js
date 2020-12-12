import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { Button, makeStyles } from '@material-ui/core';
import firebase from "firebase";

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    display: "grid",
  },
  questionnaireContainer: {
    display: "grid",
    "grid-template-rows": "1fr",
    "grid-template-columns": "1fr 1fr",
  },
  button: {
    marginLeft: "1rem",
    height: "2.5rem",
    width: 100,
  },
});

const Home = props => {
  const classes = useStyles();

  useEffect(() => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const currentDate = date.getDate();
    const _date = new Date(currentYear, currentMonth, currentDate, 0, 0, 0);
    console.log(_date);
    const currentDateStartTime = _date.getTime()
    
    let timeStamps = [];
    firebase.database().ref('images').once('value').then( snapshot => {
      snapshot.forEach( childSnapshot  => {
        if (childSnapshot.val().answered_at) {
          timeStamps.push(childSnapshot.val().answered_at);
        }
      });
      const lastAnsweredTime = Math.max(...timeStamps);
      if (lastAnsweredTime <= currentDateStartTime) {
        alert("How are you?");
      }
    });
  }, []);
  const startQuestionnaire = () => {
    props.history.push({
      pathname: "/questionnaire",
    });
  };

  return (
    <div className={classes.root}>
      <p>Home</p>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={startQuestionnaire}
      >
        Start
      </Button>
    </div>
  );
}

export default withRouter(Home);
