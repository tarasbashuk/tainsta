import React, { Fragment, useState } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { setAlert } from "../../actions/alert"
import Progress from "./Progress"
import axios from "axios"
import "./AddPost.css"

const AddPost = ({ setAlert }) => {
  const [file, setFile] = useState("")
  const [fileURL, setFileURL] = useState("")
  // let [errorMsg, setErrorMsg] = useState("")
  // const [uploadedFile, setUploadedFile] = useState({})
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const [caption, setCaption] = useState("")
  let errorMsg = ''

  const onInputChange = e => {
    setCaption(e.target.value)
  }

  const validate = () => {
    let isError = false
    if (!file) {
      isError = true
      // setErrorMsg("Please choose photo!")
      errorMsg = "Please choose photo!"
    }
    if (!caption || caption === " ") {
      isError = true
      // setErrorMsg("Caption is required!")
      errorMsg = "Caption is required!"
    }

    const filetypes = /jpeg|jpg|png|gif/
    const extname = filetypes.test(file.type.toLowerCase())

    if (!extname) {
      isError = true
      // setErrorMsg("Only photo could be added!")
      errorMsg = "Only photo could be added!"
    }
    if (file.size > 2000000) {
      isError = true
      // setErrorMsg("Maximum size 2 MB")
      errorMsg = "Maximum size 2 MB"
    }
    return isError
  }

  const onChange = e => {
    setFile(e.target.files[0])
    setFileURL(URL.createObjectURL(e.target.files[0]))
  }
  const onSubmit = async e => {
    e.preventDefault()
    const err = validate()
    console.log("errorMsg", errorMsg)

    if (!err) {
      fileUpload(e)
    } else setAlert(errorMsg, "error")
  }

  const fileUpload = async e => {
    e.preventDefault()
    const data = new FormData()

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
        //TODO - add redirect
        // const { fileName, filePath } = res.data
        // setUploadedFile({ fileName, filePath })
        setAlert("File Uploaded", "succes")
      })
      .catch(err => {
        setAlert(err.message, "error")
      })
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
        <Progress percentage={uploadPercentage} />
        {fileURL ? (
          <>
            <div className='row'>
              <div className='col s6'>
                <img style={{ width: "100%" }} src={fileURL} alt='' />
              </div>
              <div className='col s6 add-caption'>
                <p className='flow-text indigo-text'>Say something about...</p>
                <div className='input-field col s12'>
                  <input
                    placeholder=''
                    name='caption'
                    type='text'
                    className='validate'
                    onChange={onInputChange}
                    value={caption}
                  />
                  <label htmlFor='caption'>{}</label>
                </div>
                <button
                  className='btn waves-effect waves-light indigo'
                  type='submit'
                  name='action'
                >
                  Upload
                  <i className='material-icons right'>send</i>
                </button>
              </div>
            </div>
          </>
        ) : null}
      </form>
    </Fragment>
  )
}

AddPost.propTypes = {
  setAlert: PropTypes.func.isRequired
}

export default connect(
  null,
  { setAlert }
)(AddPost)
