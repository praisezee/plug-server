const { createInvoice, getInvoices, getSingleInvoice, editInvoiceStatus } = require( "../controllers/invoiceController" );
const generateInvoice = require("../utils/generateInvoiceNumber")

const router = require( "express" ).Router();


router.route( '/' )
      .post( createInvoice )
      .get( getInvoices )
      

router.get("/generate",generateInvoice)

router.route( '/:id' )
      .get( getSingleInvoice )
      .patch(editInvoiceStatus)

module.exports = router