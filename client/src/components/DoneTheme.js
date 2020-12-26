import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 10,
  }
});

const Home = props => {
  const classes = useStyles();

  useEffect(() => {
  }, []);

  const handleClick = () => {
    props.history.push({
        pathname: "/questionnaire",
    });
  };

  return (
    <div className={classes.root}>
        お疲れ様でした！<br/>
        このテーマはこれで終了です！
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={handleClick}
      >
        次のテーマの回答をはじめる
      </Button>
    </div>
  );
}

export default withRouter(Home);
