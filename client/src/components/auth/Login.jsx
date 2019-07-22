import React, { Fragment, useState } from "react"
import { connect } from "react-redux"
import { Link as LinkRouter, Redirect } from "react-router-dom"
import PropTypes from "prop-types"
import { login } from "../../actions/auth"
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Typography,
  Container
} from "@material-ui/core"
import CssBaseline from "@material-ui/core/CssBaseline"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

const Login = ({ login, isAuthenticated }) => {
  const classes = useStyles()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    emailError: "",
    passwordError: ""
  })

  const { email, password, emailError, passwordError } = formData

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const validate = () => {
    let isError = false
    const errors = {
      emailError: "",
      passwordError: ""
    }

    if (password.length < 6) {
      isError = true
      errors.passwordError = "Password needs to be atleast 6 characters long"
    }

    if (email.length < 6) {
      isError = true
      errors.emailError = "email needs to be atleast 6 characters long"
    }
    setFormData({ ...formData, ...errors })
    return isError
  }

  const onSubmit = async e => {
    e.preventDefault()
    const err = validate()
    if (!err) {
      login(email, password)
    }
  }

  //Redirect if looged in

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />
  }

  return (
    <Container component='main' maxWidth='xs' style={{ height: "80vh" }}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={e => onSubmit(e)}>
          <TextField
            type='input'
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label='Email'
            name='email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={e => onChange(e)}
            error={!(emailError === "")}
            helperText={emailError === "" ? "" : emailError}
          />
          <TextField
            name='password'
            onChange={e => onChange(e)}
            error={!(passwordError === "")}
            helperText={passwordError === "" ? "" : passwordError}
            value={password}
            type='password'
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label='Password'
            autoComplete='current-password'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <LinkRouter to='/register'>
                <Link variant='body2'>{"Don't have an account? Sign Up"}</Link>
              </LinkRouter>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(
  mapStateToProps,
  { login }
)(Login)

