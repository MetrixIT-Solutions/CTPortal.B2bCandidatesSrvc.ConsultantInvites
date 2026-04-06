/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../../SetRes');
const bEuInvEdsDaosimpl = require('../../daos/daosimpls/B2bEuInvitesEdsDaosImpl');
const bEuInvEdsDao = require('../../daos/B2bEuInvitesEdsDaos');

const setEducationData = (req, tData, callback) => {
  edcntData(0, req, req.body.edcnData, [], tData, callback);
}

module.exports = {
  setEducationData
};

const edcntData = (i, req, edcnData, arrRes, tData, callback) => {
  if (i < edcnData.length) {
    const data = edcnData[i];
    if (data.id) {
      const query = bEuInvEdsDaosimpl.viewEdcObj(data.id, tData)
      const upObj = bEuInvEdsDaosimpl.updateEdcObj(data, tData);
      bEuInvEdsDao.updateB2bInvtEdcn(query, upObj, (resObj1) => {
        if (resObj1.status == '200') {
          arrRes.push(resObj1.resData.result);
        }
        edcntData(i + 1, req, edcnData, arrRes, tData, callback);
      });
    } else {
      const body = { ...data, invitationId: req.params.invId }
      const obj = bEuInvEdsDaosimpl.createEdcObj(body, tData);
      bEuInvEdsDao.commonCreateFunc(obj, (resObj2) => {
        if (resObj2.status == '200') {
          arrRes.push(resObj2.resData.result);
        }
        edcntData(i + 1, req, edcnData, arrRes, tData, callback);
      });
    }
  } else {
    if (arrRes.length) {
      const sr = SetRes.successRes(arrRes);
      callback(sr);
    } else {
      if (edcnData[0].id) {
        const uf = SetRes.updateFailed({});
        callback(uf);
      } else {
        const cf = SetRes.createFailed({});
        callback(cf);
      }
    }
  }
}