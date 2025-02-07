const mainAccount = require( "../controllers/account/mainAccountController" );
const nubanAccount = require( "../controllers/account/nubanAccountController" );
const settlementAccount = require( "../controllers/account/settlementAccountContller" );

const router = require( "express" ).Router();

router.get( '/deposit', mainAccount.getTransactions );
router.get( '/deposit/:id', mainAccount.getSingleTransaction );
router.get( "/nuban", nubanAccount.getTransactions );
router.get( "/nuban/:id", nubanAccount.getSingleTransaction );
router.get( "/settlement", settlementAccount.getTransactions );
router.get( "/settlement/:id", settlementAccount.getSingleTransaction );


module.exports = router;