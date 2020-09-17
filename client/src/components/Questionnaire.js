import React, { useState, useEffect } from 'react';
// import MySlider from './MySlider';
import MyRadioGroup from './MyRadioGroup';
import { Button, makeStyles } from '@material-ui/core';
import { BASE_URL } from '../utils/Constants';

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    display: "grid",
  },
  questionnaireContainer: {
    display: "grid",
    "grid-template-rows": "1fr",
    "grid-template-columns": "2fr 3fr",
  },
  left: {
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
  const questionnaires = props.location.state.questionnaires ? props.location.state.questionnaires: []
  const initialAnswers = questionnaires.map((questionnaire, key)=>{
    return {questionnaireId: questionnaire.id, value: 3}
  });
  const [answers, setAnswers] = useState(initialAnswers);
  const [image, setImage] = useState({});
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  useEffect(() => {
    getImage();
  }, []);
  const _setAnswers = newAnswers => setAnswers(newAnswers);
  async function getImage() {
    const url = BASE_URL+'/image'
    await fetch(url)
      .then(res => res.json())
      .then(json => setImage(json.image));
  };
  async function postAnswers() {
    setIsSubmitButtonDisabled(true)
    const data = {
      imageId: image.id,
      answers: answers,
    };
    const url = BASE_URL+'/answers'
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {'Content-Type': 'application/json'},
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    const responseJson = await response.json();
    const message = responseJson.message;
    if (message === 'OK'){
      setIsSubmitButtonDisabled(false);
    }
  };
  async function handleSubmitClick() {
    await postAnswers();
    getImage();
    setAnswers(initialAnswers);
  };

  return (
    <div className={classes.root}>
      <div className={classes.questionnaireContainer}>
        <div className={classes.left}>
          <img src={image.src} className={classes.image} alt={image.src}/>
        </div>
        <div className={classes.right}>
          {questionnaires.map((questionnaire, questionnaireIndex)=>
            <div className={classes.sliderContainer} key={questionnaireIndex}>
              <MyRadioGroup
                questionnaire={questionnaire}
                questionnaireIndex={questionnaireIndex}
                answers={answers}
                setAnswers={_setAnswers}
              />
            </div>
          )}
        </div>
      </div>
      <Button
        variant="contained"
        color="primary"
        disabled={isSubmitButtonDisabled}
        className={classes.button}
        onClick={() => handleSubmitClick()}
      >
        Submit
      </Button>
    </div>
  );
}

export default Questionnaire;
