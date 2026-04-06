/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const fs = require('fs');
const config = require('config');
const async = require('async');
var moment = require('moment');

const mail = require('../../../config/mail');
const { gUser, errMsgs, openStatus, uniq, cdmn } = require('../../consts/B2bEuInvitesConsts.json');
const bEuDaoimpl = require('../../daos/daosimpls/B2bEuInvitesDaosImpl');
const bEuDao = require('../../daos/B2bEuInvitesDaos');
const SetRes = require('../../SetRes');
const cs = require('../CommonSrvc');
const ApiCalls = require('../../ApiCalls');
const logger = require('../../lib/logger');
const B2BEuInvitesClsd = require('../../schemas/B2BEuInvitesClsd');
const B2BEuInvitesAll = require('../../schemas/B2BEuInvitesAll');

const createMultipleInvitesData = (resData, callback) => {
  createClsdData(0, resData, [], callback);
}

const resendInvtn = (req, resObj, tData, callback) => {
  const acTknGen = cs.generateAccessToken();
  sendInvitationMail(resObj.resData.result, acTknGen, tData, (err, resObj2) => {
    if (resObj2 && resObj2.accepted && resObj2.accepted.length) {
      const data = Object.assign({}, resObj.resData.result.toObject());
      const body = { ...data, resendInvtn: true, acTknGen };
      let b2bua = JSON.parse(req.headers.ctpb2bua);
      b2bua.ip = req.ip || b2bua.ip;
      const ctpb2bua = JSON.stringify(b2bua);
      ApiCalls.inviteCnsltnt(tData.ctpb2batoken, ctpb2bua, body, (err1, resObj1) => {
        if(err1) logger.error('Un-known Error in srvcimpls/B2bEuInvitesSrvcImpl.js, at sendInvitationMail - inviteCnsltnt:' + err1);
      });
      const res = SetRes.successRes(errMsgs.invSucs);
      callback(res);
    } else {
      logger.error('Un-known Error in srvcimpls/B2bEuInvitesSrvcImpl.js, at sendInvitationMail:' + err);
      const ue = SetRes.unKnownErr(errMsgs.invFld);
      callback(ue);
    }
  });
}
const sendInvitationMail = (reqBody, acTknGen, tData, callback) => {
  const email = reqBody.emID;
  const mailSub = 'CT Portal Candidate Registration';
  const name = reqBody.fName ? reqBody.fName : gUser;
  var bn = tData.tokenData.bn;
  const link = cdmn[tData?.tokenData?.bc] + 'set-password/' + acTknGen;
  const content = `
    <p>Dear ${name}</p>
    <p>Welcome to <b>${bn}!</b></p>
    <p>You are invited to input your account information.</p>
    <p><a target='_blank' href='${link}'>Click here</a> to set your password and input your acount details (or) Open Link: ${link}</p>
    <p>If you have any queries, feel free to reach us at ${tData.tokenData.eid}.</p>
    <p>Sincerely,</p>
    <p><b>${bn}</b> Team</p>
  `;
  const body = {org: tData.tokenData.org, b2b: tData.tokenData.b2b};
  ApiCalls.getSmtpDetails(body, (err, resObj) => {
    if (resObj && resObj.status == '200') {
      const data = resObj.resData.result;
      if(data.smtp && data.smtpPort && data.senderMail && data.senderMailPswd && data.from){
        const smtpData = { service: data.service, host: data.smtp, port: data.smtpPort, user: data.senderMail, pass: data.senderMailPswd, from: data.from };
        mail.sendEMail(email, mailSub, content, smtpData, callback);
      } else {
        const smtpData = { service: 'gmail', host: config.smtp, port: config.smtpPort, user: config.senderMail, pass: config.senderMailPswd, from: config.from }
        mail.sendEMail(email, mailSub, content, smtpData, callback);
      }
    } else {
      const smtpData = { service: 'gmail', host: config.smtp, port: config.smtpPort, user: config.senderMail, pass: config.senderMailPswd, from: config.from }
      mail.sendEMail(email, mailSub, content, smtpData, callback);
    }
  });
}

const createInviteAcc = (ctpb2bua, reqBody, tData, acTknGen, callback) => {
  const refuArr = reqBody.emID.split('@');
  const refUID = refuArr[0];
  const body = { ...reqBody, refUID, iStatus: openStatus };
  const obj = bEuDaoimpl.createInvtObj(body, tData.tokenData);
  createInviteAcct(obj, acTknGen, tData, ctpb2bua, (resObj) => {
    if(resObj.status == '105') {
      const msg = resObj.resData.message;
      if(msg === uniq.uidErr) {
        const dtm = cs.getUidDtTime();
        const newUID = ''+dtm[0]+dtm[1]+refUID+dtm[2]+dtm[3];
        const newRefUID = newUID;
        const newBody = { ...reqBody, refUID: newRefUID, iStatus: openStatus };
        const newObj = bEuDaoimpl.createInvtObj(newBody, tData.tokenData);
        createInviteAcct(newObj, acTknGen, tData, ctpb2bua, (resObj) => {});
      }
    }
    callback(resObj);
  });
}

const endUserAdrsCreate = (adrsData, resData, tData) => {
  setAdressData(0, adrsData, resData, [], tData, (resObj) => { });
}

const euInvtImgUpdate = (req) => {
  const reqBody = JSON.parse(req.body.endUserData);
  const pathData = reqBody.iPath ? reqBody.iPath.split(config.apiHost) : '';
  const path = pathData.length ? pathData[1] : '';
  if (req.file) {
    if (fs.existsSync(path))
      fs.unlink(path, (err) => {
        err && logger.error('Un-Known Error in services/B2bEuInvitesSrvcImpl.js, at euInvtImgUpdate - fs.unlink:' + err);
      });
  } else if (!reqBody.iconPath && reqBody.iPath) {
    const folderData = path.split(req.params.imgid);
    const folder = folderData.length ? folderData[0] : ''
    const filesPath = [{ destination: folder + req.params.imgid }];
    cs.dltFolder(filesPath);
  }
}

const getB2InvitesListWithAsync = (matchQuery, countQuery, reqBody, callback) => {
  async.parallel([
    function (cb1) {
      bEuDao.getB2bEuInvitesList(matchQuery, reqBody, (resObj1) => {
        cb1(null, resObj1.resData.result);
      });
    },
    function (cb2) {
      bEuDao.invitesAggregateQuery(countQuery, (resObj2) => {
        cb2(null, resObj2.resData.result);
      });
    },
  ], function (err, result) {
    if (err) {
      logger.error('There was an Un-known Error occured in daos/B2bEuInvitesSrvcImpl.js' + 'at getB2bEuInvitesListAsync:' + err);
    }
    let resArr = {}
    if (result) {
      resArr = { invitationsListCount: result[0].invitationsListCount, invitationsList: result[0].invitationsList, invitesCountByStatus: result[1] }
    } else {
      resArr = { invitationsListCount: result[0].invitationsListCount, invitationsList: result[0].invitationsList, invitesCountByStatus: result[1] };
    }
    callback(SetRes.successRes(resArr));
  });
}

const sendEmail = (usrData, tData, callback) => {
  const email = usrData.emID;
  const subDate = moment(usrData.uDtStr).format('DD MMM, YYYY');
  const mailSub = 'CT Portal  Profile Submission Successful!';
  const name = usrData.fName ? usrData.fName : 'User'
  const content = `
    <p>Dear ${name}</p>
    <p>We are pleased to inform you that your profile data has been successfully submitted!</b></p>
    <p><b>Submission Details:</b></p>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Profile Completed On:</b> ${subDate}</p>
    <p><b>Status:</b>Submitted</p>
    <p>Thank you for completing your profile. You can log in to review your details anytime and make updates as needed.</p>
    <p>If you have any questions or need further assistance, please don’t hesitate to contact our support team.</p>
    <p>Best regards,</p>
  `;
  const body = { org: tData.org, b2b: tData.b2b};
  ApiCalls.getSmtpDetails(body, (err, resObj) => {
    if (resObj && resObj.status == '200') {
      const data = resObj.resData.result;
      if(data.smtp && data.smtpPort && data.senderMail && data.senderMailPswd && data.from){
        const smtpData = { service: data.service, host: data.smtp, port: data.smtpPort, user: data.senderMail, pass: data.senderMailPswd, from: data.from };
        mail.sendEMail(email, mailSub, content, smtpData, callback);
      } else {
        const smtpData = { service: 'gmail', host: config.smtp, port: config.smtpPort, user: config.senderMail, pass: config.senderMailPswd, from: config.from }
        mail.sendEMail(email, mailSub, content, smtpData, callback);
      }
    } else {
      const smtpData = { service: 'gmail', host: config.smtp, port: config.smtpPort, user: config.senderMail, pass: config.senderMailPswd, from: config.from }
      mail.sendEMail(email, mailSub, content, smtpData, callback);
    }
  })
}

const sendApprovedEmail = (usrData, tData, callback) => {
  const onLData = usrData.ua && usrData.ua.length ? usrData.ua.filter(item => item.role == 'Onsite Lead') : [];
  const onMData = usrData.ua && usrData.ua.length ? usrData.ua.filter(item => item.role == 'Onsite Manager') : [];
  const mntData = usrData.ua && usrData.ua.length ? usrData.ua.filter(item => (item.role == 'Mentor')) : [];
  const mntrMailsD = mntData && mntData.length ? mntData.map(item => item.emID) : [];
  const mntrMails = mntrMailsD && mntrMailsD.length ? mntrMailsD.toString() : '';
  const cmailsD = onLData && onLData.length ? onLData.map(item => item.emID) : onMData && onMData.length ? onMData.map(item => item.emID) : [];
  const cmails = cmailsD && cmailsD.length ? cmailsD.toString() : [];
  const subDate = moment(usrData.uDtStr).format('DD MMM, YYYY');
  const mail1Sub = 'CT Portal - Profile Approved!';
  const mail2Sub = 'CT Portal Consultant Assigned!';
  const uContent = `
    <p>Dear ${usrData.euName}</p>
    <p>We are pleased to inform you that your profile data has been successfully approved!</b></p>
    <p>Approved Details:</p>
    <p><b>Candidate Name:</b> ${usrData.euName}</p>
    <p><b>Email:</b> ${usrData.euEmID}</p>
    <p><b>Profile Completed On:</b> ${subDate}</p>
    <p><b>Status:</b> Approved</p>
    <p>If you have any questions or need further assistance, please don’t hesitate to contact ${cmails + ' or ' + mntrMails}.</p>
    <p>Best regards,</p>
    <p><b>${tData.on || tData.bn}</b> Team</p>
  `;
  sendMail(usrData.euEmID, mail1Sub, uContent, tData, callback);

  mntData && mntData.length  && mntData.forEach(item => {
    const mContent = `
    <p>Dear ${item.name}</p>
    <p>We are pleased to inform you that, a new consultant has been assigned to you!</b></p>
    <p>Consultant Details:</p>
    <p><b>Candidate Name:</b> ${usrData.euName}</p>
    <p><b>Email:</b> ${usrData.euEmID}</p>
    <p><b>Profile Completed On:</b> ${subDate}</p>
    <p><b>Status:</b> Approved</p>
    <p>If you have any questions or need further details, please don’t hesitate to contact ${cmails}.</p>
    <p>Best regards,</p>
    <p><b>${tData.on || tData.bn}</b> Team</p>`;
 
    sendMail(item.emID, mail2Sub, mContent, tData, callback)
  }
)}

module.exports = {
  createMultipleInvitesData, resendInvtn, sendInvitationMail, createInviteAcc, endUserAdrsCreate, euInvtImgUpdate, getB2InvitesListWithAsync, sendEmail,
  sendApprovedEmail
};

const createClsdData = (i, resData, resArr, callback) => {
  if (i < resData.length) {
    const data = resData[i];
    const obj = bEuDaoimpl.setInvitesClsdData(data);
    const cObj = new B2BEuInvitesClsd(obj);
    bEuDao.commonCreateFunc(cObj, (resObj) => {
      if(resObj.status == '200'){
        const obj1 = bEuDaoimpl.deleteMultpleInvitesQuery(resObj.resData.result);
        bEuDao.deleteb2bEuInvts(obj1, (resObj2) => {});
      }
      createClsdData(i + 1, resData, resArr, callback);
    })
  } else {
    if(resArr.length){
      callback('Success');
    } else {
      callback('Fail');
    }
  }
}

const createInviteAcct = (obj, acTknGen, tData, ctpb2bua, callback) => {
  bEuDao.commonCreateFunc(obj, (resObj) => {
    if (resObj.status == '200') {
      const data = Object.assign({}, resObj.resData.result.toObject());
      const obj1 = new B2BEuInvitesAll(data);
      bEuDao.commonCreateFunc(obj1, (resObj1) => {});
      const rBody = { ...data, acTknGen };
      ApiCalls.inviteCnsltnt(tData.ctpb2batoken, ctpb2bua, rBody, (err1, resObj1) => {
        if(err1) logger.error('Un-known Error in srvcimpls/B2bEuInvitesSrvcImpl.js, at createInviteAcct - inviteCnsltnt:' + err1);
      });
    }
    callback(resObj);
  });
}

const setAdressData = (i, adrsData, resData, arrRes, tData, callback) => {
  if (i < adrsData.length) {
    const data = adrsData[i];
    if (data.id) {
      if (data.delFlag) {
        const obj = bEuDaoimpl.b2bEuAdrsUpdate(data, tData);
        bEuDao.deleteb2bEuInvtAdrs(obj.query, (resObj1) => {
          setAdressData(i + 1, adrsData, resData, arrRes, tData, callback);
        });
      } else {
        const obj = bEuDaoimpl.b2bEuAdrsUpdate(data, tData);
        bEuDao.updateb2bEuInvtsAdrs(obj.query, obj.upObj, (resObj1) => {
          if (resObj1.status == '200') {
            arrRes.push(resObj1.resData.result);
          }
          setAdressData(i + 1, adrsData, resData, arrRes, tData, callback);
        });
      }
    } else {
      const obj = bEuDaoimpl.b2bEuAdrsCreate(data, resData, tData);
      bEuDao.commonCreateFunc(obj, (resObj2) => {
        if (resObj2.status == '200') {
          arrRes.push(resObj2.resData.result);
        }
        setAdressData(i + 1, adrsData, resData, arrRes, tData, callback);
      });
    }
  } else {
    if (arrRes.length) {
      const sr = SetRes.successRes(arrRes);
      callback(sr);
    } else {
      if (adrsData[0].id) {
        const uf = SetRes.updateFailed({});
        callback(uf);
      } else {
        const cf = SetRes.createFailed({});
        callback(cf);
      }
    }
  }
}


const sendMail = (email, mailSub, content, tData, callback) => {
  const body = { org: tData.org, b2b: tData.b2b};
  ApiCalls.getSmtpDetails(body, (err, resObj) => {
    if (resObj && resObj.status == '200') {
      const data = resObj.resData.result;
      if(data.smtp && data.smtpPort && data.senderMail && data.senderMailPswd && data.from){
        const smtpData = { service: data.service, host: data.smtp, port: data.smtpPort, user: data.senderMail, pass: data.senderMailPswd, from: data.from };
        mail.sendEMail(email, mailSub, content, smtpData, callback);
      } else {
        const smtpData = { service: 'gmail', host: config.smtp, port: config.smtpPort, user: config.senderMail, pass: config.senderMailPswd, from: config.from }
        mail.sendEMail(email, mailSub, content, smtpData, callback);
      }
    } else {
      const smtpData = { service: 'gmail', host: config.smtp, port: config.smtpPort, user: config.senderMail, pass: config.senderMailPswd, from: config.from }
      mail.sendEMail(email, mailSub, content, smtpData, callback);
    }
  });
}

