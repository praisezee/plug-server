const { createInvoice, getInvoices, getSingleInvoice, editInvoiceStatus } = require( "../controllers/invoiceController" );

const router = require( "express" ).Router();


router.route( '/' )
      .post( createInvoice )
      .get( getInvoices )
      

router.route( '/:id' )
      .get( getSingleInvoice )
      .patch(editInvoiceStatus)

module.exports = router