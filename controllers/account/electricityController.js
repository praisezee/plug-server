const axios = require( '../../utils/axios' );
const { sendErrorResponse, sendSuccessResponse } = require( '../../utils/responseHelper' );
const { PrismaClient, Prisma } = require( "@prisma/client" );
const argon = require( "argon2" );

const prisma = new PrismaClient();

const getProviderProduct = async ( req, res ) =>
{
  const { provider_id } = req.params;
  if ( !provider_id ) return sendErrorResponse( res, 400, "Invalid provider id", { provider_id } );
  try {
    const response = await axios.post( "/account/utilitybill/electricity/product-listings", {
      product:`electricity#${provider_id}`
    } )
    const products = response.data.datapulled
    return sendSuccessResponse( res, 200, "Products found", { products } );
  } catch (error) {
    console.error( error );
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const getDeviceName = async ( req, res ) =>
{
  const { operator, meterNo } = req.query;
  if ( !operator || !meterNo ) return sendErrorResponse( res, 400, "Enter required field", { operator, meterNo } );
  try {
    const response = await axios.post( "/account/utilitybill/electricity/devicename", {
      op: operator,
      mn:meterNo
    } )
    const name = await response.data.name;
    return sendSuccessResponse( res, 200, "Device found", { name } );
  } catch (error) {
    console.error( error );
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};


const processPayment = async ( req, res ) =>
{
  const { amount, meterNo, meterName, slug, account_id } = req.body;
  if ( !amount || !meterNo || !meterName || !slug || !account_id ) return sendErrorResponse( res, 400, "Enter required field", { amount, meterNo, meterName, slug, account_id } );
  try {
    const userId = res.user.id
    const user = await prisma.user.findUniqueOrThrow( { where: { id: userId } } );
    
    const validatePin = await argon.verify( user.pin, pin );
    if ( !validatePin ) return sendErrorResponse( res, 401, "Invalid transaction pin" );

    const response = await axios.post( "/accounts/utility/nuban/paynow", {
      a: amount,
      meter_number: meterNo,
      meter_name: meterName,
      prd_slug: slug,
      userid: account_id,
      user_type: "PLUG"
    } );

    const result = await response.data;
    const data = await result.data
    return sendSuccessResponse( res, result.message, result.status, { transaction: data } );
  } catch (error) {
    console.error( error );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"User does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};


module.exports = { getProviderProduct, getDeviceName, processPayment };