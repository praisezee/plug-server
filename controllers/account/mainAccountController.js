const { generateRefrence, saveCounterpartyMain, processTransactionMain } = require( '../../utils/accouthelp' );
const {axios} = require( '../../utils/axios' );
const { sendErrorResponse, sendSuccessResponse } = require( '../../utils/responseHelper' );
const { PrismaClient, Prisma } = require( "@prisma/client" );
const argon = require( "argon2" );



const prisma = new PrismaClient();

const getTransactions = async ( req, res ) =>
{
  const { account_id,page_no } = req.query;
  if ( !account_id ) return sendErrorResponse( res, 400, "User account Id is required" );
  try {
    const response = await axios.post( "/account/deposit/transaction", {
      user_id: account_id,
      user_type: "PLUG",
      pagination_num:page_no || null,
      get_all: true
    } );
    const result = await response.data
    const transactions = result.trxn;
    return sendSuccessResponse( res, 200, "Transactions fetched", { transactions } );
  } catch (error) {
    console.error( error );
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const getSingleTransaction = async ( req, res ) =>
{
  const { id } = req.params;
  if ( !id ) return sendErrorResponse( res, 400, "Transaction Id is required" );
  try {
    const response = await axios.get( `/deposit/transaction/details/${ id }` );
    const result = await response.data
    const transaction = result.trxn;
    return sendSuccessResponse( res, 200, "Transactions fetched", { transaction } );
  } catch (error) {
    console.error( error );
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const fetchUserDetails = async ( req, res ) =>
{
  const { account_id, recipient } = req.query;
  if ( !account_id || !recipient ) return sendErrorResponse( res, 400, "User account Id and recipient is required", { account_id, recipient } );
  try {
    const response = await axios.post( `/book/transfer/account/verify`, {
      acc: recipient,
      userid: account_id,
      user_type:"PLUG"
    });
    const result = await response.data
    return sendSuccessResponse( res, 200, "Recipient Found", { recipient:result } );
  } catch (error) {
    console.error( error );
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}

const bookTransfer = async ( req, res ) =>
{
  const { account_id, amount, recipient, recipientId, name, narration, pin } = req.body
  const userId = res.user.id
  if ( !account_id || !amount || !recipient || !recipientId || !name || !pin ) return sendErrorResponse( res, 400, "Enter the neccesary field", { account_id, amount, recipient, recipientId, name, pin } );
  try {
    const user = await prisma.user.findUniqueOrThrow( { where: { id: userId } } );

    const validatePin = await argon.verify( user.pin, pin );
    if ( !validatePin ) return sendErrorResponse( res, 401, "Invalid transaction pin" );

    const reference = generateRefrence()

    const response = await axios.post( "/book/deposit/transfer/confirmtoken", {
      userid: account_id,
      user_type: "PLUG",
      amount,
      //reference,
      account: recipient,
      repid: recipientId,
      name,
      narration: narration || reference
    })

    const result = await response.data;

    return sendSuccessResponse( res, 201, "Transaction is being processed", { transaction:result } );

  } catch (error) {
    console.error( error );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"User does not exist")
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}

const saveCounterParty = async(req,res) =>
{
  const { account_id, accountNumber, accountName, bank, amount, pin } = req.body;
  if ( !account_id || !accountNumber || !accountName || !bank || !amount || !pin ) return sendErrorResponse( res, 400, "Enter all necessary field", { account_id, accountNumber, accountName, bank, amount, pin } );
  const userId = res.user.id
  try {
    const user = await prisma.user.findUniqueOrThrow( { where: { id: userId } } );

    const validatePin = await argon.verify( user.pin, pin );
    if ( !validatePin ) return sendErrorResponse( res, 401, "Invalid transaction pin" );

    const data = await saveCounterpartyMain( account_id, accountNumber, accountName, bank, amount );

    return sendSuccessResponse( res, 200, "Transaction successful", { acc_info: data } );
  } catch (error) {
    console.error( error );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if ( error.code === "P2025" )
        return sendErrorResponse( res, 404, "User does not exist" );
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}


const interBankTransfer = async ( req, res ) =>
{
  const { account_id, wallet_id, narration, amount, bank_code, accountName, accountNumber } = req.body;
  
  if( !account_id || !wallet_id || !narration || !amount || !bank_code || !accountName || !accountNumber)return sendErrorResponse( res, 400, "Enter all necessary field", { account_id, wallet_id, narration, amount, bank_code, accountName, accountNumber } );

  try {
    const user = await prisma.user.findUniqueOrThrow( { where: { id: userId } } );

    const validatePin = await argon.verify( user.pin, pin );
    if ( !validatePin ) return sendErrorResponse( res, 401, "Invalid transaction pin" );

    const process = await processTransactionMain( account_id, wallet_id, narration, amount, bank_code, accountName, accountNumber );

    return sendSuccessResponse( res, 200, "Transaction successful", { transaction: process } );
  } catch (error) {
    console.error( error );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if ( error.code === "P2025" )
        return sendErrorResponse( res, 404, "User does not exist" );
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
  }


}

const setPin = async (req,res) =>{
  const {pin} = req.body;
  if(!pin) return sendErrorResponse(res,400,"User pin is required",{pin})
    try {
      const userId = res.user.id;
      const user = await prisma.user.findUniqueOrThrow( { where: { id: userId } } );
      const userPin = await argon.hash( pin )
      user.pin = userPin

      await prisma.user.update( {
        where: { id: userId }, data: {
          pin: userPin,
          isDefaultPin:false
        }
      } )
      
      return sendSuccessResponse(res,200,"Pin has been set")
    } catch (error) {
      console.error( error );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if ( error.code === "P2025" )
        return sendErrorResponse( res, 404, "User does not exist" );
    }
    return sendErrorResponse( res, 500, "Internal server error", error );
    }
}

module.exports = { getTransactions, getSingleTransaction, fetchUserDetails, bookTransfer, interBankTransfer,setPin,saveCounterParty };