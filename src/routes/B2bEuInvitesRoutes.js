/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvCtrl = require('../controllers/B2bEuInvitesCtrl');

module.exports.controller = (app) => {

  app.get('/', bEuInvCtrl.apiServerStatus);

  app.post('/ctpb2b/v1/eusr/invitations/create', bEuInvCtrl.postB2bEuInvite);
  app.post('/ctpb2b/v1/eusr/invitations/list', bEuInvCtrl.getB2bEuInvitesList);
  app.delete('/ctpb2b/v1/eusr/invitations/delete/:recordId', bEuInvCtrl.postB2bEuInvtntDelete);
  app.get('/ctpb2b/v1/eusr/invitation/view/:recordid', bEuInvCtrl.getB2bInvitationView);
  app.put('/ctpb2b/v1/eusr/invitation/update/:recordid/:imgid', bEuInvCtrl.putB2bUpdateInvite);
  app.put('/ctpb2b/v1/eusr/invitations/status/update/:recordId', bEuInvCtrl.putB2bEuInvitesStatusUpdate);
  app.delete('/ctpb2b/v1/eusr/invitations/approve/delete/:recordId', bEuInvCtrl.putB2bEuInvitesAprDelete);
  app.post('/ctpb2b/v1/eusr/invitations/clsd-list', bEuInvCtrl.getB2bEuInvitesClosedList);
  app.post('/ctpb2b/v1/eusr/invitation/team/:recordid', bEuInvCtrl.getB2bInvitationTeam);

};
