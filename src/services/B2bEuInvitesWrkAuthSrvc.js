/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const bEuWaDaosimpl = require('../daos/daosimpls/B2bEuInvitesWrkAuthDaoImpl');
const bEuWaDao = require('../daos/B2bEuInvitesWrkAuthDaos');

const setB2bUpdateInvtWrkAuth = (req, tData, callback) => {
  const reqBody = req.body;
  if (reqBody.id) {
    const query = bEuWaDaosimpl.viewWrkAuthObj(reqBody, tData);
    const upObj = bEuWaDaosimpl.updateWrkAuthObj(reqBody, tData);
    bEuWaDao.updateB2bCnsltnWrkAuth(query, upObj, callback);
  } else {
    const obj = bEuWaDaosimpl.createWrkAuthObj(req.params.invId, reqBody, tData);
    bEuWaDao.commonCreateFunc(obj, callback);
  }
}

module.exports = {
  setB2bUpdateInvtWrkAuth
}