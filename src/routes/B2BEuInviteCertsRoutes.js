/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvCertsCtrl = require('../controllers/B2BEuInviteCertsCtrl');

module.exports.controller = (app) => {

  app.post('/ctpb2b/v1/eusr/invitation/set-certificates/:invId', bEuInvCertsCtrl.setB2bInvtCertsUpdate);
  app.delete('/ctpb2b/v1/eusr/invitation/certificate/delete/:recordid', bEuInvCertsCtrl.deleteB2bInvtCerts);
  
};
