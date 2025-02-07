const router = require( "express" ).Router();
const mainAccount = require( "../controllers/account/mainAccountController" );
const settlementAccount = require( "../controllers/account/settlementAccountContller" );


router.get( '/deposit', mainAccount.fetchUserDetails );
router.post( "/deposit/book-transfer", mainAccount.bookTransfer );
router.post( "/deposit/interbank-transfer", mainAccount.interBankTransfer );
router.post( "/settlement/withdraw", settlementAccount.processPayout );

module.exports = router;