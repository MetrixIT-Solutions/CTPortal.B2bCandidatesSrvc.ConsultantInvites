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

// --- Begin: B2B Partner End Users Invitations ID Proofs Schema --- //
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

  idpCat: {type: String, required: true}, // ID Proof Category: USA Issued National ID State, SSN, Student ID, India ID Proof, India Address Proof, etc..., Other
  idpType: {type: String, required: true}, // ID Proof Type - USA issued national ID state Type: DL(Driving Licence)/State ID/Other
  idpNum: {type: String, required: true}, // ID Proof Number - USA issued national ID state: Number
  idpName: {type: String, required: false}, // ID Proof Name - Name as per ID
  idpfName: {type: String, required: false}, // ID Proof First Name as per ID
  idpmName: {type: String, required: false}, // ID Proof Middle Name as per ID
  idplName: {type: String, required: false}, // ID Proof Last Name as per ID
  idpIssDt: {type: Date, required: false}, // ID Proof Issued Date
  idpIssDtStr: {type: String, required: false}, // ID Proof Issued Date String
  idpExpDt: {type: Date, required: false}, // ID Proof Expiry Date
  idpExpDtStr: {type: String, required: false}, // ID Proof Expiry Date String

  idpFile: {type: String, required: false}, // ID Proof File Name
  idpfActName: {type: String, required: false}, // ID Proof File Actual Name
  idpfPath: {type: String, required: false}, // ID Proof File Path

  hNum: {type: String, required: false}, // Building Name, House Number, Floor
  area: {type: String, required: false}, // Streat, Area, Village
  aLocality: {type: String, required: false}, // Area Locality, Mandal
  zip: {type: String, required: false}, // Zip Code, Pincode
  city: {type: String, required: false}, // City, District
  state: {type: String, required: false},
  sCode: {type: String, required: false},
  country: {type: String, required: true},
  cCode: {type: String, required: true},

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

schema.index({idpType: 'text', idpNum: 'text', idpName: 'text', city: 'text', state: 'text'});
schema.index({uid: 1, delFlag: -1, b2b: 1});
schema.index({uid: 1, delFlag: -1, b2b: 1, idpCat: 1});
schema.index({uid: 1, delFlag: -1, b2b: 1, idpCat: 1, idpType: 1});
schema.index({b2b: 1, org: 1, idpCat: 1, idpType: 1, idpNum: 1}, {unique: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collB2BEuInvitesIDProofs, schema);
// --- End: B2B Partner End Users Invitations ID Proofs Schema --- //
