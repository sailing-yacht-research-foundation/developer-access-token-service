const jwt = require('jsonwebtoken');
const util = require('util');
const { ServiceError, statusCodes } = require('../../utils/utils');
const jwtVerifyPromised = util.promisify(jwt.verify);
const uuid = require('uuid');

const dataAccess = require('../../dataAccess/v1/auth');

const createSessionToken = async (id) =>
  await jwt.sign({ id: id, issuedAt: Date.now() }, process.env.JWT_SECRET);

const decodeAccessToken = async (token) => {
  return await jwtVerifyPromised(token, process.env.JWT_SECRET);
};

exports.validateAccessToken = async (token) => {
  let accessData = null;
  try {
    accessData = await decodeAccessToken(token);
  } catch (err) {}

  if (!accessData?.email)
    throw new ServiceError('Invalid Token', statusCodes.UNAUTHORIZED);

  let profileData = await dataAccess.getByEmail(accessData.email);
  if (!profileData) {
    profileData = {
      id: uuid.v4(),
      email: accessData.email,
    };
  }

  profileData.name = accessData.name;

  let result = await dataAccess.upsert(profileData);

  let sessionToken = await createSessionToken(result.id);

  return { token: sessionToken, ...result };
};

const decodeSessionToken = async (token) => {
  try {
    const decoded = await jwtVerifyPromised(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new ServiceError('invalid token', statusCodes.UNAUTHORIZED);
  }
};

exports.decodeSessionToken = decodeSessionToken;

exports.validateSessionToken = async (token, renew = false) => {
  let decoded = await decodeSessionToken(token);

  let userProfile = null;
  let result = null;

  if (
    !process.env.TOKEN_EXPIRE ||
    Date.now() - decoded.issuedAt < parseInt(process.env.TOKEN_EXPIRE)
  )
    userProfile = await dataAccess.getById(decoded.id);
  else throw new ServiceError('token expired', statusCodes.UNAUTHORIZED);

  if (userProfile) {
    if (renew) {
      let newtoken = await createSessionToken(decoded.id);
      result = {
        ...userProfile,
        newToken: newtoken,
      };
    } else {
      result = userProfile;
    }
  } else {
    throw new ServiceError('session not found', statusCodes.UNAUTHORIZED);
  }

  return result;
};
