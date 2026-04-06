/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const cs = require('../../services/CommonSrvc');
const { uType } = require('../../consts/B2bEuInvitesConsts.json');
const bEuInvWa = require('../../schemas/B2BEuInvitesWrkAuths');

const viewWrkAuthObj = (reqBody, tData) => {
  return { delFlag: false, _id: reqBody.id, b2b: tData.b2b }
}
const updateWrkAuthObj = (reqBody, tData) => {
  const obj = setUpdateData(reqBody, tData);
  return obj
}

const createWrkAuthObj = (invId, reqBody, tData) => {
  const obj = setCreateData(invId, reqBody, tData);
  const data = new bEuInvWa(obj);
  return data
}

module.exports = {
  viewWrkAuthObj, updateWrkAuthObj, createWrkAuthObj
};

const setUpdateData = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  return {
    nationality: reqBody.nationality,
    psprtNum: reqBody.psprtNum,
    psprtIssDt: reqBody.psprtIssDt,
    psprtIssDtStr: reqBody.psprtIssDtStr,
    psprtExpDt: reqBody.psprtExpDt,
    psprtExpDtStr: reqBody.psprtExpDtStr,
    psprtIssPlace: reqBody.psprtIssPlace,
    psprtDocNum: reqBody.psprtDocNum || '',

    visaStatus: reqBody.visaStatus || '',
    visaStDt: reqBody.visaStDt || '',
    visaStDtStr: reqBody.visaStDtStr,
    visaExpDt: reqBody.visaExpDt || '',
    visaExpDtStr: reqBody.visaExpDtStr || '',
    empType: reqBody.empType || '',
    sevisNum: reqBody.sevisNum,

    cardNum: reqBody.cardNum || '',
    uscisNum: reqBody.uscisNum || '',
    cardExpDt: reqBody.cardExpD || '',
    cardExpDtStr: reqBody.cardExpDtStr || '',
    cardRcptNum: reqBody.cardRcptNum,

    li94Num: reqBody.li94Num || '',
    i94ExpDt: reqBody.i94ExpDt || '',
    i94ExpDtStr: reqBody.i94ExpDtStr,
    wrkAuthStrtDt: reqBody.wrkAuthStrtDt || '',
    wrkAuthStrtDtStr: reqBody.wrkAuthStrtDtStr || '',
    wrkAuthExpDt: reqBody.wrkAuthExpDt || '',
    wrkAuthExpDtStr: reqBody.wrkAuthExpDtStr || '',

    position: reqBody.position || '', 
    initCardNum: reqBody.initCardNum || '', 
    receiptNum: reqBody.receiptNum || '', 

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

    nationality: reqBody.nationality,
    psprtNum: reqBody.psprtNum,
    psprtIssDt: reqBody.psprtIssDt,
    psprtIssDtStr: reqBody.psprtIssDtStr,
    psprtExpDt: reqBody.psprtExpDt,
    psprtExpDtStr: reqBody.psprtExpDtStr,
    psprtIssPlace: reqBody.psprtIssPlace,
    psprtDocNum: reqBody.psprtDocNum,

    visaStatus: reqBody.visaStatus || '',
    visaStDt: reqBody.visaStDt || '',
    visaStDtStr: reqBody.visaStDtStr,
    visaExpDt: reqBody.visaExpDt || '',
    visaExpDtStr: reqBody.visaExpDtStr || '',
    empType: reqBody.empType || '',
    sevisNum: reqBody.sevisNum || '',

    cardNum: reqBody.cardNum || '',
    uscisNum: reqBody.uscisNum || '',
    cardExpDt: reqBody.cardExpD || '',
    cardExpDtStr: reqBody.cardExpDtStr || '',
    cardRcptNum: reqBody.cardRcptNum || '',

    li94Num: reqBody.li94Num || '',
    i94ExpDt: reqBody.i94ExpDt || '',
    i94ExpDtStr: reqBody.i94ExpDtStr,
    wrkAuthStrtDt: reqBody.wrkAuthStrtDt || '',
    wrkAuthStrtDtStr: reqBody.wrkAuthStrtDtStr || '',
    wrkAuthExpDt: reqBody.wrkAuthExpDt || '',
    wrkAuthExpDtStr: reqBody.wrkAuthExpDtStr || '',

    position: reqBody.position || '', 
    initCardNum: reqBody.initCardNum || '', 
    receiptNum: reqBody.receiptNum || '', 

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