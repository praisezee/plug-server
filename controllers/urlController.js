const { PrismaClient } = require( "@prisma/client" );
const { sendErrorResponse, sendSuccessResponse } = require( "../utils/responseHelper" );

const prisma = new PrismaClient();


const checkDomain = async ( req, res ) =>
{
      const { name } = req.query;
      if ( !name ) return sendErrorResponse( res, 400, "Business name is required" );
      try {
            const domain = await prisma.domain.findUnique( { where: { name } } );
            if ( domain ) return sendErrorResponse( res, 409, "Business name cant be used" );
            return sendSuccessResponse( res, 200, "Domain is available", { url: `${ name }.${ process.env.URL }` } );
      } catch (error) {
            console.error( error );
            return sendErrorResponse( res, 500, "Internal server error", error );
      }
};


module.exports ={checkDomain}