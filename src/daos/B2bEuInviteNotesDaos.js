
/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvNotes = require('../schemas/B2BEuInvitesNotes');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const postEusrInvNotesCreate = (createObj, callback) => {
  createObj.save().then((resObj) => {
    if (resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const sf = SetRes.createFailed({});
      callback(sf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInviteNotesDaos.js, at postEusrInvNotesCreate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getEusrInvNotesList = (query, pgNum, callback) => {
  let resultObj = { notesCount: 0, NotesList: [] };
  bEuInvNotes.find(query).skip((pgNum - 1) * 50).limit(50).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { notesCount: resObj.length, NotesList: resObj };
      const result = SetRes.successRes(resultObj);
      callback(result);
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInviteNotesDaos.js, at getEusrInvNotesList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const getB2bEuOnBrdNtsList = (query, callback) => {
  bEuInvNotes.find(query).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInviteNotesDaos.js, at getB2bEuOnBrdNtsList:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}


const putB2bEuOnBrdNtsUpdate = (query, updateObj, callback) => {
  bEuInvNotes.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {    
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInviteNotesDaos.js, at putB2bEuOnBrdNtsUpdate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

module.exports = {
  postEusrInvNotesCreate, getEusrInvNotesList, getB2bEuOnBrdNtsList, putB2bEuOnBrdNtsUpdate
};