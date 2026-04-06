/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const util = require('../lib/util');
const tokens = require('../tokens');
const bEuWaSrvc = require('../services/B2bEuInvitesWrkAuthSrvc');
const bEuWaCv = require('./apiVldns/B2bEuInvitesWrkAuthCtrlVldns');

const setB2bUpdateInvtWrkAuth = (req, res) => {
  const vds = bEuWaCv.updateWrkAuthVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuWaCv.tokenVldn(tData);
      if (tv.flag) {
        bEuWaSrvc.setB2bUpdateInvtWrkAuth(req, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

module.exports = {
  setB2bUpdateInvtWrkAuth
};
