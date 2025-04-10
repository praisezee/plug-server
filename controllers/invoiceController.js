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
      data: {
        invoice_number,
        userId,
        due_date,
        due_day:parseInt(due_day),
        others,
        customerId,
        total:parseFloat(total),
        discount:parseFloat(discount),
        tax: parseFloat( tax ),
        status,
        isFullfiled:isFullfiled === "true" ? true : false,
        notes,
        signature: signature ? signature.path: null,
        items: {
          create: JSON.parse(items).map( item => ( {
            itemId: item.itemId,
            name: item.name,
            description: item.description,
            image:item.image,
            quantity: parseInt( item.quantity ),
            price: parseFloat( item.price ),
            discount: parseFloat( item.discount ),
            tax:parseFloat(item.tax)
          }))
        }
      },
      include: {
        customer: true,
        items:true
      }
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

const getInvoices = async ( req, res ) =>
{
  const userId = res.user.id;
  try {
    const invoices = await prisma.invoice.findMany( {
      where: { userId },
      include: {
        customer: true,
        items:true
      }
    } );

    return sendSuccessResponse( res, 200, "Invoices found", { invoices } );
  } catch (error) {
    console.log( error )
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const getSingleInvoice = async ( req, res ) =>
{
  const userId = res.user.id;
  const invoiceId = req.params.id;
  if ( !invoiceId ) return sendErrorResponse( res, 400, "Invoice id is required" );
  try {
    const invoice = await prisma.invoice.findFirstOrThrow( {
      where: {
        userId,
        id: invoiceId
      },
      include: {
        customer: true,
        items:true
      }
    } );
    return sendSuccessResponse(res,200,"Invoice found",{invoice})
  } catch (error) {
    console.log( error )
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"Item does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}

const editInvoiceStatus = async ( req, res ) =>
{
  const userId = res.user.id;
  const invoiceId = req.params.id;
  if ( !invoiceId ) return sendErrorResponse( res, 400, "Invoice id is required" );
  const { payment_status, order_status } = req.body;

  try {
    const invoice = await prisma.invoice.findFirstOrThrow( {
      where: {
        userId,
        id: invoiceId
      }
    } );

    invoice.status = payment_status.toUpperCase();
    invoice.order_status = order_status.toUpperCase();

    await prisma.invoice.update( {
      where: {
        userId,
        id: invoiceId
      },
      data: invoice
    })

    return sendSuccessResponse( res, 200, "Invoice status updated", { invoice } );

  } catch (error) {
    console.log( error )
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"Item does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}


module.exports = { editInvoiceStatus, getSingleInvoice, getInvoices, createInvoice };