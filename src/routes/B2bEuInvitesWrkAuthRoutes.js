/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvWaCtrl = require('../controllers/B2bEuInvitesWrkAuthCtrl');

module.exports.controller = (app) => {

  app.post('/ctpb2b/v1/eusr/invitation/set-workauth/:invId', bEuInvWaCtrl.setB2bUpdateInvtWrkAuth);
  
};
