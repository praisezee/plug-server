const { createItem, getItem, deleteImage, getSingleItem, deleteItem, editItem, uploadImage } = require( "../controllers/itemController" );

const router = require( "express" ).Router();



router.route( "/" )
      .post( createItem )
      .get( getItem )
      .delete( deleteImage );

router.route( "/:id" )
      .get( getSingleItem )
      .delete( deleteItem )
      .put( editItem )
      .patch(uploadImage)


module.exports = router;