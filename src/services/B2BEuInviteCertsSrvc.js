/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvCertsDaosimpl = require('../daos/daosimpls/B2BEuInviteCertsDaosImpl');
const bEuInvCertsDao = require('../daos/B2BEuInviteCertsDaos');
const bEuInvCertsSrvcImpl = require('./srvcimpls/B2BEuInviteCertsSrvcImpl')

const setB2bInvtCertsUpdate = (req, tData, callback) => {
  bEuInvCertsSrvcImpl.setCertsData(req, tData, callback);
}

const deleteB2bInvtCerts = (id, tData, callback) => {
  const query = bEuInvCertsDaosimpl.viewCertsObj(id, tData);
  bEuInvCertsDao.deleteB2bInvtCerts(query, callback);
}

module.exports = {
  setB2bInvtCertsUpdate, deleteB2bInvtCerts
}
