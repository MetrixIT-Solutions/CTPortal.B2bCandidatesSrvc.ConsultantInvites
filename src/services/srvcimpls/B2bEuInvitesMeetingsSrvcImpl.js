/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const ApiCalls = require('../../ApiCalls');
const moment = require('moment');
const mail = require('../../../config/mail');
const config = require('config');

const sendMeetingLink = (data, cEmail, status, tData) => {
  const it = moment(data.msDtTmStr).format('DD MMM, YYYY HH:mm');
  let mailSub = data.msub;
  let itDt = `<p>Meeting time: <b>${it} ${data.mTz}</b></p>`;
  let itZ = `<p>Meeting type: <b>${data.mType}</b></p>`;
  let phn = data.mType == 'Telephone' ? `<p>Mobile Number: <b>${data.mpCcNum}</b></p>` : '';
  let ml = data.mLink ? `<p>Meeting link to join: <b><a target='_blank' href='${data.mLink}'>Click here</a></b> (${data.mLink})</p>` : '';
  let adrs = data.mType == 'Face to Face' ? `<p>Address: <b>${data.mobAdrs}</b></p>` : '';
  let cnslt = `<p>Consultant: <b>${data.swc}</b></p>`;
  let mbrs = `<p>Members to attend: <b>${data.mbrNames.map(item => item) + ',' + data.swc}</b></p>`;
  let mc = `<p>I hope this email finds you well. I am writing to propose a ${status} meeting to discuss about</p><p>${data.mDesc}.<p>`;
  let bc = `<p>If the suggested time does not work for you, please let me know your availability, and I will do my best to accommodate.</p><p>Looking forward to your confirmation. Please feel free to contact me ${data.sbuEid} if you have any questions or need additional information.</p><br/>`
  let rg = `<p>Regards,</p><p><b>${data.orgName || data.b2bName}</b><p>`
  let htmlContent = `${mc} ${itDt} ${itZ} ${phn} ${ml} ${adrs} ${cnslt} ${mbrs} ${bc}   ${rg}`;
  setMailMeeting(data.swc, cEmail, mailSub, htmlContent, tData);
  data.members.map(item => {
    item?.name && item?.emID && setMailMeeting(item.name, item.emID, mailSub, htmlContent, tData);
  });
}
module.exports = {
  sendMeetingLink
}
const setMailMeeting = (name, email, mailSub, content, tData) => {
  let gr = `<p>Dear ${name},</b></p>`;
  let htmlContent = `${gr}  ${content}`;
  const body = { org: tData.org, b2b: tData.b2b};
  ApiCalls.getSmtpDetails(body, (err, resObj) => {
    if (resObj && resObj.status == '200') {
      const data = resObj.resData.result;
      if(data.smtp && data.smtpPort && data.senderMail && data.senderMailPswd && data.from){
        const smtpData = { service: data.service, host: data.smtp, port: data.smtpPort, user: data.senderMail, pass: data.senderMailPswd, from: data.from };
        mail.sendEMail(email, mailSub, htmlContent, smtpData, (err, resObj) => {});
      } else {
        const smtpData = { service: 'gmail', host: config.smtp, port: config.smtpPort, user: config.senderMail, pass: config.senderMailPswd, from: config.from }
        mail.sendEMail(email, mailSub, htmlContent, smtpData, (err, resObj) => {});
      }
    } else {
      const smtpData = { service: 'gmail', host: config.smtp, port: config.smtpPort, user: config.senderMail, pass: config.senderMailPswd, from: config.from }
      mail.sendEMail(email, mailSub, htmlContent, smtpData, (err, resObj) => {});
    }
  })
}