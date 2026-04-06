/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvEdsDaosimpl = require('../daos/daosimpls/B2bEuInvitesEdsDaosImpl');
const bEuInvEdsDao = require('../daos/B2bEuInvitesEdsDaos');
const bEuInvEdsSrvcImpl = require('./srvcimpls/B2bEuInvitesEdsSrvcImpl')

const setB2bInvtEdcUpdate = (req, tData, callback) => {
  bEuInvEdsSrvcImpl.setEducationData(req, tData, callback);
}

const deleteB2bInvtEdc = (id, tData, callback) => {
  const query = bEuInvEdsDaosimpl.viewEdcObj(id, tData);
  bEuInvEdsDao.deleteB2bInvtEdc(query, callback);
}

module.exports = {
  setB2bInvtEdcUpdate, deleteB2bInvtEdc
}
