/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const cs = require('../../services/CommonSrvc');
const { uType, cCode, sCode } = require('../../consts/B2bEuInvitesConsts.json');
const bEuInvCerts = require('../../schemas/B2BEuInvitesCerts');

const viewCertsObj = (_id, tData) => {
  return { delFlag: false, _id, b2b: tData.b2b };
}
const updateCertsObj = (reqBody, tData) => {
  const obj = setUpdateData(reqBody, tData);
  return obj;
}

const createCertsObj = (reqBody, tData) => {
  const obj = setCreateData(reqBody, tData);
  const data = new bEuInvCerts(obj);
  return data;
}

module.exports = {
  viewCertsObj, updateCertsObj, createCertsObj
};

const setUpdateData = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();

  return {
    cName: reqBody.cName,
    cSpec: reqBody.cSpec,
    cBy: reqBody.cBy,
    cDt: reqBody.cDt || '',
    cAbt: reqBody.cAbt || '',

    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  };
}


const setCreateData = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  return {
    _id: uuidv4(),

    idSeq: {
      seq: cCode + sCode + curUtc.currUTCYear + curUtc.currUTCMnt + curUtc.currUTCDay,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMnt,
      day: curUtc.currUTCDay
    },

    uid: reqBody.invitationId,
    b2b: tData.b2b,
    b2bName: tData.bn,
    b2bCode: tData.bc,

    org: reqBody.org || '',
    orgName: reqBody.orgName || '',
    orgCode: reqBody.orgCode || '',
    obId: reqBody.obId || '',
    obName: reqBody.obName || '',
    obCode: reqBody.obCode || '',
    team: reqBody.team || '',
    tName: reqBody.tName || '',
    tCode: reqBody.tCode || '',
    
    cName: reqBody.cName,
    cSpec: reqBody.cSpec,
    cBy: reqBody.cBy,
    cDt: reqBody.cDt || '',
    cAbt: reqBody.cAbt || '',

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