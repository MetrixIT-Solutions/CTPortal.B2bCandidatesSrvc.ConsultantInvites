/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const axios = require('axios'); 
const config = require('config');

const getB2bUserSsn = (tData, callback) => {
  axios.post(config.ssnApi, tData).then((res) => callback(null, res.data)).catch((err) => callback(err, {}));
}

const getB2BUserRlsAcsRoleUser = (ctpb2batoken, callback) => {
  const headers = { headers: {ctpb2batoken} };
  axios.post(config.roleApi, {}, headers).then((res) => callback(null, res.data)).catch((err) => callback(err, {}));
}

module.exports = { getB2bUserSsn, getB2BUserRlsAcsRoleUser };
