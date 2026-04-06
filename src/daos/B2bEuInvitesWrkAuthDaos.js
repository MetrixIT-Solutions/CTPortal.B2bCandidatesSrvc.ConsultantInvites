/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const B2BEuInvitesWrkAuths = require('../schemas/B2BEuInvitesWrkAuths');

const updateB2bCnsltnWrkAuth = (query, updateObj, callback) => {
  B2BEuInvitesWrkAuths.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesWrkAuthsDaos.js, at updateB2bCnsltnWrkAuth:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const commonCreateFunc = (createObj, callback) => {
  createObj.save().then((resObj) => {
    if (resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const sf = SetRes.createFailed({});
      callback(sf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesWrkAuthsDaos.js, at commonCreateFunc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

module.exports = {
  updateB2bCnsltnWrkAuth, commonCreateFunc
};