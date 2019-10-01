import React, { Fragment, useState } from 'react'
import Message from './Message'
import Progress from './Progress'
import axios from 'axios'

const FileUpload = () => {
  const [file, setFile] = useState('')
  const [filename, setFilename] = useState('Choose File')
  const [uploadedFile, setUploadedFile] = useState({})
  const [message, setMessage] = useState('')
  const [uploadPercentage, setUploadPercentage] = useState(0)

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const singleFileUploadHandler = async ( event ) => {
    event.preventDefault()
		const data = new FormData();
// If file selected
		if ( file ) {
      console.log(file)
			data.append( 'profileImage', file, filename );
			await axios.post( '/api/posts', data, {
				headers: {
					'accept': 'application/json',
					'Accept-Language': 'en-US,en;q=0.8',
					'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
				}
			})
				.then( ( response ) => {
					if ( 200 === response.status ) {
						// If file size is larger than expected.
						if( response.data.error ) {
							if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
								console.warn( 'Max size: 2MB', 'red' );
							} else {
								console.log( response.data );
// If not the given file type
                console.warn( response.data.error, 'red' );
							}
						} else {
							// Success
							let fileName = response.data;
							console.log( 'filedata', fileName );
							console.warn( 'File Uploaded', '#3089cf' );
						}
					}
				}).catch( ( error ) => {
				// If another error
				console.warn( error, 'red' );
			});
		} else {
			// if file not selected throw error
			console.warn( 'Please upload file', 'red' );
		}
	};
  const onSubmit = async e => {
    console.log(file)
    console.log(filename)
    e.preventDefault()
    const formData = new FormData()
    formData.append('profileImage', file, filename)
    console.log(formData)

    try {
      const res = await axios.post('/api/posts', formData, {
        headers: {
          'accept': 'application/json',
					'Accept-Language': 'en-US,en;q=0.8',
					'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          )

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={singleFileUploadHandler}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />

        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;


// import React, {useState} from 'react'
// // import Upload from 'material-ui-upload/Upload';
// import PropTypes from 'prop-types'
// import {connect} from 'react-redux'
// // import {addPost} from '../../actions/post'

// import {
//     Input,
//     Avatar,
//     Button,
//     TextField,
//     Link,
//     Grid,
//     Typography,
//     Container, 
//     CssBaseline
//   } from "@material-ui/core"
// import FlatButton from 'material-ui/FlatButton';
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
// import { makeStyles } from "@material-ui/core/styles"

// const useStyles = makeStyles(theme => ({
//     "@global": {
//       body: {
//         backgroundColor: theme.palette.common.white
//       }
//     },
//     paper: {
//       marginTop: theme.spacing(8),
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center"
//     },
//     avatar: {
//       margin: theme.spacing(1),
//       backgroundColor: theme.palette.secondary.main
//     },
//     form: {
//       width: "100%",
//       marginTop: theme.spacing(1)
//     },
//     submit: {
//       margin: theme.spacing(3, 0, 2)
//     }
//   }))


// const AddPost = ({addPost}) => {

//     const classes = useStyles()

//     const [formData, setFormData] = useState({
//         caption: "", 
//         photoUrl: "", 
//       })
    
//       const { caption, photoUrl } = formData
    
//       const onChange = e => {
//         setFormData({ ...formData, [e.target.name]: e.target.value })
//       }

//     const onSubmit = async e => {
//         e.preventDefault()
//         addPost(caption, photoUrl)
//     }

//     const onFileLoad = (e, file) => console.log(e.target.result, file.name);

//     return (
//         <Container component='main' maxWidth='xs' style={{ height: "80vh" }}>
//             <Input type= 'file' placeholder = "Choose"> Choose</Input>
//         {/* <CssBaseline />
//         <div className={classes.paper}>
//           <Avatar className={classes.avatar}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component='h1' variant='h5'>
//             Sign in
//           </Typography>
//           <form className={classes.form} onSubmit={e => onSubmit(e)}>
//             <TextField
//               type='input'
//               variant='outlined'
//               margin='normal'
//               required
//               fullWidth
//               label='Email'
//               name='email'
//               autoComplete='email'
//               autoFocus
//               value={email}
//               onChange={e => onChange(e)}
//               error={!(emailError === "")}
//               helperText={emailError === "" ? "" : emailError}
//             />
//             <TextField
//               name='password'
//               onChange={e => onChange(e)}
//               error={!(passwordError === "")}
//               helperText={passwordError === "" ? "" : passwordError}
//               value={password}
//               type='password'
//               variant='outlined'
//               margin='normal'
//               required
//               fullWidth
//               label='Password'
//               autoComplete='current-password'
//             />
//             <Button
//               type='submit'
//               fullWidth
//               variant='contained'
//               color='primary'
//               className={classes.submit}
//             >
//               Sign In
//             </Button>
//             <Grid container>
//               <Grid item xs>
//                 <LinkRouter to='/register'>
//                   <Link variant='body2'>{"Don't have an account? Sign Up"}</Link>
//                 </LinkRouter>
//               </Grid>
//             </Grid>
//           </form>
//         </div> */}
//       </Container>
//     )
// }

// AddPost.propTypes = {
//     addPost: PropTypes.func.isRequired
// }

// export default connect (null, {})(AddPost)
