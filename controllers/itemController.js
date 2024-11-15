const { sendErrorResponse, sendSuccessResponse } = require( "../utils/responseHelper" );
const { PrismaClient, Prisma } = require( "@prisma/client" );
const fs = require("fs").promises

const prisma = new PrismaClient();

const createItem = async ( req, res ) =>
{
  const userId = res.user.id;
  const { title, category, description, group, price, quantity, hasDiscount, discount, discountType, hasVariation, unit, isPublic, variations } = req.body;
  const items = req.files;
  try {
    
    if ( !group ) {
      const exist = await prisma.group.findFirst( { where: { name: "all", userId } } );
      if ( !exist ) {
        await prisma.group.create( { data: { name: "all", userId } } );
      }
    }else{
      const exist = await prisma.group.findFirst( { where: { name: group, userId } } );
      if ( !exist ) {
        await prisma.group.create( { data: { name: group, userId } } );
      }
    }
    const item = await prisma.item.create( {
      data: {
        title,
        category,
        description,
        group: group || "all",
        price: parseFloat( price ),
        quantity: parseInt( quantity ),
        hasDiscount,
        discount: discount ? parseFloat( discount ) : 0,
        discountType,
        hasVariation,
        unit,
        isPublic,
        image:items.map(item=>item.path),
        variations: {
          create: variations.map( variation => ( {
            type: variation.type.toUpperCase(),
            variant:variation.variant,
            price: parseFloat( variation.price ),
            quantity: parseInt(variation.quantity)
          }))
        }
      },
      include: {
        variations:true
      }
    } )
    
    return sendSuccessResponse( res, 201, "Item Created", { item } );

  } catch (error) {
    console.error( error );
    sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const getItem = async ( req, res ) =>
{
  const skip = +req.query.skip || 0;
  const TAKE_NUMBER = 10;
  const userId = res.user.id;
  try {
    const count = await prisma.item.count();
    if ( count === 0 ) return sendSuccessResponse( res, 200, "No item found", { items: [],count } );
    const items = await prisma.item.findMany( {
      where: {
        userId
      },
      take: TAKE_NUMBER,
      skip:skip,
      include: {
        variations:true
      }
    } )
    return sendSuccessResponse(res,200,"Items Found",{items,count})
  } catch (error) {
    console.log( error )
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}


const getSingleItem = async ( req, res ) =>
{
  const userId = res.user.id;
  const { id } = req.params;
  if ( !id ) return sendErrorResponse( res, 400, "Product Id is required" );
  try {
    const items = await prisma.item.findFirstOrThrow( {
      where: {
        id,
        userId
      },
      include: {
        variations:true
      }
    } )
    return sendSuccessResponse(res,200,"Items Found",{items,count})
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"Item does not exist")
    }
    console.log( error )
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const deleteImage = async ( req, res ) =>
{
  const { imageIndex, itemId } = req.query;
  const userId = res.user.id;
  if ( !imageIndex || !itemId ) return sendErrorResponse( res, 400, "Image index and item id is required" );
  try {
    const item = await prisma.item.findFirstOrThrow( { where: { id: itemId, userId } } );
    const newImages = item.image.filter( img => item.image.indexOf( img ) !== imageIndex );
    const image = item.image[ imageIndex ]
    
    await prisma.item.update( {
      where: {
        userId,
        id: itemId
      }, 
      data: {
        image: newImages
      }
    } );
    await fs.unlink( image );
    return sendSuccessResponse(res,200,"Image deleted")
  } catch (error) {
    console.error( error );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"Image does not exist")
    }
    if ( error.code === "ENOENT" ) return sendSuccessResponse( res, 202, "Item image deleted" );
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};


const deleteItem = async ( req, res ) =>
{
  const userId = res.user.id;
  const { id } = req.params;
  if ( !id ) return sendErrorResponse( res, 400, "Item Id is required" );
  try {
    const item = await prisma.item.delete( { where: { userId, id } } );
    Promise.all( item.image.map( async item => ( await fs.unlink( item ) ) ) );
    return sendSuccessResponse( res, 200, "Item deleted" );
  } catch (error) {
    console.error( error );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"Image does not exist")
    }
    if ( error.code === "ENOENT" ) return sendSuccessResponse( res, 202, "Item deleted" );
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};


const editItem = async ( req, res ) =>
{
  const userId = res.user.id;
  const { id } = req.params;
  if ( !id ) return sendErrorResponse( res, 400, "Item Id is required" );
  const { title, category, description, group, price, quantity, hasDiscount, discount, discountType, hasVariation, unit, isPublic } = req.body;
  try {
    const item = await prisma.item.findFirstOrThrow( { where: { id, userId } } );
    item.title = title || item.title;
    item.category = category || item.category;
    item.description = description || item.description;
    item.group = group || item.group;
    item.price = price ? parseFloat( price ) : item.price;
    item.quantity = quantity ? parseInt( quantity ) : item.quantity;
    item.hasDiscount = hasDiscount || item.hasDiscount;
    item.discount = hasDiscount ? discount : item.discount;
    item.discountType = hasDiscount ? discountType.toUpperCase() : item.discountType;
    item.hasVariation = hasVariation || item.hasVariation;
    item.unit = unit || item.unit;
    item.isPublic = isPublic || item.isPublic;
    await prisma.item.update( { where: { id }, data: item } );
    return sendSuccessResponse( res, 200, "Item updated", {item});
  } catch (error) {
    console.log( error )
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"Item does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}

const uploadImage = async ( req, res ) =>
{
  const { id } = req.params;
  const userId = res.user.id;
  if ( !id ) return sendErrorResponse( res, 400, "Item Id is required" );
  const image =  req.files
  try {
    const item = await prisma.item.findFirstOrThrow( { where: { id, userId } } );
    if ( item.image.length + image.length > 5 ) return sendErrorResponse( res, 401, "Maximum image uploaded" );
    const images = [ ...item.image, ...image.map( ( file ) => file.path ) ];
    await prisma.item.update( {
      where: {
        id,
        userId
      },
      data: {
        image: images
      }
    } );
    return sendSuccessResponse( res, 200, "Image Updated", { images } );
  } catch (error) {
    console.log( error )
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"Item does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}

module.exports = {createItem,getItem,getSingleItem,deleteImage,deleteItem,editItem,uploadImage}