const { PrismaClient } = require( "@prisma/client" );
const { sendErrorResponse } = require( "../utils/responseHelper" );

const prisma = new PrismaClient()

const subdomainHandler = async( req, res, next ) =>
{
      try {
            const subdomain = req.vhost[ 0 ];
            const domain = await prisma.domain.findUnique( {
                  where: { url: `${ subdomain }.${ process.env.URL }` },
                  include: { user: true }
            } );
            if ( !domain ) {
                  return sendErrorResponse(res,404,"Subdomain not found for user",null)
            }
            res.user = domain.user;
            next();
      } catch (error) {
            console.error( error );
            return sendErrorResponse( res, 500, "error finding subdomain", error );
      }
};

module.exports={subdomainHandler}