/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const bEuWExpDaosimpl = require('../daos/daosimpls/B2bEuInvitesWrkExpsDaosImpl');
const bEuWExpDao = require('../daos/B2bEuInvitesWrkExpsDaos');

const setB2bUpdateInvtWrkExp = (req, tData, callback) => {
  const reqBody = req.body;
  if (reqBody.id) {
    const query = bEuWExpDaosimpl.viewWrkExpObj(reqBody.id, tData);
    const upObj = bEuWExpDaosimpl.updateWrkExpObj(reqBody, tData);
    bEuWExpDao.setB2bUpdateInvtWrkExp(query, upObj, callback);
  } else {
    const obj = bEuWExpDaosimpl.createWrkExpObj(req.params.invId, reqBody, tData);
    bEuWExpDao.commonCreateFunc(obj, callback);
  };
}

const deleteB2bInvtWrkExpEmp = (req, tData, callback) => {
  const query = bEuWExpDaosimpl.viewWrkExpObj(req.params.recordid, tData);
  const upObj = bEuWExpDaosimpl.deleteEmpObj(req.params.empid, tData);
  bEuWExpDao.setB2bUpdateInvtWrkExp(query, upObj, callback);
}

module.exports = {
  setB2bUpdateInvtWrkExp, deleteB2bInvtWrkExpEmp
}