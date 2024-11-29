const { sendErrorResponse, sendSuccessResponse } = require( "../utils/responseHelper" );
const { PrismaClient, Prisma } = require( "@prisma/client" );

const prisma = new PrismaClient();

const createVariation = async ( req, res ) =>
{
  const { itemId, type, variant, price, quantity } = req.body;
  if ( !itemId || !type || !variant || !price || !quantity ) return sendErrorResponse( res, 400, "Please fill all required fields" );
  if ( !res.user.id ) return sendErrorResponse( res, 400, "Please Login" );
  try {
    const variation = await prisma.variation.create( {
      data: {
        itemId,
        type: type.toUpperCase(),
        variant,
        price: parseFloat( price ),
        quantity: parseInt( quantity ),
      }
    } )
    
    return sendSuccessResponse( res, 201, "Variation added", { variation } );
  } catch (error) {
    console.log( error )
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"Item does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const getVariations = async ( req, res ) =>
{
  const { itemId } = req.query;
  if ( !itemId ) return sendErrorResponse( res, 400, "Item id is missing" );
  try {
    const variations = await prisma.variation.findMany( {
      where: {
        itemId
      }
    } )
    
    return sendSuccessResponse(res,200,"Variations found",{variations})
  } catch (error) {
    console.log( error )
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}

const editVariation = async ( req, res ) =>
{
  const { type, variant, price, quantity } = req.body;
  const { id } = req.params;

  try {
    const variation = await prisma.variation.findUniqueOrThrow( {
      where:{id}
    } )
    
    variation.type = type.toUpperCase() || variation.type;
    variation.variant = variant || variation.variant;
    variation.price = parseFloat( price ) || variation.price;
    variation.quantity = parseInt( quantity ) || variation.quantity;

    await prisma.variation.update( {
      where: { id },
      data: variation
    } )
    
    return sendSuccessResponse( res, 200, "Variant updated", { variation } );
  } catch (error) {
    console.log( error )
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"Item does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}

const deleteVariation = async ( req, res ) =>
{
  const { id } = req.params;
  try {
    await prisma.variation.delete( {
      where:{id}
    } )
    return sendSuccessResponse( res, 202, "Variation deleted" );
  } catch (error) {
    console.log( error )
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"Item does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}


module.exports = { deleteVariation, editVariation, getVariations, createVariation };