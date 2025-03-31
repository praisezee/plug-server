const { createOrder, vehicleType, mobilityCost, confirmPickupToken } = require( "../controllers/orderController" );

const router = require( "express" ).Router();



router.post( "/create", createOrder );
router.route( "/cost" )
      .get( vehicleType )
      .post( mobilityCost );

router.post("/pickup", confirmPickupToken)

module.exports = router;