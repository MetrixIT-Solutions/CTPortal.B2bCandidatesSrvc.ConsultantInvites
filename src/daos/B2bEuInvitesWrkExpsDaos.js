/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const B2BEuInvitesWrkExps = require('../schemas/B2BEuInvitesWrkExps');

const setB2bUpdateInvtWrkExp = (query, updateObj, callback) => {
  B2BEuInvitesWrkExps.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesWrkExpsDaos.js, at setB2bUpdateInvtWrkExp:' + error);
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
    logger.error('Un-known Error in daos/B2bEuInvitesWrkExpsDaos.js, at commonCreateFunc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

module.exports = {
  setB2bUpdateInvtWrkExp, commonCreateFunc
};