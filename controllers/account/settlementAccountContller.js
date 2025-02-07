const axios = require( '../../utils/axios' );
const { sendErrorResponse, sendSuccessResponse } = require( '../../utils/responseHelper' );

const getTransactions = async ( req, res ) =>
{
  const { account_id } = req.query;
  if ( !account_id ) return sendErrorResponse( res, 400, "User account Id is required" );
  try {
    const response = await axios.post( "/settlement/transaction", {
      user_id: account_id,
      user_type: "PLUG",
      get_all: true
    } );
    const result = await response.data
    console.log( result );
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
    const response = await axios.get( `/settlement/transaction/details/${ id }` );
    const result = await response.data
    console.log( result );
    const transaction = result.trxn;
    return sendSuccessResponse( res, 200, "Transactions fetched", { transaction } );
  } catch (error) {
    console.error( error );
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const processPayout = async ( req, res ) =>
{
  const { account_id, amount } = req.body;
  if ( !account_id || !amount ) return sendErrorResponse( res, 400, "User account Id and amount is required", { account_id, amount } );
  try {
    const response = await axios.post( "/settlement/payout/process", {
      user_id: account_id,
      user_type: "PLUG",
      amount
    } )
    const result = await response.data
    return sendSuccessResponse( res, 200, "Transaction in progress", { transaction: result } );
  } catch (error) {
    console.error( error );
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
}

module.exports = { getTransactions, getSingleTransaction, processPayout };