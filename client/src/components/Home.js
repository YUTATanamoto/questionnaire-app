import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { Button, makeStyles } from '@material-ui/core';
import firebase from 'firebase/app'

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 10,
  }
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
      setIsButtonAnabled(true);
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
  const handleStartButtonClick = () => {
    if (numberOfImagesAnsweredToday === 0) {
      startPreQuestionnaire();
    } else {
      startQuestionnaire();
    }
  }; 
  const handleCheckButtonClick = () => {
    props.history.push({
      pathname: "/result",
    });
  };

  return (
    <div className={classes.root}>
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={handleStartButtonClick}
        disabled={!isButtonAnabled}
      >
        回答をはじめる
      </Button>
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={handleCheckButtonClick}
        disabled={!isButtonAnabled}
      >
        回答を確認する
      </Button>
    </div>
  );
}

export default withRouter(Home);
