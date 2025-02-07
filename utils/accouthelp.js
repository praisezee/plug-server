const axios = require( "./axios" );
const crypto = require("crypto")

const getMainAccount = async (accountId = 3) =>
{
  try {
    const response = await axios.post( '/account/deposit/data', { user_id: accountId, user_type: "PLUG" } );
    const result = await response.data;
    return result
  } catch (error) {
    throw error
  }
};

const getSettlementAccount = async ( accountId =3 ) =>
{
  try {
    const response = await axios.post( '/settlement/balance', { user_id: accountId, user_type: "PLUG" } );
    const result = await response.data;
    return result
  } catch (error) {
    throw error
  }
}


const getNubanAccount = async ( accountId = 3 ) =>
{
  try {
    const response = await axios.post( '/account/nuban/data', { user_id: accountId, user_type: "PLUG" } );
    const result = await response.data;
    return result
  } catch (error) {
    throw error
  }
}

const generateRefrence = () =>
{
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const prefix = "ref-plug";
  let result = ""
  const bytes = crypto.randomBytes( 16 )
  for ( let i = 0; i <= 16; i++ ){
    result += chars[bytes[i]%chars.length]
  }

  return `${prefix}${result}`
}

const saveCounterpartyMain = async (accountId,accountNumber,accountName,bank,amount) =>
{
  try {
    const response = await axios.post( "/account/nip/transfer/confirm", {
      userid: accountId,
      user_type: "PLUG",
      a: accountNumber,
      n: accountName,
      b: bank,
      m: amount
    } )
    
    const result = await response.data.DisplayConfirmation
    return result
  } catch (error) {
    throw error
  }
}

const processTransactionMain = async (accountId,walletId,narration,amount,bankCode,name,account) =>
{
  try {
    const reference = generateRefrence()
    const response = await axios.post( "/interbank/deposit/transfer/confirmtoken", {
      userid: accountId,
      user_type: "PLUG",
      r_wallet_id: walletId,
      narration: narration || reference,
      amount,
      bank: bankCode,
      name,
      //reference,
      account
    } )
    const result = await response.data;
    return result;
  } catch (error) {
    throw error
  }
}


module.exports = {getMainAccount,getSettlementAccount,getNubanAccount,generateRefrence,saveCounterpartyMain,processTransactionMain}