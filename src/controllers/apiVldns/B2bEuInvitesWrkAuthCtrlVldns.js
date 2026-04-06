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

const updateWrkAuthVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpb2batoken) {
    const tr = sRes.tokenRequired();
    return { flag: false, result: tr };
  } else {
    const bodyVldn = bodyValidation(reqBody);
    if (!req.params.invId ||!bodyVldn) {
      const rf = sRes.mandatory();
      return { flag: false, result: rf };
    } else {
      return { flag: true };
    }
  }
}
module.exports = {
  tokenVldn, updateWrkAuthVldn
};

const bodyValidation = (reqBody) => {
  if (reqBody.nationality && reqBody.psprtNum && reqBody.psprtDocNum && reqBody.psprtIssDt && reqBody.psprtIssDtStr && reqBody.psprtExpDt && reqBody.psprtExpDtStr) {
    return true;
  } else {
    return false;
  }
}

