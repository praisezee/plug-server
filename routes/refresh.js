const express = require( "express" );
const { refresh } = require( "../controllers/refreshContoller" );
const router = express.Router();


router.get( '/', refresh )


module.exports = router