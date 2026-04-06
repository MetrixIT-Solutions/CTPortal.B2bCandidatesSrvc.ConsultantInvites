/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const cs = require('../../services/CommonSrvc');
const B2BEuInvitesReviewers = require('../../schemas/B2BEuInvitesReviewers')
const { uType } = require('../../consts/B2bEuInvitesConsts.json');

const postReviewCreate = (reqBody, tData) => {
  const obj = setReviewData(reqBody, tData);
  const data = new B2BEuInvitesReviewers(obj);
  return data;
}

const setReviewersReview = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  const query = {_id: reqBody.rvId, b2b: tData.b2b};
  const updateObj = {
    $push: {
      rvNotes: {
        _id: uuidv4(),
        notes: reqBody.review,
        cuType: uType,
        cUser: tData.iss,
        cuName: tData.fn + ' ' + tData.ln,
        cDate: curUtc.currUTCDtTm,
        cDtStr: curUtc.currUTCDtTmStr,
      }  
    },
    $set: {
      uuType: uType,
      uUser: tData.iss,
      uuName: tData.fn + ' ' + tData.ln,
      uDate: curUtc.currUTCDtTm,
      uDtStr: curUtc.currUTCDtTmStr
    }
  };
  return {query, updateObj};
}

const getAllNotesData = (uid) => {
  return {uid, delFlag: false};
}

module.exports = { postReviewCreate, setReviewersReview, getAllNotesData }

const setReviewData = (reqBody, tData) => {  
  const curUtc = cs.currUTCObj();

  return {
    _id: uuidv4(),
    idSeq: {
      seq: curUtc.currUTCYear + curUtc.currUTCMnt + curUtc.currUTCDay,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMnt,
      day: curUtc.currUTCDay
    },

    uid: reqBody.uid,
    b2b: tData.b2b,
    b2bName: tData.bn,
    b2bCode: tData.bc,

    // org: reqBody.org || '',
    // orgName: reqBody.orgName || '',
    // orgCode: reqBody.orgCode || '',
    // obId: reqBody.obId || '',
    // obName: reqBody.obName || '',
    // obCode: reqBody.obCode || '',
    // team: reqBody.team || '',
    // tName: reqBody.tName || '',
    // tCode: reqBody.tCode || '',

    users: reqBody.ids,
    uNames: reqBody.names,
    notes: reqBody.notes || '',

    cuType: uType,
    cUser: tData.iss,
    cuName: tData.fn + ' ' + tData.ln,
    cDate: curUtc.currUTCDtTm,
    cDtStr: curUtc.currUTCDtTmStr,
    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  };
}