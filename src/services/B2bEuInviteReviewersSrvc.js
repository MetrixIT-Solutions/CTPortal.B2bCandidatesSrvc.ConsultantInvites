/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const bEuRvwNDaoimpl = require('../daos/daosimpls/B2bEuInviteReviewersDaoImpl');
const bEuRvwNDao = require('../daos/B2bEuInviteReviewersDaos');

const postReviewCreate = (reqBody, tData, callback) => {
  const crtObj = bEuRvwNDaoimpl.postReviewCreate(reqBody, tData);
  bEuRvwNDao.postReviewCreate(crtObj, callback);
}

const postReviewersReviewCreate = (reqBody, tData, callback) => {  
  const crtObj = bEuRvwNDaoimpl.setReviewersReview(reqBody, tData);    
  bEuRvwNDao.updateReviewers(crtObj, callback);
}

const getEusrInvAllreviewersList = (uid, tData, callback) => {
  const obj = bEuRvwNDaoimpl.getAllNotesData(uid, tData);
  bEuRvwNDao.getEusrInvAllreviewersList(obj, callback);
}

module.exports = {
  postReviewCreate, postReviewersReviewCreate, getEusrInvAllreviewersList
};
