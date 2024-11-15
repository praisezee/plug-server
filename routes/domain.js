const { checkDomain } = require( "../controllers/urlController" );

const router = require( "express" ).Router();


router.get( '/', checkDomain );


module.exports = router