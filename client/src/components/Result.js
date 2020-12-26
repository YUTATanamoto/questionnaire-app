import React, { useState, useEffect } from 'react';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Typography, Button, makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { QUESTIONNAIRES } from '../utils/Constants';
import firebase from 'firebase/app'

const drawingTheme = "face";
const useStyles = makeStyles({
  root: {
    width: "100%",
    display: "flex",
    flexWrap:"wrap",
  },
  card: {
    width: 500,
    margin: 10,
    display: "flex",
    flexDirection: "row",
  },
  media: {
    width: 200,
    // objectFit: "contain",
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
});

const Result = props =>  {
  const classes = useStyles();
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    getAnswers();
  }, []);

  const getAnswers = () => {
    firebase.database().ref('answers').once('value').then( snapshot => {
      var _answers = [];
      snapshot.forEach( childSnapshot  => {
        _answers.push(childSnapshot.val());
      });
      setAnswers(_answers);
    });
  };

  const getHumanReadable = time => {
    const dateTime = new Date(time);
    return dateTime.toLocaleDateString('ja-JP')+dateTime.toLocaleTimeString('ja-JP')
  };

  const getEvaluationItem = questionnaireId => {
      const questionaire = QUESTIONNAIRES.find(element => element.id === questionnaireId);
      return questionaire.descriptionLeft+"-"+questionaire.descriptionRight;
  };

  return (
    <div className={classes.root}>
      {answers.map((answer, key)=>
        <Card className={classes.card} key={key}>
            <CardMedia
              className={classes.media}
              image={`https://children-drawing-images.web.app/${answer.image_id}.jpg`}
              title="Drawing"
            />
            <div className={classes.details}>
            <CardContent>
                {Object.values(answer.contents).map((content, key)=>
                    <Typography gutterBottom variant="body2" component="h2" key={key}>
                       {getEvaluationItem(content.questionaire_id)} :　{content.value}
                    </Typography>
                )}
                <Typography variant="body2" color="textSecondary" component="p">
                    Submitted at: {getHumanReadable(answer.submitted_at)}
                </Typography>
            </CardContent>
            </div>
        </Card>
      )}
    </div>
  );
}

export default Result;
