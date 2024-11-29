const { createVariation, getVariations, editVariation, deleteVariation } = require( "../controllers/variationController" );

const router = require( "express" ).Router();


router.route( '/' )
      .post( createVariation )
      .get( getVariations );
      
router.route( '/:id' )
      .patch( editVariation )
      .delete(deleteVariation);

module.exports = router