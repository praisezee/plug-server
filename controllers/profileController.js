const { PrismaClient, Prisma } = require( "@prisma/client" );
const { sendErrorResponse, sendSuccessResponse } = require( "../utils/responseHelper" );
const fs = require( "fs" ).promises;

const prisma = new PrismaClient();

const updateProfile = async ( req, res ) =>
{
      const {  phone_number, email, biz_name, description, biz_address, biz_state, biz_city,firstname,lastname } = req.body;
      const userId = res.user.id;
      if (!userId) return sendErrorResponse(res,401,"User not logged in")
      try {
            const foundUser = await prisma.user.findUniqueOrThrow( { where: { id: userId } } );
            const kyc = foundUser.status === "NOTREGISTERED" ? await prisma.personalKyc.findFirst( { where: { userId } } ) : await prisma.businessKyc.findFirst( { where: { userId } } );
            
            if ( !kyc ) return sendErrorResponse( res, 404, "User Kyc data not found" );
            foundUser.name = biz_name || foundUser.name;
            foundUser.phone_number = phone_number || foundUser.phone_number;
            foundUser.email = email || foundUser.email;
            foundUser.description = description || foundUser.description;
            kyc.address = biz_address || kyc.biz_address;
            kyc.state = biz_state || kyc.biz_state;
            kyc.city = biz_city || kyc.biz_city;
            if ( foundUser.status === "NOTREGISTERED" ) {
                  kyc.firstname = firstname || kyc.firstname;
                  kyc.lastname = lastname || kyc.lastname;
            } else {
                  const directors = await prisma.directors.findMany( { where: { businessId: kyc.id } } );
                  if(directors){
                        const director = directors[ 0 ]
                        director.firstname = firstname || director.firstname;
                        director.lastname = lastname || director.lastname;
                        await prisma.directors.update( {
                              where: { id: director.id },
                              date:director
                        })
                  }
                  kyc.name = biz_name | kyc.name
            }

            await prisma.user.update( {
                  where: { id: userId },
                  data: foundUser
            } );

            if ( foundUser.status === "NOTREGISTERED" ) {
                  await prisma.personalKyc.update( {
                        where: { userId, id:kyc.id },
                        data:kyc
                  })
            } else {
                  await prisma.businessKyc.update( {
                        where: { userId, id:kyc.id },
                        data:kyc
                  })
            }

            const user = { ...foundUser }
            delete user.password;
            delete user.otp;
            delete user.refresh_token;
            delete user.reset_password_token;
            delete user.terms;
            delete user.pin

            return sendSuccessResponse( res, 200, "Profile Updated", { user } );

      } catch ( error ) {
            console.error(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                  if (error.code === "P2025")
                  return sendErrorResponse(res,404,"User does not exist")
            }
            return sendErrorResponse( res, 500, "Internal server error", error );
      }
};

const uploadImage = async(req,res) =>
{
      const { dp, banner } = req.files;
      const userId = res.user.id;
      if ( !userId ) return sendErrorResponse( res, 401, "User not logged in" );
      try {
            const foundUser = await prisma.user.findUniqueOrThrow( { where: { id: userId } } );
            if (dp && foundUser.dp ) {
                  await fs.unlink(foundUser.dp)
            }

            if (banner && foundUser.banner ) {
                  await fs.unlink(foundUser.banner);
            }

            foundUser.dp = dp ? dp[ 0 ].path : foundUser.dp;
            foundUser.banner = banner ? banner[ 0 ].path : foundUser.banner;

            await prisma.user.update( {
                  where: { id: userId },
                  data: foundUser
            } );

            const user = {...foundUser}
            delete user.password;
            delete user.otp;
            delete user.refresh_token;
            delete user.reset_password_token;
            delete user.terms;
            delete user.pin

            return sendSuccessResponse( res, 200, "Profile Images Updated", { user } );

      } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                  if (error.code === "P2025")
                  return sendErrorResponse(res,404,"User does not exist")
            }
            return sendErrorResponse( res, 500, "Internal server error", error );
      }
};


const getKycDetails = async ( req, res ) =>
{
      const userId = res.user.id;
      if ( !userId ) return sendErrorResponse( res, 401, "User not logged in" );
      try {
            const foundUser = await prisma.user.findUniqueOrThrow( { where: { id: userId } } );
            const kyc = foundUser.status === "NOTREGISTERED" ? await prisma.personalKyc.findFirst( { where: { userId } } ) : await prisma.businessKyc.findFirst( { where: { userId }, include: { directors: true } } );
            
            return sendSuccessResponse(res,200, "KYC found",{kyc})
      } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                  if (error.code === "P2025")
                  return sendErrorResponse(res,404,"User does not exist")
            }
            return sendErrorResponse( res, 500, "Internal server error", error );
      }
}



module.exports = { uploadImage, updateProfile,getKycDetails };