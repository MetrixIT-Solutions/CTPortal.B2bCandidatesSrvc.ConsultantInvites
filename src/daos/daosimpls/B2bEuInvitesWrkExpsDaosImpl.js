/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const cs = require('../../services/CommonSrvc');
const { uType, } = require('../../consts/B2bEuInvitesConsts.json');
const bEuInvWrkExp = require('../../schemas/B2BEuInvitesWrkExps');

const viewWrkExpObj = (_id, tData) => {
  return { delFlag: false, _id, b2b: tData.b2b }
}

const updateWrkExpObj = (reqBody, tData) => {
  const obj = setUpdateData(reqBody, tData);
  return obj
}

const createWrkExpObj = (invId, reqBody, tData) => {
  const obj = setCreateData(invId, reqBody, tData);
  const data = new bEuInvWrkExp(obj);
  return data
}

const deleteEmpObj = (_id, tData) => {
  const curUtc = cs.currUTCObj();

  const updateObj = {
    $pull: {
      emps: { _id }
    },
    $set: {
      uuType: uType,
      uUser: tData.iss,
      uuName: tData.fn + ' ' + tData.ln,
      uDate: curUtc.currUTCDtTm,
      uDtStr: curUtc.currUTCDtTmStr,
    }
  };
  return updateObj
}

module.exports = {
  viewWrkExpObj, updateWrkExpObj, createWrkExpObj, deleteEmpObj
};

const setUpdateData = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  return {
    expYears: reqBody.expYears,
    expMonths: reqBody.expMonths,
    tExp: reqBody.tExp,
    jobTitle: reqBody.jobTitle,
    primSkills: reqBody.primSkills,
    primSkillsArr: reqBody.primSkillsArr,
    secSkills: reqBody.secSkills || '',
    secSkillsArr: reqBody.secSkillsArr || '',
    prfsSrm: reqBody.prfsSrm,
    healthIns: reqBody.healthIns || false,

    emps: reqBody.emps || [],

    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  };
}

const setCreateData = (uid, reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  return {
    _id: uuidv4(),

    idSeq: {
      seq: curUtc.currUTCYear + curUtc.currUTCMnt + curUtc.currUTCDay,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMnt,
      day: curUtc.currUTCDay
    },

    uid,
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

    expYears: reqBody.expYears,
    expMonths: reqBody.expMonths,
    tExp: reqBody.tExp,
    jobTitle: reqBody.jobTitle,
    primSkills: reqBody.primSkills,
    primSkillsArr: reqBody.primSkillsArr,
    secSkills: reqBody.secSkills || '',
    secSkillsArr: reqBody.secSkillsArr || [],
    prfsSrm: reqBody.prfsSrm,
    healthIns: reqBody.healthIns || false,

    emps: reqBody.emps || [],

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