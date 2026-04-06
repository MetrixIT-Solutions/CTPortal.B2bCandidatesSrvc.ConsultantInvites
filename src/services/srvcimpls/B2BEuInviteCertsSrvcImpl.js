/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../../SetRes');
const bEuInvCertsDaosimpl = require('../../daos/daosimpls/B2BEuInviteCertsDaosImpl');
const bEuInvCertsDao = require('../../daos/B2BEuInviteCertsDaos');

const setCertsData = (req, tData, callback) => {
  certsData(0, req, req.body.certsData, [], tData, callback);
}

module.exports = {
  setCertsData
};

const certsData = (i, req, crtfts, arrRes, tData, callback) => {
  if (i < crtfts.length) {
    const data = crtfts[i];
    if (data.id) {
      const query = bEuInvCertsDaosimpl.viewCertsObj(data.id, tData)
      const upObj = bEuInvCertsDaosimpl.updateCertsObj(data, tData);
      bEuInvCertsDao.updateB2bInvtCerts(query, upObj, (resObj1) => {
        if (resObj1.status == '200') {
          arrRes.push(resObj1.resData.result);
        }
        certsData(i + 1, req, crtfts, arrRes, tData, callback);
      });
    } else {
      const body = { ...data, invitationId: req.params.invId }
      const obj = bEuInvCertsDaosimpl.createCertsObj(body, tData);
      bEuInvCertsDao.commonCreateFunc(obj, (resObj2) => {
        if (resObj2.status == '200') {
          arrRes.push(resObj2.resData.result);
        }
        certsData(i + 1, req, crtfts, arrRes, tData, callback);
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