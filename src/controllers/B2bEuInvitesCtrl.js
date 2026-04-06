/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

var fs = require('fs');
var multer = require('multer');
var cron = require('node-cron');

const util = require('../lib/util');
const tokens = require('../tokens');
const SetRes = require('../SetRes');
const cs = require('../services/CommonSrvc');
const bEuInvSrvc = require('../services/B2bEuInvitesSrvc');
const bEuInvCv = require('./apiVldns/B2bEuInvitesCtrlVldns');

const apiServerStatus = (req, res) => {
  const resObj = SetRes.apiServerStatus();
  util.sendApiRes(res, resObj);
}

// --- Begin: CronJob for Invitations closed create
cron.schedule('0 0 * * *', () => {
  bEuInvSrvc.createInvtsClsed();
});

const postB2bEuInvite = (req, res) => {
  const vds = bEuInvCv.inviteCnsltntVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvSrvc.postB2bEuInvite(req, tData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const getB2bEuInvitesList = (req, res) => {
  const vds = bEuInvCv.listVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvSrvc.getB2bEuInvitesList(req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const postB2bEuInvtntDelete = (req, res) => {
  const vds = bEuInvCv.postB2bEuInvtntDelete(req);  
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvSrvc.postB2bEuInvtntDelete(req.params.recordId, req.body, tData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const getB2bInvitationView = (req, res) => {
  const vds = bEuInvCv.viewVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvSrvc.getB2bInvitationView(req, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}


var storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    const imgid = await getFolderId(req.params.imgid);
    var uplLoc = 'assets/files/' + imgid;
    if (!fs.existsSync(uplLoc)) {
      fs.mkdirSync(uplLoc);
    }
    callback(null, uplLoc);
  },

  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage }).single('iconFile');

const putB2bUpdateInvite = (req, res, next) => {
  upload(req, res, (err) => {
    const vds = bEuInvCv.invtUpdateVldn(req);
    if (vds.flag) {
      tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
        const tv = bEuInvCv.tokenVldn(tData);
        if (tv.flag) {
          bEuInvSrvc.putB2bUpdateInvite(req, tData.tokenData, (resObj) => {
            const apiRes = {...resObj, userObj: tData?.data};            
            util.sendApiRes(res, apiRes);
          });
        } else {
          if (req.file) {
            const filesPath = [req.file];
            cs.dltFolder(filesPath);
          }
          util.sendApiRes(res, tv.result);
        }
      });
    } else {
      if (req.file) {
        const filesPath = [req.file];
        cs.dltFolder(filesPath);
      }
      util.sendApiRes(res, vds.result);
    }
  });
}

const putB2bEuInvitesStatusUpdate = (req, res) => {
  const vds = bEuInvCv.euinvStatusVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvSrvc.putB2bEuInvitesStatusUpdate(req.params.recordId, req.body, tData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const putB2bEuInvitesAprDelete = (req, res) => {
  const vds = bEuInvCv.postB2bEuInvtntDelete(req);  
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvSrvc.putB2bEuInvitesAprDelete(req.params.recordId, req.body, tData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}


const getB2bEuInvitesClosedList = (req, res) => {
  const vds = bEuInvCv.clsdListVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvSrvc.getB2bEuInvitesClosedList(req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

const getB2bInvitationTeam = (req, res) => {
  const vds = bEuInvCv.viewVldn(req);
  if (vds.flag) {
    tokens.refreshToken(req.headers.ctpb2batoken, res, (tData) => {
      const tv = bEuInvCv.tokenVldn(tData);
      if (tv.flag) {
        bEuInvSrvc.getB2bInvitationTeam(req.params.recordid, req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tv.result);
    });
  } else util.sendApiRes(res, vds.result);
}

module.exports = {
  apiServerStatus, postB2bEuInvite, getB2bEuInvitesList, postB2bEuInvtntDelete,
  getB2bInvitationView, putB2bUpdateInvite, putB2bEuInvitesStatusUpdate, putB2bEuInvitesAprDelete, getB2bEuInvitesClosedList, getB2bInvitationTeam
};

const getFolderId = async (imgid) => {
  if (imgid) {
    return imgid;
  } else {
    const currNum = cs.getCurrNum();
    return currNum;
  }
}