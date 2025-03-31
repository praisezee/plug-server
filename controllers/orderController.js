const { PrismaClient,Prisma } = require( "@prisma/client" );
const { dispatchAxios } = require( "../utils/axios" );
const { sendErrorResponse, sendSuccessResponse } = require( "../utils/responseHelper" );

const prisma = new PrismaClient()
const createOrder = async ( req, res ) =>
{
  const { Cmethod, category, distance, time, mobilityPrice, pState, pCity, pLatitude, pLongitude, pPhone, pName, pEmail, pAddress, pLandmark, pAreaone, pPlaceid, pArea, pPostalcode, pCountry, dPhone, dName, dEmail, dLongitude, dLatitude, dAddress, dLandmark, dAreaone, dPlaceid, dArea, dCity, dState, dPostalcode, dCountry } = req.body;
  const userId = res.user.id;
  if ( !userId ) return sendErrorResponse( res, 401, "User isn't logged in" );
  if ( !Cmethod || !category || !distance || !time || !mobilityPrice || !pState || !pCity || !pLatitude || !pLongitude || !pPhone || !pName || !pEmail || !pAddress || !pLandmark || !pAreaone || !pPlaceid || !pArea || !pPostalcode || !pCountry || !dPhone || !dName || !dEmail || !dLongitude || !dLatitude || !dAddress || !dLandmark || !dAreaone || !dPlaceid || !dArea || !dCity || !dState || !dPostalcode || !dCountry ) return sendErrorResponse( res, 400, "Enter required field", { Cmethod, category, distance, time, mobilityPrice, pState, pCity, pLatitude, pLongitude, pPhone, pName, pEmail, pAddress, pLandmark, pAreaone, pPlaceid, pArea, pPostalcode, pCountry, dPhone, dName, dEmail, dLongitude, dLatitude, dAddress, dLandmark, dAreaone, dPlaceid, dArea, dCity, dState, dPostalcode, dCountry } );
  try {
    const user = await prisma.user.findUniqueOrThrow( { where: { id: userId } } );
    const data = {
      user_id: user.account_id,
      user_type: "PLUG",
      sender_name: user.name,
      sender_phone: user.phone_number,
      sender_email:user.email,
      Cmethod,
      category, 
      distance, 
      time, 
      mobilityPrice, 
      pState, 
      pCity, 
      pLatitude, 
      pLongitude, 
      pPhone, 
      pName, 
      pEmail, 
      pAddress, 
      pLandmark, 
      pAreaone, 
      pPlaceid, 
      pArea, 
      pPostalcode, 
      pCountry, 
      dPhone, 
      dName, 
      dEmail, 
      dLongitude, 
      dLatitude, 
      dAddress, 
      dLandmark, 
      dAreaone, 
      dPlaceid, 
      dArea, 
      dCity, 
      dState, 
      dPostalcode, 
      dCountry
    }
    const response = await dispatchAxios.post( "/order/success", data )
    const result = await response.data;
    return sendSuccessResponse( res, 201, "Order created", { order: { ...result } } );
  } catch (error) {
    console.error( error );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"User does not exist")
    }
    return sendErrorResponse(res,500,"Internal Server Error",{error})
  }
}

const vehicleType = async ( req, res ) =>
{
  const { idname } = req.query;
  if ( !idname ) return sendErrorResponse( res, 400, "Id name required", { idname } );
  try {
    const response = await dispatchAxios.post( "/display-vehicles", { idname } );
    const result = await response.data;
    return sendSuccessResponse( res, 200, "Vehicle found", { vehicle: result } );
  } catch (error) {
    return sendErrorResponse(res,500,"Internal Server Error",{error})
  }
};

const mobilityCost = async ( req, res ) =>
{
  const { distance, time, vehicle, state } = req.body;
  if ( !distance || !time || !vehicle || !state ) return sendErrorResponse( res, 400, "All fields are required", { distance, time, vehicle, state } );
  try {
    const data = {
      d: distance,
      t: time,
      m: vehicle,
      s:state
    }
    const response = await dispatchAxios.post( "/mobility-sales-cost", data );
    const result = await response.data
    return sendSuccessResponse(res,200,"Delivery Cost",{cost:result})
  } catch (error) {
    return sendErrorResponse(res,500,"Internal Server Error",{error})
  }
};

const confirmPickupToken = async ( req, res ) =>
{
  const { confirm_token, order_no } = req.body;
  try {
    const response = await dispatchAxios.post( "/order/token-confirmation", { confirm_token, order_no } );
    const result = await response.data;
    return sendSuccessResponse( res, 200, "Delivery Cost", { confirm: result } );
  } catch (error) {
    return sendErrorResponse(res,500,"Internal Server Error",{error})
  }
}



module.exports={mobilityCost,createOrder,vehicleType,confirmPickupToken}