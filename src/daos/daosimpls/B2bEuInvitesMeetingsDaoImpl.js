/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const einMeetings = require('../../schemas/B2BEuInvitesMeetings');
const { uType, mstatus } = require('../../consts/B2bEuInvitesConsts.json');
const cs = require('../../services/CommonSrvc');

const b2bInvMeetingsData = (reqBody, tData) => {
  const data = setB2bInvMeetingsData(reqBody, tData);
  return new einMeetings(data);
}

const usrMtByStsQry = (invite, reqBody, b2b) => {
  return {delFlag: false, b2b, invite, mStatus: reqBody.status, type: reqBody.type};
}

const usrMtQry = (_id, b2b) => {
  return {delFlag: false, _id, b2b};
}

const setMtRscData = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  return setMtCommonData(reqBody, tData, curUtc);
}

const setMtStatus = (tData, reqBody) => {
  const curUtc = cs.currUTCObj();
  return {
    mStatus: reqBody.mStatus,
    mNotes: reqBody.mNotes,
    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  }
}

module.exports = {
  b2bInvMeetingsData, usrMtByStsQry, usrMtQry, setMtRscData, setMtStatus
}

const setB2bInvMeetingsData = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  const cData = setMtCommonData(reqBody, tData, curUtc);
  return {
    _id: uuidv4(),

    idSeq: {
      seq: curUtc.currUTCYear + curUtc.currUTCMnt + curUtc.currUTCDay,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMnt,
      day: curUtc.currUTCDay
    },

    invite: reqBody.invite,
    invUserId: tData.bc + ':' + reqBody.userId,
    invUserPrimary: tData.bc + ':' + reqBody.email,

    b2b: tData.b2b,
    b2bName: tData.bn,
    b2bCode: tData.bc,

    org: tData.org,
    orgName: tData.on,
    orgCode: tData.oc,
    // obId: tData.bc,
    // obName: tData.obName,
    // obCode: tData.obCode,
    // team: tData.ot,
    // tName: tData.otn,cData
    // tCode: tData.otc,

    sbUser: tData.iss,
    sbuName: tData.fn + ' ' + tData.ln,
    sbuEid: tData.eid,
    sbuMob: tData.mn,

    ...cData,
    // mobId: reqBody.mobId || '',
    // mobName: reqBody.mobName || '',
    // mobCode: reqBody.mobCode || '',
    mStatus: mstatus.sc,

    cuType: uType,
    cUser: tData.iss,
    cuName: tData.fn + ' ' + tData.ln,
    cDate: curUtc.currUTCDtTm,
    cDtStr: curUtc.currUTCDtTmStr
  };
}

const setMtCommonData = (reqBody, tData, curUtc) => {
  const mDrx = reqBody.mDrx ? {mDrx: reqBody.mDrx} : {};
  return {
    swc: reqBody.scName,
    scMobCcNum: reqBody.scMob || '',

    mType: reqBody.mType,
    msub: reqBody.msub,
    mpCc: reqBody.mpCc || '',
    mpNum: reqBody.mpNum || '',
    mpCcNum: reqBody.mpNum ? reqBody.mpCc + ' ' + reqBody.mpNum : '',
    mpExt: reqBody.mpExt || '',
    mLink: reqBody.mLink || '',
    mobAdrs: reqBody.mobAdrs || '',

    mbrIds: reqBody.mbrIds,
    mbrNames: reqBody.mbrNames,
    members: reqBody.members,
    msDtTm: new Date(reqBody.msTm),
    msDtTmStr: reqBody.msTm,
    meDtTm: reqBody.meTm ? new Date(reqBody.meTm) : '',
    meDtTmStr: reqBody.meTm || '',
    ...mDrx,
    mTz: reqBody.mTz,

    mDesc:  reqBody.mDesc,
    mNotes: reqBody.mNotes || '',
    type: reqBody.type,

    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  };
}
