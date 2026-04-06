/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvNDaoimpl = require('../daos/daosimpls/B2bEuInviteNotesDaoImpl');
const bEuInvNDao = require('../daos/B2bEuInviteNotesDaos');
const mail = require('../../config/mail');
const ApiCalls = require('../ApiCalls');
const config = require('config');

const postEusrInvNotesCreate = (reqBody, tData, callback) => {
  const data = bEuInvNDaoimpl.b2bInviteNotesData(reqBody, tData);
  bEuInvNDao.postEusrInvNotesCreate(data, resObj => {
    if (resObj.status == '200') {
      setMailNotes(resObj.resData.result, 'Profile Followup Notes', tData);
      callback(resObj);
    } else callback(resObj);
  });
}

const getEusrInvNotesList = (recordId, reqBody, tData, callback) => {
  const qry = bEuInvNDaoimpl.usrNotesQry(recordId, tData.b2b);
  bEuInvNDao.getEusrInvNotesList(qry, reqBody.pgNum, callback);
}


const postB2bEuOnBrdNtsCreate = (reqBody, tData, callback) => {
  const obj = bEuInvNDaoimpl.onBrdNtsCrtObj(reqBody, tData);
  bEuInvNDao.postEusrInvNotesCreate(obj, resObj => {
    if (resObj.status == '200') {
      const mailSub = resObj.resData.result.type === 'On Boarding' ? 'On Boarding Followup Notes' : 'In Marketing Followup Notes';
      setMailNotes(resObj.resData.result, mailSub, tData);
      callback(resObj);
    } else callback(resObj);
  });
}

const getB2bEuOnBrdNtsList = (reqBody, tData, callback) => {
  const getObj = bEuInvNDaoimpl.getNotesData(reqBody, tData);
  bEuInvNDao.getB2bEuOnBrdNtsList(getObj, callback);
}

const putB2bEuOnBrdNtsUpdate = (reqBody, id, tData, callback) => {
  const updateObj = bEuInvNDaoimpl.updateNotes(reqBody, id, tData);
  bEuInvNDao.putB2bEuOnBrdNtsUpdate(updateObj.query, updateObj.updateNts, resObj => {
    if (resObj.status == '200') {
      const mailSub = resObj.resData.result.type === 'On Boarding' ? 'On Boarding Followup Notes' : 'In Marketing Followup Notes';
      setMailNotes(resObj.resData.result, mailSub, tData);
      callback(resObj);
    } else callback(resObj);
  });
}

module.exports = {
  postEusrInvNotesCreate, getEusrInvNotesList, postB2bEuOnBrdNtsCreate, getB2bEuOnBrdNtsList, putB2bEuOnBrdNtsUpdate
}

const setMailNotes = (resData, mailSub, tData) => {
  const cEamil = resData.invUserPrimary.split(':');
  let gr = `<p>Dear ${resData.invUser},</b></p>`;
  let rg = `<p>Regards,</p><p><b>${resData.orgName || resData.b2bName}</b><p>`;
  let htmlContent = `${gr} ${resData.notes} ${rg}`;

  if(cEamil.length > 1) {
    const body = { org: tData.org, b2b: tData.b2b };
    ApiCalls.getSmtpDetails(body, (err, resObj) => {
      if (resObj && resObj.status == '200') {
        const data = resObj.resData.result;
        if (data.smtp && data.smtpPort && data.senderMail && data.senderMailPswd && data.from) {
          const smtpData = { service: data.service, host: data.smtp, port: data.smtpPort, user: data.senderMail, pass: data.senderMailPswd, from: data.from };
          mail.sendEMail(cEamil[1], mailSub, htmlContent, smtpData, (err, resObj) => { });
        } else {
          const smtpData = { service: 'gmail', host: config.smtp, port: config.smtpPort, user: config.senderMail, pass: config.senderMailPswd, from: config.from }
          mail.sendEMail(cEamil[1], mailSub, htmlContent, smtpData, (err, resObj) => { });
        }
      } else {
        const smtpData = { service: 'gmail', host: config.smtp, port: config.smtpPort, user: config.senderMail, pass: config.senderMailPswd, from: config.from }
        mail.sendEMail(cEamil[1], mailSub, htmlContent, smtpData, (err, resObj) => { });
      }
    });
  }
}