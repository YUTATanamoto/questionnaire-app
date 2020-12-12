import React, { useState, useEffect } from 'react';
import MyRadioGroup from './MyRadioGroup';
import { Button, makeStyles } from '@material-ui/core';
import { BASE_URL, QUESTIONNAIRES } from '../utils/Constants';
import firebase from "firebase";

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    display: "grid",
    backgroundColor: "gray",
  },
  questionnaireContainer: {
    width: "100%",
    height: "100%",
    display: "grid",
    "grid-template-rows": "1fr",
    "grid-template-columns": "3fr 2fr",
  },
  left: {
    width: "100%",
    height: "100%",
    gridRow: 1,
    gridColumn: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  right: {
    gridRow: 1,
    gridColumn: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    rightRow: 1,
    gridColumn: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    objectFit: "contain",
  },
  sliderContainer: {
    width: "100%",
  },
  button: {
    marginLeft: "1rem",
    height: "2.5rem",
    width: 100,
  },
});

const Questionnaire = props =>  {
  const classes = useStyles();
  const initialAnswers = QUESTIONNAIRES.map((questionnaire, key)=>{
    return {questionnaireId: questionnaire.id, value: 3}
  });
  const [answers, setAnswers] = useState(initialAnswers);
  const [imageId, setImageId] = useState();

  useEffect(() => {
    getAndSetImageId();
  }, []);
  
  const getAndSetImageId = () => {
    firebase.database().ref('images').once('value').then( snapshot => {
      var notAnsweredImageIds = [];
      snapshot.forEach( childSnapshot  => {
        if (!childSnapshot.val().answered_at) {
          notAnsweredImageIds.push(childSnapshot.key);
        }
      });
      const index = Math.floor(Math.random() * Math.floor(notAnsweredImageIds.length));
      setImageId(notAnsweredImageIds[index]);
    });
  };
  const save = () => {
    var data = {};
    const date = new Date();
    const currentTime = date.getTime();
    answers.forEach( answer => {
      data[answer.questionnaireId] = answer.value;
    });
    firebase.database().ref(`answers/${imageId}`).set(data, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("data saved successfully!");
      }
    });
    var updates = {};
    updates[`/images/${imageId}/answered_at`] = currentTime;
    firebase.database().ref().update(updates);
  };
  const handleClick = () => {
    save();
    getAndSetImageId();
  };

  return (
    <div className={classes.root}>
      <div className={classes.questionnaireContainer}>
        <div className={classes.left}>
          <img src={`http://localhost:5000/static/images/${imageId}.jpg`} className={classes.image} alt={imageId}/>
        </div>
        <div className={classes.right}>
          {QUESTIONNAIRES.map((questionnaire, key)=>
            <div className={classes.sliderContainer} key={key}>
              <MyRadioGroup
                questionnaire={questionnaire}
                answers={answers}
                setAnswers={setAnswers}
              />
            </div>
          )}
        </div>
      </div>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={handleClick}
      >
        Submit
      </Button>
    </div>
  );
}

export default Questionnaire;
