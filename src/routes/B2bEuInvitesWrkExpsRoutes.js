/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvWExpCtrl = require('../controllers/B2bEuInvitesWrkExpsCtrl');

module.exports.controller = (app) => {

  app.post('/ctpb2b/v1/eusr/invitation/set-wrkexp/:invId', bEuInvWExpCtrl.setB2bUpdateInvtWrkExp);
  app.put('/ctpb2b/v1/eusr/invitation/wrkexp/emp/delete/:recordid/:empid', bEuInvWExpCtrl.deleteB2bInvtWrkExpEmp);

};
