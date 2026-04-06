/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const util = require('../lib/util');
const tokens = require('../tokens');
const bEuInvMtSrvc = require('../services/B2bEuInvitesMeetingsSrvc');
const bEuMtCv = require('./apiVldns/B2bEuMeetingsCtrlVldns');

const postEusInvrMeetingsCreate = (req, res) => {
  const vds = bEuMtCv.eumtCrtVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuMtCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvMtSrvc.postEusInvrMeetingsCreate(req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const postEusrInvInvMeetingsList = (req, res) => {
  const vds = bEuMtCv.eumtListVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuMtCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvMtSrvc.postEusrInvInvMeetingsList(req.params.recordId, req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const putEusrInvInvMeetingsReschedule = (req, res) => {
  const vds = bEuMtCv.eumtRscVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuMtCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvMtSrvc.putEusrInvInvMeetingsReschedule(req.params.recordId, req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const putEuInvtsMeetingsStatusUpdate = (req, res) => {
  const vds = bEuMtCv.eumtStsUpdateVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuMtCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvMtSrvc.putEuInvtsMeetingsStatusUpdate(req.params.recordId, req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

module.exports = {
  postEusInvrMeetingsCreate, postEusrInvInvMeetingsList, putEusrInvInvMeetingsReschedule, putEuInvtsMeetingsStatusUpdate
};
