/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const sRes = require('../../SetRes');
const logger = require('../../lib/logger');

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

const listVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.pgNum || !reqBody.limit) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const inviteCnsltntVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if(!req.headers.ctpb2bua) {
    const te = sRes.headersRequired();
    return { flag: false, result: te };
  } else {
    const diObj = JSON.parse(req.headers.ctpb2bua);
    if(!diObj?.ua || (!req.ip && !diObj?.ip)) {
      logger.error('Missing Device Info (req.ip: ' + req.ip + ') in apiVldns/B2bEuInvitesCtrlVldns.js, at inviteCnsltntVldn - deviceInfo:' + JSON.stringify(diObj));
      const te = sRes.headersRequired();
      return { flag: false, result: te };
    } else if (!reqBody.emID || !reqBody.fName || !reqBody.lName || !reqBody.mobCcNum || !reqBody.mobNum || !reqBody.mobCc || !reqBody.refType || !reqBody.refByName || !reqBody.report || !reqBody.rprtName || !reqBody.rprtPrimary || !reqBody.pReports || !reqBody.iFrom) {
      logger.error('Missing Mandatory Fields Error in apiVldns/B2bEuInvitesCtrlVldns.js, at inviteCnsltntVldn - payload:' + JSON.stringify(reqBody));
      const mn = sRes.mandatory();
      return { flag: false, result: mn };
    } else {
      return { flag: true };
    }
  }
}

const postB2bEuInvtntDelete = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.params.recordId || !reqBody.userId || !reqBody.myPrimary) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const viewVldn = (req) => {
  const recordid = req.params.recordid;
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!recordid) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const invtUpdateVldn = (req) => {
  const reqBody = JSON.parse(req.body.endUserData);
  if (!req.headers.ctpb2batoken) {
    const tr = sRes.tokenRequired();
    return { flag: false, result: tr };
  } else {
    const bodyVldn = bodyValidation(reqBody);
    const adrs = JSON.parse(req.body.endUserAdrsData);
    const adrsVldn = adrsValidation(adrs);
    if (!req.params.recordid || !bodyVldn || !adrsVldn) {
      const rf = sRes.mandatory();
      return { flag: false, result: rf };
    } else {
      return { flag: true };
    }
  }
}

const euinvStatusVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.params.recordId || !reqBody.status) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const clsdListVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.pgNum || !reqBody.limit || !reqBody.iStatus || !reqBody.startDate || !reqBody.endDate) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

module.exports = {
  tokenVldn, listVldn, inviteCnsltntVldn, postB2bEuInvtntDelete, viewVldn, invtUpdateVldn,
  euinvStatusVldn, clsdListVldn
};

const bodyValidation = (reqBody) => {
  if (reqBody.name && reqBody.fName && reqBody.lName && reqBody.emID && reqBody.dob && reqBody.gender) {
    return true;
  } else {
    return false;
  }
}

const adrsValidation = (adrs) => {
  let vldn = '';
  if (adrs.length > 0) {
    adrs.forEach((item) => {
      if (item.adrsType && item.hNum && item.zip && item.country && item.cCode && item.state && item.sCode && item.city) {
        vldn = true;
      } else {
        vldn = false;
      }
    })
    return vldn;
  } else {
    return false;
  }
}
