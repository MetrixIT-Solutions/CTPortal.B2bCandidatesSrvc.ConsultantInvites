/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const util = require('../lib/util');
const tokens = require('../tokens');
const bEuInvCertsSrvc = require('../services/B2BEuInviteCertsSrvc');
const bEuInvCertsCv = require('./apiVldns/B2BEuInviteCertsCtrlVldns');

const setB2bInvtCertsUpdate = (req, res) => {
  const vds = bEuInvCertsCv.updateCertsVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvCertsCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvCertsSrvc.setB2bInvtCertsUpdate(req, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const deleteB2bInvtCerts = (req, res) => {
  const vds = bEuInvCertsCv.deleteCertsVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvCertsCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvCertsSrvc.deleteB2bInvtCerts(req.params.recordid, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}


module.exports = {
  setB2bInvtCertsUpdate, deleteB2bInvtCerts
};
