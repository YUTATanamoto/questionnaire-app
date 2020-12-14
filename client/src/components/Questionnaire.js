import React, { useState, useEffect } from 'react';
import MyRadioGroup from './MyRadioGroup';
import { Button, makeStyles } from '@material-ui/core';
import { QUESTIONNAIRES } from '../utils/Constants';
import firebase from "firebase";

const drawingTheme = "face";
const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    display: "grid",
    "grid-template-columns": "1fr 1fr",
    justifyContent: "center",
    alignItems: "center",
  },
  left: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    objectFit: "contain",
  },
  right: {
    width: "90%",
    height: "70%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  currentAchievement: {
    flex: "2 0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  radioGroups: {
    flex: "9 0 auto",
    display: "flex",
    flexDirection: "column",
  },
  radioGroup: {
    flex: "1 0 auto",
  },
  button: {
    flex: "0.3 0 auto",
  },
});

const Questionnaire = props =>  {
  const classes = useStyles();
  const [isSubmitButtonAnabled, setIsSubmitButtonAnabled] = useState(false);
  const initialAnswers = QUESTIONNAIRES.map((questionnaire, key)=>{
    return {questionnaireId: questionnaire.id, selectedAt: null, value: null}
  });
  const [answers, setAnswers] = useState(initialAnswers);
  const [imageId, setImageId] = useState();
  const [startTime, setStartTime] = useState(0);
  const [numberOfImagesAnsweredToday, setNumberOfImagesAnsweredToday] = useState();
  const [numberOfImagesAnswered, setNumberOfImagesAnswered] = useState();

  useEffect(() => {
    getAndSetStartTime();
    getCurrentAchievement();
    getAndSetImageId();
  }, []);
  
  const getAndSetStartTime = () => {
    const date = new Date();
    const currentTime = date.getTime();
    setStartTime(currentTime);
  };
  const resetAnswers = () => {
    setAnswers(initialAnswers);
  };
  const getCurrentAchievement = () => {
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
      setNumberOfImagesAnswered(snapshot.numChildren());
    });
  };
  const getAndSetImageId = () => {
    firebase.database().ref('images').orderByChild('theme').equalTo(drawingTheme).once('value').then( snapshot => {
      var notAnsweredImageIds = [];
      snapshot.forEach( childSnapshot  => {
        if (!childSnapshot.val().submitted_at) {
          notAnsweredImageIds.push(childSnapshot.key);
        }
      });
      const index = Math.floor(Math.random() * Math.floor(notAnsweredImageIds.length));
      setImageId(parseInt(notAnsweredImageIds[index]));
    });
  };
  async function save() {
    var data = {};
    const date = new Date();
    const currentTime = date.getTime();
    const newAnswerRef = await firebase.database().ref("answers").push();
    data["started_at"] = startTime;
    data["submitted_at"] = currentTime;
    data["image_id"] = imageId;
    data["contents"] = {}
    answers.forEach( answer => {
      const newContentRef = newAnswerRef.child("contents").push();
      const newContentKey = newContentRef.key
      data["contents"][newContentKey] = {};
      data["contents"][newContentKey]["questionaire_id"] = answer.questionnaireId;
      data["contents"][newContentKey]["value"] = answer.value;
      data["contents"][newContentKey]["selected_at"] = answer.selectedAt;
    });
    await newAnswerRef.set(data);
    var updates = {};
    updates[`/images/${imageId}/submitted_at`] = currentTime;
    await firebase.database().ref().update(updates, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("data saved successfully!");
      }
    });
  };
  async function handleClick() {
    setIsSubmitButtonAnabled(false);
    await save();
    resetAnswers();
    getCurrentAchievement();
    getAndSetImageId();
    getAndSetStartTime();
  };

  return (
    <div className={classes.root}>
      {imageId?<img src={`https://children-drawing-images.web.app/${imageId}.jpg`} className={classes.left} alt={imageId}/>:<div className={classes.left}>Loading...</div>}
      <div className={classes.right}>
        <div className={classes.currentAchievement}>
          <b><span role="img" aria-label="_">✨✨</span>　累計回答数　{numberOfImagesAnswered}　<span role="img" aria-label="_">✨✨</span></b>
          <b><span role="img" aria-label="_">✨</span>　本日の回答数　{numberOfImagesAnsweredToday}　<span role="img" aria-label="_">✨</span></b>
        </div>
        <div className={classes.radioGroups}>
          {QUESTIONNAIRES.map((questionnaire, key)=>
            <div className={classes.radioGroup} key={key}>
              <MyRadioGroup
                questionnaire={questionnaire}
                answers={answers}
                setAnswers={setAnswers}
                setIsSubmitButtonAnabled={setIsSubmitButtonAnabled}
              />
            </div>
          )}
        </div>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={handleClick}
          disabled={!isSubmitButtonAnabled}
        >
          次へ
        </Button>
      </div>
    </div>
  );
}

export default Questionnaire;
