const express = require( "express" );
const { updateProfile, uploadImage, getKycDetails } = require( "../controllers/profileController" );
const router = express.Router();

router.route( "/" )
      .get(getKycDetails)
      .patch( updateProfile )
      .put( uploadImage )
      

module.exports = router