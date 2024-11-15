const { PrismaClient, Prisma } = require( "@prisma/client" );
const randomString = require("crypto-random-string");
const { sendErrorResponse, sendSuccessResponse } = require( "../utils/responseHelper" );
const loadTemplate = require( "../utils/htmlLoader" );
const { sendMail } = require( "../utils/mailHelper" );

const prisma = new PrismaClient();

const verifyCode = async (req,res) => {
  const { email, code } = req.body;
  if ( !email || !code ) return sendErrorResponse( res, 400, "Required field missing", { email, code } );
  try {
    const user = await prisma.user.findUniqueOrThrow( { where: { email } } );
    if ( user.otp !== parseInt( code ) ) return sendErrorResponse( res, 401, "Invalid code" );
    await prisma.user.update( {
      where: { email, otp: parseInt( code ) },
      data: {
        otp: null,
        isVerified:true
      }
    } )
    return sendSuccessResponse( res, 200, "User verified successfull" );
  } catch (error) {
    console.error( error );
    if ( error instanceof Prisma.PrismaClientKnownRequestError ) {
      if ( error.code === "P2025" ) return sendErrorResponse( res, 404, "User does not exist", error );
    }
    return sendErrorResponse(res,500,"Internal server error",error)
  }
}

const resendOtp = async ( req, res ) =>
{
  const { email } = req.query;
  if ( !email ) return sendErrorResponse( res, "Email is required", 400 );
  try {
    const user = await prisma.user.findUniqueOrThrow( { where: { email } } );
    if ( user.isVerified ) return sendSuccessResponse( res, 202, "User already verified" )
    const code = randomString( { length: 6, type: "numeric" } );
    const date = new Date()
    const year = date.getFullYear()
    
    const htmlContent = loadTemplate( "Verify", { code, year } );

    await prisma.user.update( {
      where: { email },
      data: {
        otp: parseInt( code ),
      }
    } );

    await sendMail( email, "Email Verification", htmlContent );
    return sendSuccessResponse( res, 201, "OTP code has been sent" );
  } catch (error) {
    console.error( error );
    if ( error instanceof Prisma.PrismaClientKnownRequestError ) {
      if ( error.code === "P2025" ) return sendErrorResponse( res, 404, "User does not exist", error );
    }
    return sendErrorResponse(res,500,"Internal server error",error)
  }
}

module.exports ={verifyCode, resendOtp}