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

// --- Begin: B2B Partner End Users All Invitations Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},

  b2b: {type: String, required: true},
  b2bName: {type: String, required: true},
  b2bCode: {type: String, required: true},

  refType: {type: String, required: true}, // Refer Type: Internal, Other
  refByUser: {type: String, required: false}, // Referred By User(_id): Required true if refType = Internal
  refByUID: {type: String, required: false}, // Referred By User(refUID): Required true if refType = Internal
  refByName: {type: String, required: true}, // Referred By User(Name)

  org: {type: String, required: false},
  orgName: {type: String, required: false},
  orgCode: {type: String, required: false},
  obId: {type: String, required: false}, // Org Branch Record ID
  obName: {type: String, required: false}, // Org Branch Name
  obCode: {type: String, required: false}, // Org Branch Code
  team: {type: String, required: false},
  tName: {type: String, required: false}, // Team Name
  tCode: {type: String, required: false}, // Team Code

  iFrom: {type: String, required: true}, // Invitation From

  report: {type: String, required: false},
  rprtName: {type: String, required: false},
  rprtPrimary: {type: String, required: false},
  pReports: {type: [String], required: false}, // Parent Reports

  name: {type: String, required: true, trim: true}, // Full Name
  fName: {type: String, required: true, trim: true}, // First Name
  lName: {type: String, required: true, trim: true}, // Last Name
  mobCc: {type: String, required: false}, // cc - Country Code: +91
  mobNum: {type: String, required: false}, // Mobile Number
  mobCcNum: {type: String, required: false}, // Mobile Number with Country Code
  emID: {type: String, required: true, trim: true}, // Email ID
  refUID: {type: String, required: true, index: true, unique: true}, // Reference Unique ID // teksolve:superadmin
  myPrimary: {type: String, required: true, index: true, unique: true}, // Mobile Number or Email b2bCode:email// teksolve:teksolve:admin@teksolveit.com
  mpType: {type: String, required: true}, // My Primary Type: Email or Mobile

  iStatus: {type: String, required: true}, // Invite Status: Open, Submitted(Review), Approved, Rejected

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

schema.index({delFlag: -1, b2b: 1, org: 1, team: 1});

module.exports = mongoose.model(config.collB2BEuInvitesAll, schema);
// --- End: B2B Partner End Users All Invitations Schema --- //
