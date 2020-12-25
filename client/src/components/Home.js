import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { Button, makeStyles } from '@material-ui/core';
import firebase from 'firebase/app'

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

const Home = props => {
  const classes = useStyles();
  const [numberOfImagesAnsweredToday, setNumberOfImagesAnsweredToday] = useState();
  const [isButtonAnabled, setIsButtonAnabled] = useState(false);

  useEffect(() => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const currentDate = date.getDate();
    const _date = new Date(currentYear, currentMonth, currentDate, 0, 0, 0);
    const currentDateStartTime = _date.getTime()
    firebase.database().ref('answers').once('value').then( snapshot => {
      let i = 0;
      snapshot.forEach( childSnapshot  => {
        if (childSnapshot.val().submitted_at > currentDateStartTime) {
          i += 1;
        }
      });
      setNumberOfImagesAnsweredToday(i);
      setisButtonAnabled(true);
    });
  }, []);
  const startQuestionnaire = () => {
    props.history.push({
      pathname: "/questionnaire",
    });
  };
  const startPreQuestionnaire = () => {
    props.history.push({
      pathname: "/pre_questionnaire",
    });
  };
  const handleClick = () => {
    if (numberOfImagesAnsweredToday === 0) {
      startPreQuestionnaire();
    } else {
      startQuestionnaire();
    }
  }; 

  return (
    <div className={classes.root}>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClick}
        disabled={!isButtonAnabled}
      >
        はじめる
      </Button>
    </div>
  );
}

export default withRouter(Home);
