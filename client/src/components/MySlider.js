import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import { MARKS } from '../utils/Constants';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    display: "grid",
    "grid-template-rows": "1fr",
    "grid-template-columns": "1fr 3fr 1fr",
  },
  descriptionLeft: {
    gridRow: 1,
    gridColumn: 1,
    display: "flex",
    flexDirection: "column",
    textAlign: 'center',
    justifyContent: "space-between",
  },
  slider: {
    gridRow: 1,
    gridColumn: 2,
    display: "flex",
    flexDirection: "column",
    textAlign: 'center',
    justifyContent: "space-between",
  },
  descriptionRight: {
    gridRow: 1,
    gridColumn: 3,
    display: "flex",
    flexDirection: "column",
    textAlign: 'center',
    justifyContent: "space-between",
  },
}));

const MySlider = (props) => {
  const classes = useStyles();
  const { questionnaire, answers, setAnswers } = props;
  const _setAnswers = (newAnswer) => {
    // using .splice() doesn't work as expected...
    // answers.splice(questionnaireIndex, 1, newAnswer);
    const newAnswers = answers.map((answer, index)=>{
      if (answer.questionnaireId === questionnaire.id) {
        return {questionnaireId: answer.questionnaireId, value: newAnswer};
      }
      else {
        return answer;
      }
    });
    setAnswers(newAnswers);
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.descriptionLeft}>
          <h2>{questionnaire.descriptionLeft}</h2>
        </div>
        <Slider
          track={false}
          min={1}
          max={5}
          aria-labelledby="track-false-slider"
          defaultValue={3}
          marks={MARKS}
          value={answers.find(answer => answer.questionnaireId === questionnaire.id).value}
          onChangeCommitted={(_, value)=>_setAnswers(value)}
          className={classes.sliders}
        />
        <div className={classes.descriptionRight}>
          <h2>{questionnaire.descriptionRight}</h2>
        </div>
      </div>
    </div>
  );
}

export default MySlider
