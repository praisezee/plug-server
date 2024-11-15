const { getContacts, createCustomer, getSingleContact, editCustomer, deleteCustomer } = require( "../controllers/customerController" );

const router = require( "express" ).Router();


router.route( '/' )
      .get( getContacts )
      .post( createCustomer );

router.route( '/:id' )
      .get( getSingleContact )
      .patch( editCustomer )
      .delete( deleteCustomer );



module.exports = router;