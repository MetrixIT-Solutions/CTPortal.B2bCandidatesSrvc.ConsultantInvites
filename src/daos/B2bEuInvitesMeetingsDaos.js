
/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvMeetings = require('../schemas/B2BEuInvitesMeetings');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const postEusInvrMeetingsCreate = (createObj, callback) => {
  createObj.save().then((resObj) => {
    if (resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const sf = SetRes.createFailed({});
      callback(sf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesMeetingsDaos.js, at postEusInvrMeetingsCreate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const postEusrInvInvMeetingsList = (query, pgNum, callback) => {
  let resultObj = { mtCount: 0, mtLIst: [] };
  bEuInvMeetings.find(query).skip((pgNum - 1) * 50).limit(50).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { mtCount: resObj.length, mtLIst: resObj };
      const result = SetRes.successRes(resultObj);
      callback(result);
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesMeetingsDaos.js, at postEusrInvInvMeetingsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const updateEuInMeetings = (query, updObj, callback) => {
  bEuInvMeetings.findOneAndUpdate(query, {$set: updObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.updateFailed({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesMeetingsDaos.js, at updateEuInMeetings:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

module.exports = {
  postEusInvrMeetingsCreate, postEusrInvInvMeetingsList, updateEuInMeetings
};