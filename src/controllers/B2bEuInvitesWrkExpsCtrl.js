/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const util = require('../lib/util');
const tokens = require('../tokens');
const bEuWExpSrvc = require('../services/B2bEuInvitesWrkExpsSrvc');
const bEuWExpCv = require('./apiVldns/B2bEuInvitesWrkExpsCtrlVldns');

const setB2bUpdateInvtWrkExp = (req, res) => {
  const vds = bEuWExpCv.updateWrkExpVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuWExpCv.tokenVldn(tData);
      if (tv.flag) {
        bEuWExpSrvc.setB2bUpdateInvtWrkExp(req, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const deleteB2bInvtWrkExpEmp = (req, res) => {
  const vds = bEuWExpCv.deleteWrkExpVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuWExpCv.tokenVldn(tData);
      if (tv.flag) {
        bEuWExpSrvc.deleteB2bInvtWrkExpEmp(req, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}


module.exports = {
  setB2bUpdateInvtWrkExp, deleteB2bInvtWrkExpEmp
};
