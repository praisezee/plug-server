const { sendErrorResponse, sendSuccessResponse } = require( "../utils/responseHelper" );
const { PrismaClient, Prisma } = require( "@prisma/client" );

const prisma = new PrismaClient();


const createCustomer = async ( req, res ) =>
{
  const { type, name, biz_name, phone_number, dispatch_location, email, address, landmark, city, state } = req.body;
  if ( !name || !phone_number || !type ) return sendErrorResponse( res, 400, "Enter the required field", { name, type, phone_number } );

  if ( type.toUpperCase() === "BUSINESS" && !biz_name ) return sendErrorResponse( res, 400, "Business name is required for a business type", { name, type, biz_name, phone_number } );

  try {
    const userId = res.user.id;
    const customer = await prisma.customer.create( {
      data: {
        userId,
        type: type.toUpperCase(),
        name,
        biz_name,
        phone_number,
        dispatch_location,
        email,
        address,
        landmark,
        city,
        state
      }
    } );
    return sendSuccessResponse( res, 201, "Customer created successfully", { customer } );
  } catch ( error ) {
    console.log( error );
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const getContacts = async ( req, res ) =>
{
  try {
    const userId = res.user.id
    const customers = await prisma.customer.findMany( { where: {userId} } );
    return sendSuccessResponse( res, 200, "Found contact", { customers } );
  } catch (error) {
    console.log( error );
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const getSingleContact = async ( req, res ) =>
{
  try {
    const userId = res.user.id
    const id = req.params;
    const customer = await prisma.customer.findFirstOrThrow( { where: { id, userId } } );
    return sendSuccessResponse( res, 200, "Found contact", { customer } );
  } catch (error) {
    console.log( error );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"User does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const editCustomer = async ( req, res ) =>
{
  const id = req.params;
  const userId = res.user.id
  const { type, name, biz_name, phone_number, dispatch_location, email, address, landmark, city, state } = req.body;

  if ( !name || !phone_number || !type ) return sendErrorResponse( res, 400, "Enter the required field", { name, type, phone_number } );

  if ( type.toUpperCase() === "BUSINESS" && !biz_name ) return sendErrorResponse( res, 400, "Business name is required for a business type", { name, type, biz_name, phone_number } );
  try {
    const customer = await prisma.customer.findFirstOrThrow( { where: { id, userId } } );
    customer.type = type.toUpperCase();
    customer.name = name;
    customer.biz_name = biz_name;
    customer.phone_number = phone_number;
    customer.dispatch_location = dispatch_location;
    customer.email = email;
    customer.address = address;
    customer.landmark = landmark;
    customer.city = city;
    customer.state = state;
    await prisma.customer.update( { where: { id }, data: customer } );
    return sendSuccessResponse( res, 200, "Customer updated successfully", { customer } );
  } catch (error) {
    console.log( error );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"User does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}

const deleteCustomer = async ( req, res ) =>
{
  try {
    const userId = res.user.id;
    const id = req.params;

    await prisma.customer.delete( { where: { userId, id } } );

    return sendSuccessResponse( res, 200, "Customer deleted" );
  } catch (error) {
    console.log( error );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"User does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};


module.exports = { createCustomer, getContacts, getSingleContact, editCustomer, deleteCustomer };