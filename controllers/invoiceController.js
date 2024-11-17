const { sendErrorResponse, sendSuccessResponse } = require( "../utils/responseHelper" );
const { PrismaClient, Prisma } = require( "@prisma/client" );

const prisma = new PrismaClient();


const createInvoice = async (req,res) =>{
  const { invoice_number, due_date, due_day, others, customerId, items, total, discount, tax, status, isFullfiled, notes } = req.body;
  const userId = res.user.id;
  const signature = req.file;

  if ( !invoice_number || !due_date || !customerId || !items || !total || !due_day ) return sendErrorResponse( res, 400, "Fill in required field", { invoice_number, due_date, due_day, customerId, items, total } );

  try {
    const invoice = await prisma.invoice.create( {
      invoice_number,
      userId,
      due_date,
      due_day,
      others,
      customerId,
      items,
      total:parseFloat(total),
      discount:parseFloat(discount),
      tax: parseFloat( tax ),
      status,
      isFullfiled,
      notes,
      signature: signature.path,
    } )
    
    return sendSuccessResponse( res, 201, "Invoice Created", { invoice } );
  } catch (error) {
    console.error(error);
    if ( error instanceof Prisma.PrismaClientKnownRequestError ) {
      if ( error.code === "P2002" ) return sendErrorResponse( res, 409, "Invoice already exist", { invoice_number } );
    }
    return sendErrorResponse( res, 500, "Internal server error", { error } );
  }
}