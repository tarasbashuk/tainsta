
import React, {useState} from 'react'
import {Avatar, Button, CssBaseline, TextField, Link, Grid, Container, Typography }  from '@material-ui/core'
import { connect } from "react-redux"
import { Link as RouterLink, Redirect } from "react-router-dom"
import { setAlert } from "../../actions/alert"
import { register } from "../../actions/auth"
import PropTypes from "prop-types"
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Register = ({ setAlert, register, isAuthenticated }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    password2: "",
    userNameError: "",
    passwordError: "",
    emailError: ""
  })

  const { email, userName, password, password2, userNameError, passwordError, emailError } = formData

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const validate = () => {
    let isError = false
    const errors = {
      userNameError: "",
      passwordError: "",
      emailError: ""
    }

    if(!email.match(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/)) {
        isError = true
        errors.emailError = "Enter proper email"
        
    }
    if (password.length < 6) {
      isError = true
      errors.passwordError = "Password needs to be atleast 6 characters long"
    }

    if (password !== password2) {
        isError = true
        errors.passwordError = "Passwords do not match"  
      }

    if (userName.length < 6) {
      isError = true
      errors.userNameError = "Username needs to be atleast 6 characters long"
    }
    setFormData({ ...formData, ...errors })
    return isError
  }

  const onSubmit = async e => {
    e.preventDefault()
    const err = validate()
    if (!err) {
        register({ userName, email, password })
    }
  }
  if (isAuthenticated) {
    return <Redirect to='/dashboard'/>
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit = {e => onSubmit(e)}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
              <TextField
                autoComplete="email"
                name="email"
                variant="outlined"
                required
                fullWidth
                label="Email"
                autoFocus
                value = {email}
                onChange={e => onChange(e)}
                error={!(emailError === "")}
                helperText={emailError === "" ? "" : emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="username"
                name="userName"
                variant="outlined"
                required
                fullWidth
                label="User Name"
                value = {userName}
                onChange={e => onChange(e)}
                error={!(userNameError === "")}
                helperText={userNameError === "" ? "" : userNameError}
              />
            </Grid>
            <Grid item xs={12}>
            <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => onChange(e)}
                error={!(passwordError === "")}
                helperText={passwordError === "" ? "" : passwordError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password2"
                label="Repeat password"
                type="password"
                autoComplete="current-password"
                value={password2}
                onChange={e => onChange(e)}
                error={!(passwordError === "")}
                helperText={passwordError === "" ? "" : passwordError}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
            <RouterLink to="/login"> 
              <Link  variant="body2">
              Already have an account? Sign in
              </Link>
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  }
  
  const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
  })
  
  export default connect(
    mapStateToProps,
    { setAlert, register }
  )(Register)