/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

var config = require('config');
var mongoose = require('mongoose');
var {v4: uuidv4} = require('uuid');

mongoose.createConnection(config.mongoDBConnection);
const Schema = mongoose.Schema;

// --- Begin: B2B Partner End Users Invitations Work Authorisations Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  idSeq: {
    seq: {type: String, required: true}, // Country, State and Year(2022) Moth(10) Day(10)
    cCode: {type: String, required: false}, // Country Code: IND
    sCode: {type: String, required: false}, // State Code: TS
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    day: {type: Number, required: true}
  },
  uid: {type: String, required: true, ref: config.collB2BEuInvites},
  b2b: {type: String, required: true},
  b2bName: {type: String, required: true},
  b2bCode: {type: String, required: true},

  org: {type: String, required: false},
  orgName: {type: String, required: false},
  orgCode: {type: String, required: false},
  obId: {type: String, required: false}, // Org Branch Record ID
  obName: {type: String, required: false}, // Org Branch Name
  obCode: {type: String, required: false}, // Org Branch Code
  team: {type: String, required: false},
  tName: {type: String, required: false}, // Team Name
  tCode: {type: String, required: false}, // Team Code

  nationality: {type: String, required: true}, // Indian, American, Other
  psprtNum: {type: String, required: true}, // Passport Number
  psprtIssDt: {type: Date, required: true}, // Passport Issued Date
  psprtIssDtStr: {type: String, required: true}, // Passport Issued Date String
  psprtExpDt: {type: Date, required: true}, // Passport Expiry Date
  psprtExpDtStr: {type: String, required: true}, // Passport Expiry Date String
  psprtIssPlace: {type: String, required: false}, // Passport Issued Place
  psprtDocNum: {type: String, required: false}, // Passport Document Number

  visaStatus: {type: String, required: false}, // Required If nationality != American
  visaStDt: {type: Date, required: false}, // Visa Start Date
  visaStDtStr: {type: String, required: false}, // Visa Start Date String
  visaExpDt: {type: Date, required: false}, // Visa Expiry Date
  visaExpDtStr: {type: String, required: false}, // Visa Expiry Date String
  empType: {type: String, required: false}, // Employment Type(Position): Part Time, Full Time
  sevisNum: {type: String, required: false}, // Sevis Number

  cardNum: {type: String, required: false}, // US Card Number
  uscisNum: {type: String, required: false},
  cardExpDt: {type: Date, required: false}, // US Card Expected Date
  cardExpDtStr: {type: String, required: false}, // US Card Expected Date String
  cardRcptNum: {type: String, required: false}, // US Card Receipt Number

  li94Num: {type: String, required: false}, // Latest I-94 Record Number
  i94ExpDt: {type: Date, required: false}, // I-94 Expiry Date
  i94ExpDtStr: {type: String, required: false}, // I-94 Expiry Date String
  wrkAuthStrtDt:{type: Date, required: false},
  wrkAuthStrtDtStr: {type: String, required: false},
  wrkAuthExpDt: {type: Date, required: false},
  wrkAuthExpDtStr: {type: String, required: false},

  position: {type: String, required: false}, // Full Time, Part Time
  initCardNum: {type: String, required: false},  // Initial Card Number
  receiptNum: {type: String, required: false},  // Receipt Number

  delFlag: {type: Boolean, default: false}, // Deleted Flag
  cuType: {type: String, required: true}, // Created User Type
  cUser: {type: String, required: true, trim: true}, // Created Users._id
  cuName: {type: String, required: true}, // Created Users.pName
  cDate: {type: Date, required: true}, // Date & Time
  cDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  uuType: {type: String, required: true}, // Updated User Type
  uUser: {type: String, required: true, trim: true}, // Updated Users._id
  uuName: {type: String, required: true}, // Updated Users.pName
  uDate: {type: Date, required: true}, // Date & Time
  uDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
});

schema.index({nationality: 'text', psprtNum: 'text', psprtIssPlace: 'text', visaStatus: 'text', cardNum: 'text', uscisNum: 'text', li94Num: 'text'});
schema.index({delFlag: -1, b2b: 1, uid: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collB2BEuInvitesWrkAuths, schema);
// --- End: B2B Partner End Users Invitations Work Authorisations Schema --- //
