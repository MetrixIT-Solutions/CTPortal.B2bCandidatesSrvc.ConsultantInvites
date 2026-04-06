/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const sRes = require('../../SetRes');

const tokenVldn = (tData) => {
  if (!tData) {
    const result = sRes.tokenInvalid();
    return { flag: false, result };
  } else if (tData.isExpired) {
    const result = sRes.tokenExpired();
    return { flag: false, result };
  } else if (!tData.tokenData) {
    const result = sRes.tokenSsnErr();
    return { flag: false, result };
  } else {
    return { flag: true, result: tData.tokenData };
  }
}

const inviteNotestVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.invite || !reqBody.userId || !reqBody.invUser || !reqBody.email || !reqBody.notes) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const userInvNotesVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.params.recordId || !reqBody.pgNum) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}


const euonBrdNtsCrtVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.invite && ! reqBody.invUserId && !reqBody.invUser && !reqBody.invUserPrimary && !reqBody.notes && !reqBody.type && !reqBody.lead && !reqBody.leadId) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const euonBrdNtsListVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.type && !reqBody.lead && !reqBody.invite) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const euonBrdNtsUpdateVldn = (req) => {
  const reqBody = req.body;  
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.notes && !reqBody.type && !reqBody.lead && !reqBody.invite && !req.params.id) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

module.exports = {
  tokenVldn, inviteNotestVldn, userInvNotesVldn, euonBrdNtsCrtVldn, euonBrdNtsListVldn, euonBrdNtsUpdateVldn
};