/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvMtNDaoimpl = require('../daos/daosimpls/B2bEuInvitesMeetingsDaoImpl');
const bEuInvMtNDao = require('../daos/B2bEuInvitesMeetingsDaos');
const bEuInvMtSrvcImpl = require('./srvcimpls/B2bEuInvitesMeetingsSrvcImpl');

const postEusInvrMeetingsCreate = (reqBody, tData, callback) => {
  const data = bEuInvMtNDaoimpl.b2bInvMeetingsData(reqBody, tData);
  bEuInvMtNDao.postEusInvrMeetingsCreate(data, resObj => {
    if (resObj.status == '200') {
      const resData = resObj.resData.result;
      const cEamil = resData.invUserPrimary.split(':');
      callback(resObj);
      bEuInvMtSrvcImpl.sendMeetingLink(resObj.resData.result, cEamil[1], '', tData);
    } else callback(resObj);
  });
}

const postEusrInvInvMeetingsList = (recordId, reqBody, tData, callback) => {
  const qry = bEuInvMtNDaoimpl.usrMtByStsQry(recordId, reqBody, tData.b2b);
  bEuInvMtNDao.postEusrInvInvMeetingsList(qry, reqBody.pgNum, callback);
}

const putEusrInvInvMeetingsReschedule = (recordId, reqBody, tData, callback) => {
  const qry = bEuInvMtNDaoimpl.usrMtQry(recordId, tData.b2b);
  const updObj = bEuInvMtNDaoimpl.setMtRscData(reqBody, tData);
  bEuInvMtNDao.updateEuInMeetings(qry, updObj, resObj => {
    if (resObj.status == '200') {
      const resData = resObj.resData.result;
      const cEamil = resData.invUserPrimary.split(':');
      callback(resObj);
      bEuInvMtSrvcImpl.sendMeetingLink(resObj.resData.result, cEamil[1], 'Rescheduled', tData);
    } else callback(resObj);
  });
}

const putEuInvtsMeetingsStatusUpdate = (recordId, reqBody, tData, callback) => {
  const qry = bEuInvMtNDaoimpl.usrMtQry(recordId, tData.b2b);
  const updObj = bEuInvMtNDaoimpl.setMtStatus(tData, reqBody);
  bEuInvMtNDao.updateEuInMeetings(qry, updObj, resObj => {
    if (resObj.status == '200') {
      const resData = resObj.resData.result;
      const cEamil = resData.invUserPrimary.split(':');
      callback(resObj);
      bEuInvMtSrvcImpl.sendMeetingLink(resObj.resData.result, cEamil[1], '', tData);
    } else callback(resObj);
  });
}
module.exports = {
  postEusInvrMeetingsCreate, postEusrInvInvMeetingsList, putEusrInvInvMeetingsReschedule, putEuInvtsMeetingsStatusUpdate
}