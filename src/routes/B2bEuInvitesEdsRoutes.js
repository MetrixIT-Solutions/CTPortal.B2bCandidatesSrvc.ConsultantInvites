/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvWEdsCtrl = require('../controllers/B2BEuInvitesEdsCtrl');

module.exports.controller = (app) => {

  app.post('/ctpb2b/v1/eusr/invitation/set-education/:invId', bEuInvWEdsCtrl.setB2bInvtEdcUpdate);
  app.delete('/ctpb2b/v1/eusr/invitation/education/delete/:recordid', bEuInvWEdsCtrl.deleteB2bInvtEdc);
  
};
