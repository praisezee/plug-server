const {axios} = require( '../../utils/axios' );
const { sendErrorResponse, sendSuccessResponse } = require( '../../utils/responseHelper' );
const { PrismaClient, Prisma } = require( "@prisma/client" );
const argon = require( "argon2" );

const prisma = new PrismaClient();


const getProductListing = async ( req, res ) =>
{
  const { name, id } = req.query;
  if ( !name || !id ) return sendErrorResponse( res, 400, "product name and id is required", { name, id } );
  try {
    const response = await axios.post( "/accounts/airtime-data/data/telcos-product-listings", {
      product: `${ name }__${ id }`
    } );
    const result = await response.data.collection
    return sendSuccessResponse( res, 200, "Product found", { product: result } );
  } catch (error) {
    console.error( error );
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const processPayment = async ( req, res ) =>
{
  const { amount, phone_number, productId, operator_name, provider, account_id,pin } = req.body;
  if ( !amount || !phone_number || !productId || !operator_name || !provider || !account_id || !pin ) return sendErrorResponse( res, 400, "Enter the required field", { amount, phone_number, productId, operator_name, provider, account_id } );
  try {
    const userId = res.user.id
    const user = await prisma.user.findUniqueOrThrow( { where: { id: userId } } );
    
    const validatePin = await argon.verify( user.pin, pin );
    if ( !validatePin ) return sendErrorResponse( res, 401, "Invalid transaction pin" );

    const response = await axios.post()


  } catch (error) {
    console.error( error );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"User does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};


module.exports = { getProductListing, processPayment };