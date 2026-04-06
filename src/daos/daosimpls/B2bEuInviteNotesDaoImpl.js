/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const einNotes = require('../../schemas/B2BEuInvitesNotes');
const { uType } = require('../../consts/B2bEuInvitesConsts.json');
const cs = require('../../services/CommonSrvc');

const b2bInviteNotesData = (reqBody, tData) => {
  const data = setB2bInvNotesData(reqBody, tData);
  return new einNotes(data);
}

const usrNotesQry = (invite, b2b) => {
  return {delFlag: false, b2b, type: 'Invitations', invite, lead: null};
}

const onBrdNtsCrtObj = (reqBody, tData) => {
  const setObj = setonBrdNoteObj(reqBody, tData);  
  const data = new einNotes(setObj);
  return data;
}

const getNotesData = (reqBody, tData) => {
  return { delFlag: false, b2b: tData.b2b, type: reqBody.type, invite: reqBody.invite, lead: reqBody.lead };
}

const updateNotes = (reqBody, _id, tData) => {
  const curUtc = cs.currUTCObj();
  const query = { _id, delFlag: false, b2b: tData.b2b, type: reqBody.type, invite: reqBody.invite, lead: reqBody.lead};

  const updateNts = {
    notes: reqBody.notes,

    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  }

  return { query, updateNts };
}

module.exports = {
  b2bInviteNotesData, usrNotesQry, onBrdNtsCrtObj, getNotesData, updateNotes
}

const setB2bInvNotesData = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  return {
    _id: uuidv4(),

    idSeq: {
      seq: curUtc.currUTCYear + curUtc.currUTCMnt + curUtc.currUTCDay,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMnt,
      day: curUtc.currUTCDay
    },

    invite: reqBody.invite,
    invUserId: reqBody.userId,
    invUser: reqBody.invUser,
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
    // tName: tData.otn,
    // tCode: tData.otc,

    type: 'Invitations',
    notes: reqBody.notes,

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

const setonBrdNoteObj = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  return  {
    _id: uuidv4(),
    idSeq: {
      seq: curUtc.currUTCYear + curUtc.currUTCMnt + curUtc.currUTCDay,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMnt,
      day: curUtc.currUTCDay
    },

    invite: reqBody.invite,
    invUserId: reqBody.invUserId,
    invUser: reqBody.invUser,
    invUserPrimary: reqBody.invUserPrimary,
    lead: reqBody.lead,
    leadId: reqBody.leadId,
    b2b: tData.b2b,
    b2bName: tData.bn,
    b2bCode: tData.bc,

    org: reqBody.org ? reqBody.org : tData.org,
    orgName: reqBody.orgName ? reqBody.orgName : tData.on,
    orgCode: reqBody.orgCode ? reqBody.orgCode : tData.oc,
    obId: reqBody.obId || '',
    obName: reqBody.obName || '',
    obCode: reqBody.obCode || '',
    team: reqBody.team ? reqBody.team : '',
    tName: reqBody.tName ? reqBody.tName : '',
    tCode: reqBody.tCode ? reqBody.tCode : '',

    type: reqBody.type,
    notes: reqBody.notes,

    cuType: uType,
    cUser: tData.iss,
    cuName: tData.fn + ' ' + tData.ln,
    cDate: curUtc.currUTCDtTm,
    cDtStr: curUtc.currUTCDtTmStr,
    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr
  };   
}