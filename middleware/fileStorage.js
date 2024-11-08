const multer = require( "multer" );

const docStorage = multer.diskStorage( {
  destination: "public/documents",
  filename: ( req, file, cb ) =>
  {
    const uniqueSuffix = Date.now() + "-" + Math.round( Math.random() * 1e9 );
    cb( null, file.fieldname + '-' + uniqueSuffix + file.originalname );
  }
} );

const profileStorage = multer.diskStorage( {
  destination: "public/vendor",
  filename: ( req, file, cb ) =>
  {
    const uniqueSuffix = Date.now() + "-" + Math.round( Math.random() * 1e9 );
    cb( null, file.fieldname + '-' + uniqueSuffix + file.originalname );
  }
} );

const itemsStorage = multer.diskStorage( {
  destination: "public/images",
  filename: ( req, file, cb ) =>
  {
    const uniqueSuffix = Date.now() + "-" + Math.round( Math.random() * 1e9 );
    cb( null, file.fieldname + '-' + uniqueSuffix + file.originalname );
  }
} );

const fileFilter = (req, file, cb) => {
  // Allow only certain file types, e.g., images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const docFilter = (req, file, cb) => {
  // Allowed mime types
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif','image/webp', // images
    'application/pdf', // PDF
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image and document files are allowed!'), false);
  }
};

const uploadDocs = multer({
  storage:docStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: docFilter
} );

const uploadProfile = multer( {
  storage: profileStorage,
  limits: { fileSize: 1024 * 1024 * 5 },// 5MB limit
  fileFilter
} );

const uploadProduct = multer( {
  storage: itemsStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter
} );

module.exports = {
  uploadDocs: uploadDocs.fields( [
    { name: "proof_id", maxCount: 1 },
    { name: "biz_cert", maxCount: 1 },
    { name: "mermat", maxCount: 1 },
    { name: "status", maxCount: 1 },
    { name: "principal_image", maxCount: 1 },
    { name: "proof_address", maxCount: 1 },
    { name: "others", maxCount: 3 },
  ] ),
  uploadProfile: uploadProfile.fields( [
    { name: "dp", maxCount: 1 },
    {name:"banner",maxCount:1}
  ] ),
  uploadProduct: uploadProduct.array("items",5)
}