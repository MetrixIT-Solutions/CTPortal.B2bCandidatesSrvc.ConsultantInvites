/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const B2BEuInvitesEds = require('../schemas/B2BEuInvitesEds');

const updateB2bInvtEdcn = (query, updateObj, callback) => {
  B2BEuInvitesEds.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2BEuInvitesEdsDaos.js, at updateB2bInvtEdcn:' + error);
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
    logger.error('Un-known Error in daos/B2BEuInvitesEdsDaos.js, at commonCreateFunc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const deleteB2bInvtEdc = (query, callback) => {
  B2BEuInvitesEds.deleteOne(query).then((resObj) => {
    if (resObj && resObj.deletedCount > 0) {
      const result = SetRes.successRes('Deleted Successfully');
      callback(result);
    } else {
      const uf = SetRes.deleteFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2BEuInvitesEdsDaos.js, at deleteB2bInvtEdc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

module.exports = {
  updateB2bInvtEdcn, commonCreateFunc, deleteB2bInvtEdc
};