const router = require( "express" ).Router();
const electricityController = require("../controllers/account/electricityController")
const airtimeController = require("../controllers/account/airtimeController")
const dataController = require( "../controllers/account/dataController" );


router.route( '/electricity' )
      .get( electricityController.getDeviceName )
      .post( electricityController.processPayment );
router.get( "/electricity/:provider_id", electricityController.getProviderProduct );

// Data router;
router.route( "/data" )
      .get( dataController.getProductListing )
      .post( dataController.processPayment );

// Airtime route
router.route( "/airtime" )
      .get( airtimeController.getProductListing )
      .post(airtimeController.processPayment)



module.exports = router;