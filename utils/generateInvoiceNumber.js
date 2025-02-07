const { sendSuccessResponse, sendErrorResponse } = require('./responseHelper')
const generateInvoice = ( req, res ) =>
{
      try {
            const prefix = "INV";

            const timeStamp = Date.now().toString( 36 );
            const invoice_number = `${ prefix }${ timeStamp }`;

            sendSuccessResponse(res,201,"Invoice generated",{invoice_number:invoice_number.toUpperCase()})
      } catch (error) {
            sendErrorResponse(res,500,"Internal server error",{error})
      }
};

module.exports = generateInvoice

