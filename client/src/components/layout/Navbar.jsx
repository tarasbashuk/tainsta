import React, { Fragment } from "react"
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { logout } from "../../actions/auth"
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, IconButton, Switch, FormControlLabel, FormGroup, MenuItem, Menu} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import  AccountCircle from '@material-ui/icons/AccountCircle';

// import HeaderMenu from './HeaderMenu/HeaderMenu'


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
    console.log('loading',loading);
    console.log('isAuthenticated',isAuthenticated);
  const classes = useStyles();
//   const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleChange(event) {
    if(!isAuthenticated) return  <Redirect to='/login' />
    logout()
    // setAuth(event.target.checked);
   
  }

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }
  
  return (  
    <div className={classes.root}>
      <FormGroup>
{/* /////////////Переделать со спинером/////////// */}
        {!loading && <FormControlLabel
          control={<Switch checked={isAuthenticated} onChange={handleChange} aria-label="LoginSwitch" />}
          label={isAuthenticated ? 'Logout' : 'Login'}
        />}
      </FormGroup>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton> */}
          {/* <HeaderMenu/> */}
          <Typography variant="h6" className={classes.title}>
            TAINSTA
          </Typography>
          {isAuthenticated && (
            <div>
              <IconButton
                aria-label="Account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

// const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
//   const authLinks = (
//     <ul>
//        <li>
//         <Link to='/profiles'>
//           Developers
//         </Link>
//       </li>
//       <li>
//         <Link to='/posts'>
//           Posts
//         </Link>
//       </li>
//       <li>
//         <Link to='/dashboard'>
//           <i className='fas fa-user' />{" "}
//           <span className='hide-sm'>Dashboard</span>
//         </Link>
//       </li>
//       <li>
//         <a onClick={logout} href='#!'>
//           <i className='fas fa-sign-out-alt' />{" "}
//           <span className='hide-sm'>Logout</span>
//         </a>
//       </li>
//     </ul>
//   )

//   const guestLinks = (
//     <ul>
//       <li>
//         <a href='/profiles'>Developers</a>
//       </li>
//       <li>
//         <Link to='/register'>Register</Link>
//       </li>
//       <li>
//         <Link to='/login'>Login</Link>
//       </li>
//     </ul>
//   )

//   return (
//     <nav className='navbar bg-dark'>
//       <h1>
//         <Link to='/'>
//           <i className='fas fa-code' /> DevConnector
//         </Link>
//       </h1>
//       {!loading && (
//         <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
//       )}
//     </nav>
//   )
// }

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(
  mapStateToProps,
  { logout }
)(Navbar)