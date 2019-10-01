import React, { Fragment, useState } from "react"
import Message from "./Message"
import Progress from "./Progress"
import axios from "axios"
import "./AddPost.css"

import { TextField, Input } from "@material-ui/core"

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
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

const AddPost = () => {
  const classes = useStyles()

  const [file, setFile] = useState("")
  const [fileURL, setFileURL] = useState("")
  const [uploadedFile, setUploadedFile] = useState({})
  const [message, setMessage] = useState("")
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const [formData, setFormData] = useState({
    caption: "",
    captionError: ""
  })

  let { caption, captionError } = formData

  const onInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const validate = () => {
    let isError = false

    if (caption.length < 1) {
      isError = true
      captionError = "Caption is required"
    }

    setFormData({ ...formData, captionError })
    return isError
  }

  const onChange = e => {
    setFile(e.target.files[0])
    setFileURL(URL.createObjectURL(e.target.files[0]))
    console.log(fileURL)
  }
  const onSubmit = async e => {
    e.preventDefault()
    // const err = validate()
    // if (!err) {
      fileUpload(e)
    // }
  }
  const fileUpload = async e => {
    e.preventDefault()
    const data = new FormData()
    // If file selected
    if (file && caption) {
      console.log("!!!!", file.name)
      data.append("postImage", file, file.name)
      data.append("caption", caption)
      await axios
        .post("/api/posts", data, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`
          },

          onUploadProgress: progressEvent => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            )
            // Clear percentage
            setTimeout(() => setUploadPercentage(0), 10000)
          }
        })
        .then(res => {
          if (200 === res.status) {
            // If file size is larger than expected.
            if (res.data.error) {
              if ("LIMIT_FILE_SIZE" === res.data.error.code) {
                setMessage("Max size: 2MB")
              } else {
                setMessage(res.data.error)
              }
            } else {
              // Success
              const { fileName, filePath } = res.data
              setUploadedFile({ fileName, filePath })
              setMessage("File Uploaded")
            }
          }
        })
        .catch(err => {
          // If another error
          setMessage(err)
        })
    } else if (!file) {
      setMessage("Please upload file")
    } else if (!caption) {
      setMessage("Please add caption")
    }

    try {
      const res = await axios.post("/api/posts", formData, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          )

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000)
        }
      })

      const { fileName, filePath } = res.data

      setUploadedFile({ fileName, filePath })
      setMessage("File Uploaded")
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was a problem with the server")
      } else {
        setMessage(err.response.data.msg)
      }
    }
  }

  return (
    <Fragment>
      <form onSubmit={onSubmit}>
        <div className='file-field input-field'>
          <div className='btn indigo'>
            <span>Choose Photo</span>
            <input type='file' onChange={onChange} />
          </div>
          <div className='file-path-wrapper'>
            <input type='text' className='file-path validate' />
          </div>
        </div>
        <div className='progress'>
          <div
            className='determinate'
            style={{ width: `${uploadPercentage}%` }}
          ></div>
        </div>
        {fileURL ? (
          <>
            <p className='flow-text indigo-text'>Say something about...</p>
            <div className='input-field col s12'>
              <textarea
                id='textarea1'
                className='materialize-textarea'
                require='true'
              ></textarea>
              <label htmlFor='textarea1'>Textarea</label>
            </div>
            <button
              className='btn waves-effect waves-light indigo'
              type='submit'
              name='action'
            >
              Upload
              <i className='material-icons right'>send</i>
            </button>
            <img style={{ width: "100%" }} src={fileURL} alt='' />
          </>
        ) : null}
      </form>
    </Fragment>
  )
}

export default AddPost

{
  /* <input type="file" name="file" id="file" className="inputfile" />
        <label for="file">Choose a file</label> */
}

{
  /* {message ? <Message msg={message} /> : null}
        <form onSubmit={onSubmit}>
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

          <TextField
            name='caption'
            onChange={e => onInputChange(e)}
            error={!(captionError === "")}
            helperText={captionError === "" ? "" : captionError}
            value={caption}
            type='text'
            variant='outlined'
            margin='normal'
            required
            fullWidth
          />

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
              <img
                style={{ width: "100%" }}
                src={uploadedFile.filePath}
                alt=''
              />
            </div>
          </div>
        ) : null} */
}
