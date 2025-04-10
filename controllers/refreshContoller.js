const { PrismaClient,Prisma } = require( '@prisma/client' );
const jwt = require( "jsonwebtoken" );
const { sendSuccessResponse, sendErrorResponse } = require( '../utils/responseHelper' );
const { getMainAccount, getSettlementAccount, getNubanAccount } = require( '../utils/accouthelp' );

const prisma = new PrismaClient();

const refresh = async ( req, res ) =>
{
      try {
            const cookies = req.cookies;
            if ( !cookies?.refreshToken ) return res.sendStatus( 401 );
            const oldRefresh = cookies.refreshToken;
            let mainAccount,settlementAccount,nubanAccount,user;

            const foundUser = await prisma.user.findFirstOrThrow( {
                  where: {
                        refresh_token: {
                              has:oldRefresh
                        }
                  }
            })
            

            jwt.verify( oldRefresh, process.env.REFRESH_TOKEN, async ( err, decoded ) =>
            {
                  if ( err || foundUser.email !== decoded.email ) return res.status( 403 );
                  // Creation of new refresh and access token
                  const refreshToken = jwt.sign( {
                        email: foundUser.email,
                        id: foundUser.id,
                        name: foundUser.name
                        }, process.env.REFRESH_TOKEN, {
                        expiresIn: '30d'
                  } )

                  const accessToken = jwt.sign( {
                        email: foundUser.email,
                        id: foundUser.id,
                        name: foundUser.name
                        }, process.env.ACCESS_TOKEN, {
                        expiresIn: '3h'
                  } )

                  //removal of previous refresh token from the database
                  const token = foundUser.refresh_token.filter( refresh => refresh !== oldRefresh )
                  foundUser.refresh_token = [ ...token, refreshToken ]
                  
                  await prisma.user.update( { where: { email: foundUser.email }, data: foundUser } )

                  user = { ...foundUser, accessToken }
                  /**
     * @dev This block checks to see if the users is approved and the wallet account has been created. Replace the number 3 to foundUser.account_id
     */
                  if ( foundUser.isApproved && foundUser.account_id ) {
                        mainAccount = await getMainAccount( /*foundUser.account_id ||*/ 3 );
                        settlementAccount = await getSettlementAccount( /*foundUser.account_id ||*/ 3 );
                        nubanAccount = await getNubanAccount( /*foundUser.account_id ||*/ 3)
                        user = { ...user, mainAccount, settlementAccount, nubanAccount };
                  }
                  res.cookie( 'refreshToken', refreshToken, {
                  httpOnly: true,
                  maxAge: 30 * 24 * 60 * 60 * 1000,
                  sameSite:"None",
                  secure: true
                  } )
                  
                  delete user.password;
                  delete user.refresh_token
                  delete user.reset_password_token;
                  delete user.pin
                  delete user.otp;

                  return sendSuccessResponse(res,200,"Authenticated",{user})
            })

      } catch ( e ) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                  if (e.code === "P2025")
                  return sendErrorResponse(res,403,"Not Logged in")
            }
            return sendErrorResponse(res,500,"Internal server error", e)
      }
};


module.exports = {refresh}