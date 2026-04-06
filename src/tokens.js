/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

var config = require('config');
var jwt = require('jsonwebtoken');
var moment = require('moment');

var logger = require('./lib/logger');
const {utApp, utech, utm, sa} = require('../src/consts/B2bEuInvitesConsts.json');

'use strict';
var crypto = require('crypto');

const ENCRYPTION_KEY = config.criptoTokenKey; // process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Begin: refreshToken
 * @param {string} reqToken string
 * @param {object} res
 * @return {function} callback function
 */
const refreshToken = (reqToken, res, callback) => {
  try {
    const currentDtNum = moment().valueOf();
    const jwtToken = decrypt(reqToken, ENCRYPTION_KEY);
    const tokenData = jwt.verify(jwtToken, config.jwtSecretKey);
    const exp = moment().add(config.webSsnExpr, config.webSsnExprType).valueOf();
    if(tokenData.exp >= currentDtNum) {
      getUserSsnData(tokenData, exp, reqToken, (token, data) => {
        const newToken = token !== 'error' ? token : reqToken;
        const newTokenData = token !== 'error' ? tokenData : null;
        const isExpired = (token === 'NA');
        res.header('ctpb2batoken', newToken);
        callback({tokenData: newTokenData, isExpired, ctpb2batoken: newToken, data});
      });
    } else {
      res.header('ctpb2batoken', reqToken);
      callback({tokenData, isExpired: true, ctpb2batoken: reqToken});
    }
  } catch(error) {
    logger.error('src/tokens.js - refreshToken: Un-Known Error: ' + error);
    res.header('ctpb2batoken', reqToken);
    callback(null);
  }
}
// --- End: refreshToken

// --- Begin: userTokenDecode
const userTokenDecode = (reqToken) => {
  try {
    const currentDtNum = moment().valueOf();
    const jwtToken = decrypt(reqToken, ENCRYPTION_KEY);
    const tokenData = jwt.decode(jwtToken, config.jwtSecretKey);
    if(tokenData.exp >= currentDtNum) {
      return {tokenData, isExpired: false};
    } else {
      return {tokenData, isExpired: true};
    }
  } catch(error) {
    logger.error('src/tokens.js - userTokenDecode: Un-Known Error: ' + error);
    return null;
  }
}
// --- End: userTokenDecode

/**
 * @param {string} text string
 * @param {string} encryptKey string
 * @return {string}
 */
const encrypt = (text, encryptKey) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptKey), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * @param {string} text string
 * @param {string} decryptKey string
 * @return {string}
 */
const decrypt = (text, decryptKey) => {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(decryptKey), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = {
  refreshToken, userTokenDecode, decrypt, encrypt
};

const getUserSsnData = (tokenData, exp, reqToken, callback) => {
  const {getB2bUserSsn} = require('./B2bUserAuthSrvc');
  getB2bUserSsn(tokenData, (err, resObj) => {
    if (resObj?.status == '200') {
      b2bSssnData(tokenData, exp, reqToken, resObj?.resData?.result, callback);
    } else if(err && err.response && err.response?.data?.status == '204') {
      callback('NA', {});
    } else {
      logger.error('src/tokens.js - getUserSsnData: ' + JSON.stringify(resObj));
      callback('error', {});
    }
  });
}
const b2bSssnData = (tokenData, exp, reqToken, userObj, callback) => {
  // const sep = moment().add(2, 'minutes').valueOf();
  const payload = { ...tokenData, exp };

  const jwtNewToken = jwt.sign(payload, config.jwtSecretKey);
  const token = encrypt(jwtNewToken, ENCRYPTION_KEY);
  if(tokenData.ut === utApp || tokenData.ut === utech || (tokenData.ut == utm && tokenData.ur === sa)) {
    callback(token, {...userObj, rolesObj: null});
  } else {
    b2bRolesData(reqToken, rolesObj => {
      callback(token, {...userObj, rolesObj});
    });
  }
}
const b2bRolesData = (reqToken, callback) => {
  const {getB2BUserRlsAcsRoleUser} = require('./B2bUserAuthSrvc');
  getB2BUserRlsAcsRoleUser(reqToken, (err, resObj) => {
    if (resObj?.status == '200') {
      callback(resObj.resData.result);
    } else if(resObj?.status == '204') {
      callback({});
    } else {
      logger.error('src/tokens.js - b2bRolesData: ' + JSON.stringify(resObj));
      callback({});
    }
  });
}
