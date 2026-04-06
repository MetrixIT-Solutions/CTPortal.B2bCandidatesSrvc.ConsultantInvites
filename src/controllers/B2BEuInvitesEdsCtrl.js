/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const util = require('../lib/util');
const tokens = require('../tokens');
const bEuInvEdsSrvc = require('../services/B2bEuInvitesEdsSrvc');
const bEuInvEdsCv = require('./apiVldns/B2BEuInvitesEdsCtrlVldns');

const setB2bInvtEdcUpdate = (req, res) => {
  const vds = bEuInvEdsCv.updateEdcVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvEdsCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvEdsSrvc.setB2bInvtEdcUpdate(req, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const deleteB2bInvtEdc = (req, res) => {
  const vds = bEuInvEdsCv.deleteEdcVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvEdsCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvEdsSrvc.deleteB2bInvtEdc(req.params.recordid, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}


module.exports = {
  setB2bInvtEdcUpdate, deleteB2bInvtEdc
};
