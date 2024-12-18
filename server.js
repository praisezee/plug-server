require( "dotenv" ).config();
const express = require( "express" );
const cors = require( "cors" );
const cookieParser = require( "cookie-parser" );
const compression = require( "compression" );
const { PrismaClient } = require('@prisma/client');
const figlet = require( 'figlet' );
const credentials = require( "./middleware/credentials" );
const corsOption = require( "./config/corsOption" );
const { verifyJwt } = require( './middleware/auth' );
const cron = require('node-cron');
const { uploadDocs, uploadProduct, uploadSig } = require( "./middleware/fileStorage" );

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3500;

const app = express();
// Middlewares
app.use(compression({
  level: 8,
  threshold: 1024,
} ) );
app.use(credentials);
app.use( cors( corsOption ) );
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use(express.json({limit:"500mb"}));
app.use( cookieParser() );
app.use( express.static( "public" ) );



//Routes
app.get( '/', (req,res) =>
{
  res.status(301).redirect( process.env.URL );
} )

app.use( '/domain', require( "./routes/domain" ) );
app.use( '/auth', require( "./routes/auth" ) );
app.use( '/verify', require( './routes/verify' ) );
app.use( "/refresh", require( './routes/refresh' ) );
app.use( '/kyc', uploadDocs, require( './routes/kyc' ) );



app.use( verifyJwt );
app.use( '/customers', require( './routes/customer' ) );
app.use( '/items', uploadProduct, require( "./routes/item" ) );
app.use( '/invoice',uploadSig, require( "./routes/invoice" ) );
app.use( '/variation', require( "./routes/variation" ) );



app.listen( PORT, () =>
{
  figlet.text( 'Plug API 1.0', {
    font: 'Doom',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 100,
    whitespaceBreak: true,
  }, (err, asciiArt) => {
    if (err) {
      console.error(err);
      return;
    }
      console.log( asciiArt );
      console.log( `server is running on port ${ PORT }` );
  } );
} );



cron.schedule( '* * * * *', async () =>
{
  try {
    const fifteenMinutesAgo = new Date( Date.now() - 15 * 60 * 1000 );
    
    const users = await prisma.user.findMany( {
      where: {
        otp: { not: null },
        isVerified: false,
        updated_at: { lt: fifteenMinutesAgo }
      }
    } );

    const updates = users.map( ( user ) => prisma.user.update( {
      where: { id: user.id },
      data: { otp: null, isVerified: false }
    } ) );

    await Promise.all( updates );
    console.log( 'cleaned up otp' );
  } catch ( error ) {
    console.error( 'Error processing OTP expiration:', error );
  }
} );