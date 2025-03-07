const { createOrder, vehicleType, mobilityCost } = require( "../controllers/orderController" );

const router = require( "express" ).Router();



router.post( "/create", createOrder );
router.route( "/cost" )
      .get( vehicleType )
      .post(mobilityCost)

module.exports = router;