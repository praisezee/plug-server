const express = require( "express" );
const { createUser } = require( "../controllers/authController" );
const router = express.Router();


router.post( "/personal", createUser );
router.post( "/business", createUser );


module.exports = router;