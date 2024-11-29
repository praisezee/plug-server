const { PrismaClient,Prisma } = require( "@prisma/client" );
const argon = require( "argon2" );
const jwt = require( "jsonwebtoken" );
const randomString = require("crypto-random-string");
const { sendErrorResponse, sendSuccessResponse } = require( "../utils/responseHelper" );
const { sanitizeSubdomain } = require( "../utils/sanitizedomain" );
const { sendMail } = require( "../utils/mailHelper" );
const loadTemplate = require( "../utils/htmlLoader" );

const prisma = new PrismaClient();


const createUser = async ( req, res ) =>
{
  const { name, phone_number, email, status, password, terms } = req.body;
  if ( !name || !phone_number || !email || !status || !password || !terms ) return sendErrorResponse( res, 400, "All field is required", { name, phone_number, email, status, password, terms } );

  const sanitizeDomain = sanitizeSubdomain( name );
  try {
    const eistingDomain = await prisma.domain.findUnique( { where: { url: `${ sanitizeDomain }.${ process.env.URL }` } } );
    if ( eistingDomain ) return sendErrorResponse( res, 401, "Domain already exist", { business_name: name } );

    const code = randomString( { length: 6, type: "numeric" } );
    const date = new Date()
    const year = date.getFullYear()

    const hashedPassword = await argon.hash( password );
    const htmlContent = loadTemplate("Registration",{code,year})

    const user = await prisma.user.create( {
      data: {
        name,
        email,
        phone_number,
        password: hashedPassword,
        status: status.toUpperCase(),
        terms,
        otp:parseInt(code),
        domain: {
          create: {
            url: `${ sanitizeDomain }.${ process.env.URL }`,
          }
        }
      },
      include: { domain: true },
    } )

    await sendMail(email,"Email Verification",htmlContent)
    return sendSuccessResponse( res, 201, "User registration was successful", { user } );
  } catch ( error ) {
    console.error(error);
    if ( error instanceof Prisma.PrismaClientKnownRequestError ) {
      if ( error.code === "P2002" ) return sendErrorResponse( res, 409, "Email already exist", { email } );
    }
    return sendErrorResponse( res, 500, "Internal server error", { error } );
  }
};

const loginUser = async ( req, res ) =>
{
  const { email, password } = req.body;
  if ( !email || !password ) return res.status( 400 ).json( { message: "Enter all feilds" } );
  try {
    const foundUser = await prisma.user.findUniqueOrThrow( { where: { email } } );
    const validatePassword = await argon.verify( foundUser.password, password );

    if ( !validatePassword ) return res.status( 401 ).json( { message: "Invalid credentials" } );

    const accessToken = jwt.sign(
      {
        email: foundUser.email,
        id: foundUser.id,
        name: foundUser.name
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "3h",
      }
    );
    const refreshToken = jwt.sign(
      {
        email: foundUser.email,
        id: foundUser.id,
        name: foundUser.name
      },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "30d",
      }
    );

    await prisma.user.update( {
      where: { email: foundUser.email },
      data: {
        refresh_token: [ refreshToken, ...foundUser.refresh_token ]
      }
    } );
    const user = { ...foundUser, accessToken }
    delete user.password;
    delete user.otp;
    delete user.refresh_token;
    delete user.reset_password_token;
    delete user.terms;

    res.cookies( "refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'None',
      secure: true,
    } )
    
    return sendSuccessResponse( res, 200, "Login was successful", { user } );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"User does not exist")
    }
    console.log( error )
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}


module.exports ={createUser,loginUser}