import React, { Fragment } from "react"

import { CssBaseline, Typography, Paper, Grid, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  buttons: {
      marginRight: 50
  },

  btns_container: {
    maxWidth: '100%',
    display:   "flex",
    justifyContent: "center", 
    alignItems: 'center'
 },

}))

const Landing = () => {
  const classes = useStyles()

  return (
    <Fragment>
      <CssBaseline />
      <Grid
        container
        spacing={3}
        justify='center'
        alignItems='center'
        style={{ height: "80vh" }}
      >
        <Grid item xs={10}>
          <Paper className={classes.paper}>
            <Typography
              variant='h2'
              component='h1'
              color='textPrimary'
              gutterBottom
            >
              tainsta
            </Typography>
          </Paper>
          <Paper className={classes.paper}>
          <Typography variant='h4' color='textSecondary' gutterBottom>
              This is a training project by Taras Bashuk. I use NODE.JS,
              REACT, Redux, Material-UI, MongoDB and Express.
            </Typography>
          </Paper>
          <Paper className={classes.paper} >
          <Grid item xs={10} className={classes.btns_container}>
          <Button
                variant='contained'
                size='large'
                color='primary'
                className={classes.buttons}
                href='/register' 
              >
                Sign In
              </Button>
              <Button
                variant='contained'
                size='large'
                color='secondary'
                className={classes.buttons}
                href='/register' 
              >
                Sign Up
              </Button>
        </Grid>
        </Paper>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default Landing