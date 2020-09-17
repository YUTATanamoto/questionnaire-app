import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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
  radioContainer: {
    display: "flex",
    flexDirection: "row",
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

const MyRadioGroup = (props) => {
  const classes = useStyles();
  const { questionnaire, answers, setAnswers } = props;
  const _setAnswers = (newAnswer) => {
    console.log(newAnswer)
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
    console.log(newAnswers);
    setAnswers(newAnswers);
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.descriptionLeft}>
          <h2>{questionnaire.descriptionLeft}</h2>
        </div>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={answers.find(answer => answer.questionnaireId === questionnaire.id).value}
          onChange={e=>_setAnswers(parseInt(e.target.value))}
          >
          <div className={classes.radioContainer}>
            {MARKS.map((mark, key) => {
              return (
                <Radio
                  value={mark.value}
                  key={key}
                />
              );
            })}
          </div>
        </RadioGroup>
        <div className={classes.descriptionRight}>
          <h2>{questionnaire.descriptionRight}</h2>
        </div>
      </div>
    </div>
  );
}

export default MyRadioGroup
