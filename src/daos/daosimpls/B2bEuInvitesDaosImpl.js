/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const fs = require('fs');
var { v4: uuidv4 } = require('uuid');
const config = require('config');
const moment = require('moment');

const cs = require('../../services/CommonSrvc');
const { uType, gUser, mpType, aStatus, rStatus, iFrom } = require('../../consts/B2bEuInvitesConsts.json');
const bEusInvs = require('../../schemas/B2BEuInvites');
const bEuAdrs = require('../../schemas/B2BEuInvitesAdrs');

const getInvitesData = () => {
  const day = moment().subtract(45, 'days').format('YYYY-MM-DD HH:mm:ss');
  return { delFlag: false, iStatus: {$in : [aStatus, rStatus]}, uDtStr: { $lte : day} }
}

const deleteMultpleInvitesQuery = (data) => {
  return { _id: {$in: [data._id]}};
}

const invtsListObj = (reqBody, tData) => {
  return setListQuery(reqBody, tData);
}

const getInvDataByMail = (reqBody, tData) => {
  return { myPrimary: tData.bc+':'+reqBody.emID, delFlag: false, b2b: tData.b2b };
}

const createInvtObj = (reqBody, tData) => {
  const obj = setCreateInvtData(reqBody, tData);
  const data = new bEusInvs(obj);
  return data;
}

const postB2bEuInvtntDelete = (_id, reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  const delDtTm = moment.utc().format('YYYYMMDDHHmmss');

  const query = {_id, b2b: tData.b2b};

  const invCld = {refUID: reqBody.userId + '_DEL_' + delDtTm};
  const deleteObj = {
    myPrimary: reqBody.myPrimary + '_DEL_' + delDtTm,
    delFlag: true,

    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr
  };

  return { query, deleteObj, delClsdObj: {...invCld, ...deleteObj} };
}

const viewInvtObj = (_id, tData) => {
  return { _id, delFlag: false, b2b: tData.b2b };
}

const updateInvtObj = (reqBody, file, key, tData) => {
  const iObj = file?.filename ? setIconObj(file) : (!reqBody.iconPath ? { pIcon: '', piPath: '', piActualName: '' } : {});
  const pReportsObj = key == 'create' ? setPreportsData(reqBody) : {};
  const obj = setUpdateInvtData(reqBody, iObj, pReportsObj, tData);
  return obj;
}

const b2bEuAdrsUpdate = (adrsData, tData) => {
  const query = { delFlag: false, _id: adrsData.id, b2b: tData.b2b };
  const upObj = setInvtAdrsUpdate(adrsData, tData);
  return { query, upObj }
}

const b2bEuAdrsCreate = (adrsData, resData, tData) => {
  const obj = setInvtAdrsData(adrsData, resData, tData);
  const data = new bEuAdrs(obj);
  return data
}

const invStatusUpdate = (iStatus, tData) => {
  const curUtc = cs.currUTCObj();
  return {
    iStatus,

    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr
  };
}

const getInvQry = (_id, b2b) => {
  return {_id, delFlag: false, b2b};
}

const setInvStsUpdateData = (reqBody, tData) => {
  const iStatus = reqBody.cnsKey ? {} : {iStatus : reqBody.status};
  const pReports = reqBody.invpReports && reqBody.invpReports.length ? {pReports: reqBody.invpReports} : {};
  const team = reqBody.team && reqBody.team ? {team: reqBody.team} : {};
  const tName = reqBody.tName && reqBody.tName ? {tName: reqBody.tName} : {};
  const tCode = reqBody.tCode && reqBody.tCode ? {tCode: reqBody.tCode} : {};
  const curUtc = cs.currUTCObj();
  return {
    ...iStatus, 
    ...pReports,
    ...team,
    ...tName,
    ...tCode,
    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  };
}

const getUiQry = (uid, b2b) => {
  return {delFlag: false, uid, b2b};
}

const setInvitesClsdData = (reqData) => {
  return invitesClsdData(reqData);
}

const invtsClsdListObj = (reqBody, tData) => {
  const searchStr = reqBody?.searchStr || '';
  const iStatus = reqBody?.iStatus ? (reqBody?.iStatus == 'All' ? {} : { iStatus: reqBody.iStatus }) : {};
  const pReports = (tData.ut != 'Employee') ? {} : {pReports: {$in : [tData.iss]}}
  return {
    delFlag: false,
    b2b: tData.b2b,
    ...iStatus,
    ...pReports,
    uDtStr: { $gte: reqBody.startDate + ' ' + '00:00:00', $lte: reqBody.endDate + ' ' + '23:59:59'},
    $or: [
      { 'orgName': { $regex: searchStr, $options: 'i' } },
      { 'tName': { $regex: searchStr, $options: 'i' } },  
      { 'name': { $regex: searchStr, $options: 'i' } },
      { 'mobNum': { $regex: searchStr, $options: 'i' } },
      { 'emID': { $regex: searchStr, $options: 'i' } },
    ]
  }
}

const invtsTeamStsQry = (team, tData) => ({b2b: tData.b2b, delFlag: false, team, iStatus: {$nin: ['Rejected']}});
const invtsTeamQry = (team, tData) => ({b2b: tData.b2b, delFlag: false, team});
  
module.exports = {
  getInvitesData, deleteMultpleInvitesQuery, invtsListObj, getInvDataByMail, createInvtObj, postB2bEuInvtntDelete, updateInvtObj, 
  viewInvtObj, b2bEuAdrsUpdate, b2bEuAdrsCreate, invStatusUpdate, getInvQry, setInvStsUpdateData, getUiQry,
  setInvitesClsdData, invtsClsdListObj, invtsTeamStsQry, invtsTeamQry
};

const setListQuery = (reqBody, tData) => {
  const searchStr = reqBody?.searchStr || '';
  const status = reqBody?.status?.length ? { iStatus: { $in: reqBody.status } } : {};
  const pReports = (tData.ut != 'Employee') ? {} : {pReports: {$in : [tData.iss]}}
  const matchQuery = {
    delFlag: false,
    b2b: tData.b2b,
    ...status,
    ...pReports,
    $or: [
      { 'orgName': { $regex: searchStr, $options: 'i' } },
      { 'tName': { $regex: searchStr, $options: 'i' } },
      { 'name': { $regex: searchStr, $options: 'i' } },
      { 'mobNum': { $regex: searchStr, $options: 'i' } },
      { 'emID': { $regex: searchStr, $options: 'i' } },
    ]
  };
  var countQuery = [
    {$match: { delFlag: false, b2b: tData.b2b, ...pReports }},
    {$group: { _id: '$iStatus', count: { $sum: 1 } }}
  ]
  return { matchQuery, countQuery };
};

const setIconObj = (file) => {
  const currNum = cs.getCurrNum();
  const pIcon = currNum + '_' + file.filename.replace(/\s/g, '-');
  const piPath = file.destination + '/' + pIcon;
  fs.renameSync(file.path, piPath);
  return { pIcon, piPath: config.apiHost + piPath, piActualName: file.filename };
}

const setCreateInvtData = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  const pReports = [...new Set(reqBody.pReports)];
  return {
    _id: uuidv4(),
    idSeq: {
      seq: curUtc.currUTCYear + curUtc.currUTCMnt + curUtc.currUTCDay,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMnt,
      day: curUtc.currUTCDay
    },
    b2b: tData.b2b,
    b2bName: tData.bn,
    b2bCode: tData.bc,

    iFrom: reqBody.iFrom ? reqBody.iFrom : iFrom, 
    
    refType: reqBody.refType,
    refByUser: reqBody.refByUser || '',
    refByUID: reqBody.refByUID || '',
    refByName: reqBody.refByName,

    org: reqBody.org ? reqBody.org : tData.org,
    orgName: reqBody.orgName ? reqBody.orgName : tData.on,
    orgCode: reqBody.orgCode ? reqBody.orgCode : tData.oc,
    team: reqBody.team ? reqBody.team : tData.ot,
    tName: reqBody.tName ? reqBody.tName : tData.otn,
    tCode: reqBody.tCode ? reqBody.tCode : tData.otc,
    obId: reqBody.obId || '',
    obName: reqBody.obName || '',
    obCode: reqBody.obCode || '',

    name: reqBody.name || gUser,
    sName: reqBody.sName || '',
    fName: reqBody.fName || gUser,
    lName: reqBody.lName || gUser,
    mobCc: reqBody.mobCc || '',
    mobNum: reqBody.mobNum || '',
    mobCcNum: reqBody.mobCcNum || '',
    emID: reqBody.emID,
    refUID: tData.bc + ':' + reqBody.refUID,
    myPrimary: tData.bc + ':' + reqBody.emID,
    mpType,
    mpVerifyFlag: false,

    report: reqBody.report,
    rprtName: reqBody.rprtName,
    rprtPrimary: reqBody.rprtPrimary,
    pReports,

    iStatus: reqBody.iStatus,

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

const setInvtAdrsData = (adrsData, cnsltntData, tData) => {
  const curUtc = cs.currUTCObj();
  const countyCode = adrsData.cCode ? adrsData.cCode : '';
  const stateCode = adrsData.sCode ? adrsData.sCode : '';
  return {
    _id: uuidv4(),

    idSeq: {
      seq: countyCode + stateCode + curUtc.currUTCYear + curUtc.currUTCMnt + curUtc.currUTCDay,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMnt,
      day: curUtc.currUTCDay
    },
    uid: cnsltntData._id,
    b2b: tData.b2b,
    b2bName: tData.bn,
    b2bCode: tData.bc,

    org: cnsltntData.org,
    orgName: cnsltntData.orgName,
    orgCode: cnsltntData.orgCode,
    obId: cnsltntData.obId,
    obName: cnsltntData.obName,
    obCode: cnsltntData.obCode,
    team: cnsltntData.team,
    tName: cnsltntData.tName,
    tCode: cnsltntData.tCode,

    adrsType: adrsData.adrsType,
    hNum: adrsData.hNum,
    area: adrsData.area || '',
    aLocality: adrsData.aLocality || '',
    zip: adrsData.zip || '',
    state: adrsData.state,
    sCode: adrsData.sCode,
    city: adrsData.city,
    cityCode: adrsData.cityCode || '',
    country: adrsData.country,
    cCode: adrsData.cCode,

    plusCode: adrsData.plusCode || '',
    geocoordinates: adrsData.geocoordinates || {},

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

const setPreportsData = (reqBody) => {
  return {
    report: reqBody.report || '',
    rprtName: reqBody.rprtName || '',
    rprtPrimary: reqBody.rprtPrimary || '',
    pReports: reqBody.pReports || [],
    org: reqBody.org || '',
    orgName: reqBody.orgName || '',
    orgCode: reqBody.orgCode || '',
    obId: reqBody.obId || '',
    obName: reqBody.obName || '',
    obCode: reqBody.obCode || '',
    team: reqBody.team || '',
    tName: reqBody.tName || '',
    tCode: reqBody.tCode || '',

    refType: reqBody.refType,
    refByUser: reqBody.refByUser || '',
    refByUID: reqBody.refByUID || '',
    refByName: reqBody.refByName,
  };
}

const setUpdateInvtData = (reqBody, iObj, pReportsObj, tData) => {
  const curUtc = cs.currUTCObj();
  return {

    name: reqBody.name,
    sName: reqBody.sName || '',
    fName: reqBody.fName,
    lName: reqBody.lName,
    mobCc: reqBody.mobCc || '',
    mobNum: reqBody.mobNum || '',
    mobCcNum: reqBody.mobCcNum || '',
    altMobCc: reqBody.altMobCc || '',
    altMobNum: reqBody.altMobNum || '',
    altMobCcNum: reqBody.altMobCcNum || '',
    altEmID: reqBody.altEmID || '',
    dob: reqBody.dob || '',
    dobStr: reqBody.dobStr || '',
    gender: reqBody.gender || '',

    ...pReportsObj,

    ...iObj,

    ecPer: reqBody.ecPer || '',
    ecRelt: reqBody.ecRelt || '',
    ecNum: reqBody.ecNum || '',
    ecEml: reqBody.ecEml || '',

    empType: reqBody.empType || '',
    ssn: reqBody.ssn || '',
    ssnExpDt: reqBody.ssnExpDt || '',
    ssnExpDtStr: reqBody.ssnExpDtStr || '',
    mStatus: reqBody.mStatus || '',

    unidType: reqBody.unidType || '',
    usaNatID: reqBody.usaNatID || '',
    unidIssDt: reqBody.unidIssDt || '',
    unidIssDtStr: reqBody.unidIssDtStr || '',
    unidExpDt: reqBody.unidExpDt || '',
    unidExpDtStr: reqBody.unidExpDtStr || '',
    isRes: reqBody.isRes || false,

    wrkUrls: reqBody.wrkUrls || [],

    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  };
}

const setInvtAdrsUpdate = (adrsData, tData) => {
  const curUtc = cs.currUTCObj();
  return {
    // org: cnsltntData.org,
    // orgName: cnsltntData.orgName,
    // orgCode: cnsltntData.orgCode,
    // obId: cnsltntData.obId,
    // obName: cnsltntData.obName,
    // obCode: cnsltntData.obCode,
    // team: cnsltntData.team,
    // tName: cnsltntData.tName,
    // tCode: cnsltntData.tCode,

    adrsType: adrsData.adrsType,
    hNum: adrsData.hNum,
    area: adrsData.area || '',
    aLocality: adrsData.aLocality || '',
    zip: adrsData.zip || '',
    state: adrsData.state,
    sCode: adrsData.sCode,
    city: adrsData.city,
    cityCode: adrsData.cityCode || '',
    country: adrsData.country,
    cCode: adrsData.cCode,

    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  };
}

const invitesClsdData = (data) => {
  return {
    _id: data._id,
    idSeq: data.idSeq,
    b2b: data.b2b,
    b2bName: data.b2bName,
    b2bCode: data.b2bCode,

    iFrom: data.iFrom,
    refType: data.refType,
    refByUser: data.refByUser,
    refByUID: data.refByUID,
    refByName: data.refByName,

    org: data.org,
    orgName: data.orgName,
    orgCode: data.orgCode,
    obId: data.obId,
    obName: data.obName,
    obCode: data.obCode,
    team: data.team,
    tName: data.tName,
    tCode: data.tCode,

    report: data.report || '',
    rprtName: data.rprtName || '',
    rprtPrimary: data.rprtPrimary || '',
    pReports: data.pReports || [], // Parent Reports
  
    name: data.name ,
    sName: data.sName,
    fName: data.fName ,
    lName: data.lName ,
    mobCc: data.mobCc,
    mobNum: data.mobNum,
    mobCcNum: data.mobCcNum,
    emID: data.emID,
    refUID: data.refUID,
    myPrimary: data.myPrimary,
    mpType: data.mpType,
    mpVerifyFlag: data.mpVerifyFlag,

    iStatus: data.iStatus,
    delFlag: data.delFlag,

    cuType: data.cuType,
    cUser: data.cUser,
    cuName: data.cuName,
    cDate: data.cDate,
    cDtStr: data.cDtStr,
    uuType: data.uuType,
    uUser: data.uUser,
    uuName: data.uuName,
    uDate: data.uDate,
    uDtStr: data.uDtStr,
  };
}
