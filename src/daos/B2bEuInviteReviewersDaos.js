/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const B2BReviwers = require('../schemas/B2BEuInvitesReviewers');

const postReviewCreate = (crtObj, callback) => {
  crtObj.save().then((resObj) => {    
    if (resObj && resObj._id) {
      const succ = SetRes.successRes(resObj);
      callback(succ);
    } else {
      const sf = SetRes.createFailed({});
      callback(sf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInviteReviewersDaos.js, at postReviewCreate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const updateReviewers = (uObj, callback) => {
  B2BReviwers.findOneAndUpdate(uObj.query, uObj.updateObj).then((resObj) => {
    if (resObj && resObj._id) {
      const succ = SetRes.successRes(resObj);
      callback(succ);
    } else {
      const uf = SetRes.updateFailed();
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInviteReviewersDaos.js, at updateReviewers:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getEusrInvAllreviewersList = (query, callback) => {
  B2BReviwers.find(query).then((resObj) => {
    if(resObj && resObj.length > 0) {
     const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData(resObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInviteReviewersDaos.js, at getEusrInvAllreviewersList:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

module.exports = {
  postReviewCreate, updateReviewers, getEusrInvAllreviewersList
}