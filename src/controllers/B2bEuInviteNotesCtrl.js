/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const util = require('../lib/util');
const tokens = require('../tokens');
const bEuInvNSrvc = require('../services/B2bEuInviteNotesSrvc');
const bEuInvNCv = require('./apiVldns/B2bEuInviteNotesCtrlVldns');

const postEusrInvNotesCreate = (req, res) => {
  const vds = bEuInvNCv.inviteNotestVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvNCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvNSrvc.postEusrInvNotesCreate(req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const getEusrInvNotesList = (req, res) => {
  const vds = bEuInvNCv.userInvNotesVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvNCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvNSrvc.getEusrInvNotesList(req.params.recordId, req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}


const postB2bEuOnBrdNtsCreate = (req, res) => {
  const vds = bEuInvNCv.euonBrdNtsCrtVldn(req);  
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvNCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvNSrvc.postB2bEuOnBrdNtsCreate(req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const getB2bEuOnBrdNtsList = (req, res) => {  
  const vds = bEuInvNCv.euonBrdNtsListVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvNCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvNSrvc.getB2bEuOnBrdNtsList(req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const putB2bEuOnBrdNtsUpdate = (req, res) => {
  const vds = bEuInvNCv.euonBrdNtsUpdateVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvNCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvNSrvc.putB2bEuOnBrdNtsUpdate(req.body, req.params.id, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

module.exports = {
  postEusrInvNotesCreate, getEusrInvNotesList, postB2bEuOnBrdNtsCreate, getB2bEuOnBrdNtsList, putB2bEuOnBrdNtsUpdate
};
