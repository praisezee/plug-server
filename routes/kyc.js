const express = require( "express" );
const { personalKyc, businessKyc } = require( "../controllers/kycController" );
const router = express.Router();


router.post( "/personal", personalKyc );
router.post( "/business", businessKyc );


module.exports = router;