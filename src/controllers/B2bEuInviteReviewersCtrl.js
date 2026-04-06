/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const util = require('../lib/util');
const tokens = require('../tokens');
const bEuRewNSrvc = require('../services/B2bEuInviteReviewersSrvc');
const bEuRvwNCv = require('./apiVldns/B2bEuInviteReviewersCtrlVldns');

const postReviewCreate = (req, res) => {  
  const vds = bEuRvwNCv.inviteReviewVldn(req);  
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuRvwNCv.tokenVldn(tData);      
      if (tv.flag) {
        bEuRewNSrvc.postReviewCreate(req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const postReviewersReviewCreate = (req, res) => {  
  const vds = bEuRvwNCv.inviteReviewersReviewVldn(req);  
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuRvwNCv.tokenVldn(tData);      
      if (tv.flag) {
        bEuRewNSrvc.postReviewersReviewCreate(req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const getEusrInvAllreviewersList = (req, res) => {  
  const vds = bEuRvwNCv.getEusrInvAllreviewersList(req);          
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuRvwNCv.tokenVldn(tData);
      if (tv.flag) {
        bEuRewNSrvc.getEusrInvAllreviewersList(req.params.invId, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

module.exports = {
  postReviewCreate, postReviewersReviewCreate, getEusrInvAllreviewersList
}