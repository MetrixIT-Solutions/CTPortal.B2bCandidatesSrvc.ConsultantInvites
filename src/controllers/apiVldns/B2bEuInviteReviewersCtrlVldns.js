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

const inviteReviewVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.ids || !reqBody.names) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const inviteReviewersReviewVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.rvId || !reqBody.review) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const getEusrInvAllreviewersList = (req) => {
  if (!req.headers.ctpb2batoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if(!req.params.invId) {
    const mn = sRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

module.exports = {
  tokenVldn, inviteReviewVldn, inviteReviewersReviewVldn, getEusrInvAllreviewersList
}