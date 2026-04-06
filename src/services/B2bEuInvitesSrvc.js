/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const async = require('async');

const cs = require('./CommonSrvc');
const SetRes = require('../SetRes');
const B2BEuInvitesClsd = require('../schemas/B2BEuInvitesClsd');
const bEuInvDaoimpl = require('../daos/daosimpls/B2bEuInvitesDaosImpl');
const bEuInvDao = require('../daos/B2bEuInvitesDaos');
const bEuInvSrvcImpl = require('./srvcimpls/B2bEuInvitesSrvcImpl')
const { errMsgs } = require('../consts/B2bEuInvitesConsts.json');
const ApiCalls = require('../ApiCalls');
const logger = require('../lib/logger');

const createInvtsClsed = () => {
  const qry = bEuInvDaoimpl.getInvitesData();
  bEuInvDao.getInvitationsData(qry, (resObj) => {
    if (resObj.status == '200') {
      bEuInvSrvcImpl.createMultipleInvitesData(resObj.resData.result, (resObj1) => {});
    }
  });
}

const postB2bEuInvite = (req, tData, callback) => {
  const reqBody = req.body;
  const query = bEuInvDaoimpl.getInvDataByMail(reqBody, tData.tokenData);
  bEuInvDao.getB2bInvtAllData(query, (resObj) => {
    if (resObj.status == '200') {
      const data = resObj.resData.result;
      if (reqBody.resendInvtn && data.iStatus !== 'Approved') {
        bEuInvSrvcImpl.resendInvtn(req, resObj, tData, callback);
        const upObj = bEuInvDaoimpl.updateInvtObj(reqBody, {}, 'create', tData.tokenData);
        bEuInvDao.updateB2bInvt(query, upObj, (resObj1) => {
          if(resObj1.status == '200'){
            bEuInvDao.updateB2bInvAll(query, upObj, (resObj2) => {});
          }
        });
      } else {
        const ue = SetRes.uniqueErr({status: data.iStatus, report: data.report, msg: errMsgs.reInvMsg, rprtName: data.rprtName});
        callback(ue);
      }
    } else {
      const acTknGen = cs.generateAccessToken();
      bEuInvSrvcImpl.sendInvitationMail(reqBody, acTknGen, tData, (err, smsRes) => {
        if (smsRes && smsRes.accepted && smsRes.accepted.length) {
          let b2bua = JSON.parse(req.headers.ctpb2bua);
          b2bua.ip = req.ip || b2bua.ip;
          const ctpb2bua = JSON.stringify(b2bua);
          bEuInvSrvcImpl.createInviteAcc(ctpb2bua, reqBody, tData, acTknGen, callback);
        } else {
          logger.error('Un-known Error in srvcimpls/B2bEuInvitesSrvc.js, at postB2bEuInvite - sendInvitationMail:' + err);
          const ue = SetRes.unKnownErr(errMsgs.invFld);
          callback(ue);
        }
      });
    }
  });
}

const getB2bEuInvitesList = (reqBody, tData, callback) => {
  const obj = bEuInvDaoimpl.invtsListObj(reqBody, tData);
  bEuInvSrvcImpl.getB2InvitesListWithAsync(obj.matchQuery, obj.countQuery, reqBody, callback);
}

const postB2bEuInvtntDelete = (recordId, reqBody, tData, callback) => {
  const obj = bEuInvDaoimpl.postB2bEuInvtntDelete(recordId, reqBody, tData.tokenData);
  bEuInvDao.deleteB2bInvt(obj.query, resObj => {
    if(resObj.status == '200') {
      const result = SetRes.successRes('Inivitation deleted successfully');
      callback(result);
      bEuInvDao.updateB2bInvAll(obj.query, obj.deleteObj, resObj1 => {
        if(resObj1.status == '200') {
          const clsdObj = Object.assign({}, resObj.resData.result.toObject());
          const invtclsdCrt = {...clsdObj, ...obj.delClsdObj};
          const crtObj = new B2BEuInvitesClsd(invtclsdCrt);
          bEuInvDao.commonCreateFunc(crtObj, (resData) => {});
        }
      });
      ApiCalls.deleteInvUsr(recordId, tData.ctpb2batoken, reqBody, (err, resData) => {});
    } else {
      const result = SetRes.deleteFailed();
      callback(result);
    }
  });
}

const getB2bInvitationView = (req, tData, callback) => {
  const obj = bEuInvDaoimpl.getInvQry(req.params.recordid, tData.b2b);
  bEuInvDao.getB2bCnsltntData(obj, (resObj) => {
    if(resObj.status == '200'){
      const uiQry = bEuInvDaoimpl.getUiQry(req.params.recordid, tData.b2b);
      asyncFunct(uiQry, resObj, (resObj1) => {
          const {euInvD, euInvAdrs, euInvEds, euInvWAuth, euInvWExp, euInvCerts} = resObj1;
          const data = Object.assign({}, euInvD.toObject());
          const euInv = { ...data, address: euInvAdrs, education: euInvEds, workAuths: euInvWAuth && euInvWAuth._id ? [euInvWAuth] : [], wrkExps: euInvWExp && euInvWExp._id ? [euInvWExp] : [], certs:  euInvCerts};
          callback(SetRes.successRes(euInv));
      });
    } else {
      callback(resObj);
    }
  });
}

const putB2bUpdateInvite = (req, tData, callback) => {
  const reqBody = JSON.parse(req.body.endUserData);
  const file = req.file || {};
  const body = { ...reqBody };
  const query = bEuInvDaoimpl.viewInvtObj(req.params.recordid, tData);
  const upObj = bEuInvDaoimpl.updateInvtObj(body, file, 'update', tData);
  bEuInvDao.updateB2bInvt(query, upObj, (resObj) => {
    if (resObj.status == '200') {
      const adrsData = JSON.parse(req.body.endUserAdrsData);
      bEuInvDao.updateB2bInvAll(query, upObj, (resObj2) => {});
      bEuInvSrvcImpl.endUserAdrsCreate(adrsData, resObj.resData.result, tData);
      bEuInvSrvcImpl.euInvtImgUpdate(req);
    } else {
      if (req.file) {
        const filesPath = [req.file];
        cs.dltFolder(filesPath);
      }
    }
    callback(resObj);
  });
}

const putB2bEuInvitesStatusUpdate = (recordId, reqBody, tData, cb) => {
  const qry = bEuInvDaoimpl.getInvQry(recordId, tData.tokenData.b2b);
  const uObj = bEuInvDaoimpl.setInvStsUpdateData(reqBody, tData.tokenData);
  bEuInvDao.updateB2bInvt(qry, uObj, resObj => {
    if (resObj.status == '200') {
      bEuInvDao.updateB2bInvAll(qry, uObj, (resObj2) => {});
      reqBody.status == 'Submitted' && bEuInvSrvcImpl.sendEmail(resObj.resData.result, tData.tokenData, (err, resData) => {});
      if (reqBody.status == 'Approved') {
        cb(resObj);
        const uiQry = bEuInvDaoimpl.getUiQry(recordId, tData.tokenData.b2b);
        asyncFunct(uiQry, resObj, (resObj1) => {
          if(resObj1.key == 'Success'){
            const {euInvD, euInvAdrs, euInvCerts, euInvEds, euInvWAuth, euInvWExp} = resObj1;
            const data1 = Object.assign({}, euInvD.toObject());
            const euInv = { ...reqBody, ...data1 };
            const data = {euInv, euInvAdrs, euInvCerts, euInvEds, euInvWAuth, euInvWExp};
            ApiCalls.inviteEuInfo(data, tData.ctpb2batoken, (err, invRes) => {
              invRes.status == '200' && bEuInvSrvcImpl.sendApprovedEmail(invRes.resData.result, tData.tokenData, (err, resData) => {});
             });
          } else {
            cb(resObj);
          }
        });
        resObj.resData.result.iFrom == 'Petition' && ApiCalls.updatePpArvd(resObj.resData.result.iFrom, recordId, tData.ctpb2batoken, (err, resObj) => {});
        resObj.resData.result.iFrom == 'Offer Letter' && ApiCalls.updatePpArvd(resObj.resData.result.iFrom, recordId, tData.ctpb2batoken, (err, resObj) => {});
      } else {
        cb(resObj);
      }
    } else if(resObj.status == '195' && reqBody.cnsKey){
        bEuInvDao.getB2bEuInvitesClsdUpdate(qry, uObj, (resObj2) => {});
        cb(resObj);
      } else {
        cb(resObj);
    }
  });
}

const putB2bEuInvitesAprDelete = (recordId, reqBody, tData, callback) => {  
  const getInvt = bEuInvDaoimpl.postB2bEuInvtntDelete(recordId, reqBody, tData.tokenData);  
  bEuInvDao.deleteB2bInvt(getInvt.query, (resObj) => {
    if(resObj.status == '200') {
      const result = SetRes.successRes('Inivitation deleted successfully');
      callback(result);
      bEuInvDao.updateB2bInvAll(getInvt.query, getInvt.deleteObj, resObj1 => {
        if(resObj1.status == '200') {
          const clsdObj = Object.assign({}, resObj.resData.result.toObject());
          const invtclsdCrt = {...clsdObj, ...getInvt.delClsdObj};
          const crtObj = new B2BEuInvitesClsd(invtclsdCrt);
          bEuInvDao.commonCreateFunc(crtObj, (resData) => {});
        }
      });
    } else callback(resObj);
  });
}

const getB2bEuInvitesClosedList = (reqBody, tData, callback) => {
  const obj = bEuInvDaoimpl.invtsClsdListObj(reqBody, tData);
  bEuInvDao.getB2bEuInvitesListClsd(obj, reqBody, callback);
}

const getB2bInvitationTeam = (id,  reqBody, tData, callback) => {
  const qry = reqBody.status ? bEuInvDaoimpl.invtsTeamStsQry(id, tData) : bEuInvDaoimpl.invtsTeamQry(id, tData);
  bEuInvDao.getB2bInvtAllData(qry, callback);
}

module.exports = {
  createInvtsClsed, postB2bEuInvite, getB2bEuInvitesList, postB2bEuInvtntDelete, getB2bInvitationView, putB2bUpdateInvite, putB2bEuInvitesStatusUpdate,
  putB2bEuInvitesAprDelete, getB2bEuInvitesClosedList, getB2bInvitationTeam
}


const asyncFunct = (uiQry, resObj, cb) => {
  async.parallel([
    function (callback) {
      bEuInvDao.getB2bEuAdrsData(uiQry, resObj1 => {
        callback(null, resObj1);
      });
    },
    function (callback1) {
      bEuInvDao.getB2bEuInvCertsData(uiQry, resObj2 => {
        callback1(null, resObj2);
      });
    },
    function (callback2) {
      bEuInvDao.getB2bEuInvEdsData(uiQry, resObj3 => {
        callback2(null, resObj3);
      });
    },
    function (callback3) {
      bEuInvDao.getB2bEuInvWrkAuthsData(uiQry, resObj4 => {
        callback3(null, resObj4);
      });
    },
    function (callback4) {
      bEuInvDao.getB2bEuInvWrkExpData(uiQry, resObj5 => {
        callback4(null, resObj5);
      });
    },
  ], function (err, result) {
    if (err) {
      logger.error('Un-known Error in daos/B2bEuInvitesSrvc.js, at putB2bEuInvitesStatusUpdate::' + err);
    }
    if (result) {
      const euInvD = resObj.resData.result;
      const euInvAdrs = result[0].status == '200' ? result[0].resData.result : [];
      const euInvCerts = result[1].status == '200' ? result[1].resData.result : [];
      const euInvEds = result[2].status == '200' ? result[2].resData.result : [];
      const euInvWAuth = result[3].status == '200' ? result[3].resData.result : {};
      const euInvWExp = result[4].status == '200' ? result[4].resData.result : {};
      const data = {euInvD, euInvAdrs, euInvCerts, euInvEds, euInvWAuth, euInvWExp, key: 'Success'};
      cb(data)
    } else {
      const data = {euInvD: resObj.resData.result, euInvAdrs: [], euInvCerts: [], euInvEds: [], euInvWAuth: {}, euInvWExp: {}, key: 'Fail'};
      cb(data);
    }
  });
}