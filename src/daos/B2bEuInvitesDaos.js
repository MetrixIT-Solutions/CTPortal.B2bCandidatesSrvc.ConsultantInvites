/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const B2BEuInvites = require('../schemas/B2BEuInvites');
const B2BEuInvitesAdrs = require('../schemas/B2BEuInvitesAdrs');
const B2BEuInvCerts = require('../schemas/B2BEuInvitesCerts');
const B2BEuInvEds = require('../schemas/B2BEuInvitesEds');
const B2BEuInvWrkAuths = require('../schemas/B2BEuInvitesWrkAuths');
const B2BEuInvWrkExp = require('../schemas/B2BEuInvitesWrkExps');
const {uniq} = require('../consts/B2bEuInvitesConsts.json');
const B2BEuInvitesAll = require('../schemas/B2BEuInvitesAll');
const B2BEuInvitesClsd = require('../schemas/B2BEuInvitesClsd');

const getInvitationsData = (query, callback) => {
  B2BEuInvites.find(query).then((resObj) => {
    if (resObj && resObj.length) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at getInvitationsData:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

const deleteb2bEuInvts = (query, callback) => {
  B2BEuInvites.deleteMany(query).then((resObj) => {
    if (resObj && resObj.deletedCount > 0) {
      const result = SetRes.successRes('Deleted Successfully');
      callback(result);
    } else {
      const uf = SetRes.deleteFailed([]);
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at deleteb2bEuInvts:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  })
}

const commonCreateFunc = (createObj, callback) => {
  createObj.save().then((resObj) => {
    if (resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const sf = SetRes.createFailed({});
      callback(sf);
    }
  }).catch((error) => {
    if (error.keyPattern && error.keyPattern.myPrimary) {
      logger.error('Uniqueness(myPrimary) Error in daos/B2bEuInvitesDaos.js, at commonCreateFunc:' + error);
      const err = SetRes.uniqueErr(uniq.emlErr);
      callback(err);
    } else if (error.keyPattern && error.keyPattern.refUID) {
      logger.error('Uniqueness(refUID) Error in daos/B2bEuInvitesDaos.js, at commonCreateFunc:' + error);
      const err = SetRes.uniqueErr(uniq.uidErr);
      callback(err);
    } else {
      logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at commonCreateFunc:' + error);
      const err = SetRes.unKnownErr({});
      callback(err);
    }
  });
}

const getB2bEuInvitesList = (query, body, callback) => {
  const { pgNum, limit } = body;
  let resultObj = { invitationsListCount: 0, invitationsList: [] };
  B2BEuInvites.find(query).skip((pgNum - 1) * limit).limit(limit).sort({ cDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      invtsTotalCount(query, resObj, callback);
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at getB2bEuInvitesList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const getB2bCnsltntData = (query, callback) => {
  B2BEuInvites.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at getB2bCnsltntData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getB2bInvitationView = (query, callback) => {
  B2BEuInvites.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj[0]);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at getB2bInvitationView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const updateB2bInvt = (query, updateObj, callback) => {
  B2BEuInvites.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    if (error.keyPattern && error.keyPattern.myPrimary) {
      logger.error('Uniqueness(myPrimary) Error in daos/B2bEuInvitesDaos.js, at updateB2bInvt:' + error);
      const err = SetRes.uniqueErr(uniq.emlErr);
      callback(err);
    } else if (error.keyPattern && error.keyPattern.refUID) {
      logger.error('Uniqueness(refUID) Error in daos/B2bEuInvitesDaos.js, at updateB2bInvt:' + error);
      const err = SetRes.uniqueErr(uniq.uidErr);
      callback(err);
    } else {
      logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at updateB2bInvt:' + error);
      const err = SetRes.unKnownErr({});
      callback(err);
    }
  });
}

const updateb2bEuInvtsAdrs = (query, updateObj, callback) => {
  B2BEuInvitesAdrs.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at updateb2bEuInvtsAdrs:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const deleteb2bEuInvtAdrs = (query, callback) => {
  B2BEuInvitesAdrs.deleteOne(query).then((resObj) => {
    if (resObj && resObj.deletedCount > 0) {
      const result = SetRes.successRes('Deleted Successfully');
      callback(result);
    } else {
      const uf = SetRes.deleteFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at deleteb2bEuInvtAdrs:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const getB2bEuAdrsData = (query, callback) => {
  B2BEuInvitesAdrs.find(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2BEuInvitesDaos.js, at getB2bEuAdrsData:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}
const getB2bEuInvCertsData = (query, callback) => {
  B2BEuInvCerts.find(query).then((resObj) => {
    if (resObj && resObj.length) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2BEuInvitesDaos.js, at getB2bEuInvCertsData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}
const getB2bEuInvEdsData = (query, callback) => {
  B2BEuInvEds.find(query).then((resObj) => {
    if (resObj && resObj.length) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2BEuInvitesDaos.js, at getB2bEuInvEdsData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}
const getB2bEuInvWrkAuthsData = (query, callback) => {
  B2BEuInvWrkAuths.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2BEuInvitesDaos.js, at getB2bEuInvWrkAuthsData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getB2bEuInvWrkExpData = (query, callback) => {
  B2BEuInvWrkExp.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2BEuInvitesDaos.js, at getB2bEuInvWrkExpData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const invitesAggregateQuery = (query, callback) => {
  B2BEuInvites.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2BEuInvitesDaos.js, at invitesAggregateQuery:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

const getB2bInvtAllData = (query, callback) => {
  B2BEuInvitesAll.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at getB2bInvtAllData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const updateB2bInvAll = (query, updateObj, callback) => {
  B2BEuInvitesAll.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at updateB2bInvAll:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const getB2bEuInvitesListClsd = (query, body, callback) => {
  const { pgNum, limit } = body;
  let resultObj = { invitationsListCount: 0, invitationsList: [] };
  B2BEuInvitesClsd.find(query).skip((pgNum - 1) * limit).limit(limit).sort({ cDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      invtsTotalCount(query, resObj, callback);
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at getB2bEuInvitesListClsd:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const getB2bEuInvitesClsdUpdate = (query, updateObj, callback) => {
  B2BEuInvitesClsd.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at getB2bEuInvitesClsdUpdate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}
const deleteB2bInvt = (query, callback) => {
  B2BEuInvites.findOneAndDelete(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2BEuInvitesDaos.js, at invitesAggregateQuery:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

module.exports = {
  getInvitationsData, deleteb2bEuInvts, commonCreateFunc, getB2bEuInvitesList, getB2bCnsltntData,
  getB2bInvitationView, updateB2bInvt, updateb2bEuInvtsAdrs, deleteb2bEuInvtAdrs, getB2bEuAdrsData,
  getB2bEuInvCertsData, getB2bEuInvEdsData, getB2bEuInvWrkAuthsData, getB2bEuInvWrkExpData, invitesAggregateQuery,
  getB2bInvtAllData, updateB2bInvAll, getB2bEuInvitesListClsd, getB2bEuInvitesClsdUpdate, deleteB2bInvt
};

const invtsTotalCount = (query, resObj, callback) => {
  let resultObj = { invitationsListCount: resObj.length, invitationsList: resObj };
  B2BEuInvites.countDocuments(query).then((resultCount) => {
    if (resultCount) {
      resultObj = { invitationsListCount: resultCount, invitationsList: resObj };
      const result = SetRes.successRes(resultObj);
      callback(result);
    } else {
      const result = SetRes.successRes(resultObj);
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/B2bEuInvitesDaos.js, at invtsTotalCount:' + error);
    const result = SetRes.successRes(resultObj);
    callback(result);
  });
}
