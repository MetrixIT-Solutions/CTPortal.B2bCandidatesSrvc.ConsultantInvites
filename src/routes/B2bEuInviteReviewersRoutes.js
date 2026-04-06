/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */
const bEuRvwCtrl = require('../controllers/B2bEuInviteReviewersCtrl');

module.exports.controller = (app) => {
  app.post('/ctpb2b/v1/eusr/invite/reviewers/create', bEuRvwCtrl.postReviewCreate);
  app.post('/ctpb2b/v1/eusr/invite/reviewers/review-create', bEuRvwCtrl.postReviewersReviewCreate);
  app.get('/ctpb2b/v1/eusr/invite/reviewers/list/:invId', bEuRvwCtrl.getEusrInvAllreviewersList);
};
