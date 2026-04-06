
/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const bEuInvNCtrl = require('../controllers/B2bEuInviteNotesCtrl');

module.exports.controller = (app) => {

  app.post('/ctpb2b/v1/eusr/invite/notes/create', bEuInvNCtrl.postEusrInvNotesCreate);
  app.post('/ctpb2b/v1/eusr/invite/notes/list/:recordId', bEuInvNCtrl.getEusrInvNotesList);

  app.post('/ctpb2b/v1/eusr/invite/bytype/create/notes', bEuInvNCtrl.postB2bEuOnBrdNtsCreate);
  app.post('/ctpb2b/v1/eusr/invite/bytype/list/notes', bEuInvNCtrl.getB2bEuOnBrdNtsList);
  app.put('/ctpb2b/v1/eusr/invite/bytype/update/notes/:id', bEuInvNCtrl.putB2bEuOnBrdNtsUpdate);

};
