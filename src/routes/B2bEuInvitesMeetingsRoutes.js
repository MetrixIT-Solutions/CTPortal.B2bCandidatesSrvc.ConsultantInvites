/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvMtCtrl = require('../controllers/B2bEuInvitesMeetingsCtrl');

module.exports.controller = (app) => {

  app.post('/ctpb2b/v1/eusr/meetings/create', bEuInvMtCtrl.postEusInvrMeetingsCreate);
  app.post('/ctpb2b/v1/eusr/meetings/list/:recordId', bEuInvMtCtrl.postEusrInvInvMeetingsList);
  app.put('/ctpb2b/v1/eusr/meetings/reschedule/:recordId', bEuInvMtCtrl.putEusrInvInvMeetingsReschedule);
  app.put('/ctpb2b/v1/eusr/meetings/status-update/:recordId', bEuInvMtCtrl.putEuInvtsMeetingsStatusUpdate);

};