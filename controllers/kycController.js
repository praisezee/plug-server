const { sendErrorResponse, sendSuccessResponse } = require( "../utils/responseHelper" );
const { PrismaClient, Prisma } = require( "@prisma/client" );

const prisma = new PrismaClient()


const businessKyc = async ( req, res ) =>
{
  const { name, reg_type, reg_date, industry, reg_address, biz_address, biz_city, biz_state, reg_city,reg_state, reg_number, tax_number,id_type,email,directors } = req.body;
  const { proof_id, biz_cert, mermat, status, principal_image, proof_address, others } = req.files;
  if ( !name || !reg_type || !reg_date || !industry || !reg_address | !biz_address || !biz_city || !biz_state || !reg_city || !reg_state || !reg_number || !tax_number || !id_type || !email || !proof_address || !proof_id || !biz_cert || !mermat || !status || !principal_image || directors.length<1 ) return sendErrorResponse( res, 400, "Please fill all required fields" );
  try {
    const user = await prisma.user.findUniqueOrThrow( { where: { email } } );
    await prisma.businessKyc.create( {
      data: {
        userId: user.id,
        name,
        reg_type,
        reg_date,
        industry,
        reg_address,
        biz_address,
        biz_city,
        biz_state,
        reg_city,
        reg_state,
        reg_number,
        tax_number,
        biz_cert: biz_cert[ 0 ].path,
        mermat_doc: mermat[ 0 ].path,
        status_report: status[ 0 ].path,
        principal_image: principal_image[ 0 ].path,
        id_type: id_type.toUpperCase(),
        proof_id: proof_id[ 0 ].path,
        proof_address: proof_address[ 0 ].path,
        other_docs: others.map( item => item.path ),
        directors: {
          create: directors.map( director => ( {
            firstname: director.firstname,
            lastname: director.lastname,
            gender: director.gender.toUpperCase(),
            dob: director.dob,
            address: director.address,
            state: director.state,
            city: director.city,
            owner_share: parseInt( director.share ),
            role:director.role
          }))
        }
      }
    } )
    
    return sendSuccessResponse( res, 201, "KYC details was sent. Await confirmation" );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"User does not exist")
    }
    console.log( error )
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};

const personalKyc = async ( req, res ) =>
{
  const { firstname, lastname, gender, dob, phone_number, address, city, state, biz_address, biz_city, biz_state, id_type, id_number, id_exp, bvn,email } = req.body
  const { proof_id,proof_address,others,principal_image } = req.files;
  if ( !firstname || !lastname || !gender || !dob || !phone_number || !address || !city || !state || !biz_address || !biz_city || !biz_state || !id_type || !id_number || !id_exp || !bvn || !proof_id || !proof_address || !email || !principal_image ) return sendErrorResponse( res, 400, "Please fill all fields" );
  try {
    const user = await prisma.user.findUniqueOrThrow( { where: { email } } );

    await prisma.personalKyc.create( {
      data: {
        userId: user.id,
        firstname,
        lastname,
        gender: gender.toUpperCase(),
        dob,
        bvn: bvn,
        phone_number,
        address,
        biz_address,
        biz_city,
        biz_state,
        state,
        city,
        id_type:id_type.toUpperCase(),
        id_number,
        id_exp,
        proof_id: proof_id[ 0 ].path,
        proof_address: proof_address[ 0 ].path,
        other_docs: others.map( item => item.path ),
        principal_image:principal_image[0].path
      }
    } )
    
    return sendSuccessResponse( res, 201, "KYC details was sent. Await confirmation" );

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
      return sendErrorResponse(res,404,"User does not exist")
    }
    console.log( error )
    return sendErrorResponse( res, 500, "Internal server error", error );
  }
};


module.exports = { businessKyc, personalKyc };