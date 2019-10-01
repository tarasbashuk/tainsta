const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path')

const config = require('config')
const accessKeyId = config.get('accessKeyId')
const secretAccessKey = config.get('secretAccessKey')

// Init S3 storage

const s3 = new aws.S3({
 accessKeyId,
 secretAccessKey,
 Bucket: "huinsta"
})

// Inin single upload

const upload = multer({
	storage: multerS3({
		s3,
		bucket: 'huinsta',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
		}
	}),
	limits:{ fileSize: 5000000 },
	fileFilter: function( req, file, cb ){
		checkFileType( file, cb );
	}
}).single('profileImage');

// Check File filter

function checkFileType( file, cb ){
	const filetypes = /jpeg|jpg|png|gif/
	const extname = filetypes.test( path.extname( file.originalname ).toLowerCase())
  const mimetype = filetypes.test( file.mimetype )
  
	if( mimetype && extname ){
		return cb( null, true )
	} else {
		cb( 'Error: Images Only!' )
	}
}

module.exports = upload;