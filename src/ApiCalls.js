/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

var axios = require('axios');
var config = require('config');

const inviteCnsltnt= (ctpb2batoken, ctpb2bua, data, callback) => {
  const headers = { headers: {ctpb2batoken, ctpb2bua} };
  axios.post(config.inviteCnsltntApi, data, headers)
    .then((res) => callback(null, res.data)).catch((err) => callback(err, null));
}

const inviteEuInfo = (data, ctpb2batoken, callback) => {
  const headers = { headers: {ctpb2batoken} };
  axios.post(config.inviteEuInfoApi, data, headers)
    .then((res) => callback(null, res.data)).catch((err) => callback(err, null));
}

const deleteInvUsr = (recordId, ctpb2batoken, data, callback) => {
  const headers = { ctpb2batoken };
  axios.delete(config.dltconsltApi + recordId, {data, headers}).then((res) => callback(err, res.data)).catch((err) => callback(err, null));
}

const getSmtpDetails = (body, callback) => {
  axios.post(config.getSmtpDetailsApi, body, {}).then((res) => callback(null, res.data)).catch((err) => callback(err, null));
}

const updatePpArvd = (type, recordId, ctpb2batoken, callback) => {
  const headers = { headers: {ctpb2batoken} };
  if(type == 'Petition'){
    axios.put(config.petitionAprvdUpdateApi + recordId, {}, headers)
      .then((res) => callback(null, res.data)).catch((err) => callback(err, null));
  } else {
    axios.put(config.ofrLtrAprvdUpdateApi + recordId, {}, headers)
      .then((res) => callback(null, res.data)).catch((err) => callback(err, null));
  }
}

module.exports = {
  inviteCnsltnt, inviteEuInfo, deleteInvUsr, getSmtpDetails, updatePpArvd
};
