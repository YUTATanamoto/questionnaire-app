import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
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
    "grid-template-columns": "1fr 1fr",
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
  button: {
    marginLeft: "1rem",
    height: "2.5rem",
    width: 100,
  },
});

const Home = props => {
  const classes = useStyles();
  const [questionnaires, setQuestionnaires] = useState([]);
  useEffect(() => {
    getQuestionnaires();
  }, []);
  const startQuestionnaire = () => {
    props.history.push({
      pathname: "/questionnaire",
      state: {questionnaires: questionnaires}
    });
  };
  async function getQuestionnaires() {
    const url = BASE_URL+'/questionnaires'
    await fetch(url)
      .then(res => res.json())
      .then(json => setQuestionnaires(json.questionnaires));
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
