const express = require( "express" );
const { verifyCode, resendOtp } = require( "../controllers/verifyController" );
const router = express.Router();



router.route( '/' )
      .post( verifyCode )
      .get( resendOtp );


module.exports = router;