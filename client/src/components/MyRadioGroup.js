import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { MARKS } from '../utils/Constants';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
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
  const { questionnaire, answers, setAnswers, setIsSubmitButtonAnabled } = props;
  const _setAnswers = newAnswer => {
    const date = new Date();
    const currentTime = date.getTime();
    const newAnswers = answers.map((answer)=>{
      if (answer.questionnaireId === questionnaire.id) {
        return {questionnaireId: answer.questionnaireId, selectedAt: currentTime, value: newAnswer};
      }
      else {
        return answer;
      }
    });
    if (newAnswers.filter($0 => $0.value).length === answers.length) {
      setIsSubmitButtonAnabled(true);
    }
    setAnswers(newAnswers);
  };

  return (
    <div className={classes.root}>
      <div className={classes.descriptionLeft}>
        <b>{questionnaire.descriptionLeft}</b>
      </div>
      <RadioGroup
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
        <b>{questionnaire.descriptionRight}</b>
      </div>
    </div>
);
}

export default MyRadioGroup
