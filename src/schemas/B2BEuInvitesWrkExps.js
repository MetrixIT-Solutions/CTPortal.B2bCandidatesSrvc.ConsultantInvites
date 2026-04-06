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

// --- Begin: B2B Partner End Users Invitations Work Experiences Schema --- //
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

  expYears: {type: String, required: true}, // Experience in Years
  expMonths: {type: String, required: true}, // Experience in Months
  tExp: {type: String, required: true}, // Total Experience in months
  jobTitle: {type: String, required: true},
  primSkills: {type: String, required: true}, // Primary Skills
  primSkillsArr: {type: [String], required: true}, // Primary Skills
  secSkills: {type: String, required: false}, // Sencondary Skills
  secSkillsArr: {type: [String], required: false}, // Sencondary Skills
  prfsSrm: {type: String, required: true}, // Professional Summary
  healthIns: {type: Boolean, default: false}, // Need health Insurance through our company

  emps: [{ // Employers
    _id: {type: Number},
    present: {type: Boolean, required: false}, // Present Employer*
    empType:  {type: String, required: false}, // Full time/Contract
    company: {type: String, required: false}, // Company*
    endClient: {type: String, required: false},
    fDt: {type: Date, required: false}, // From Date*
    fDtStr: {type: String, required: false}, // From Date String*
    tDt: {type: Date, required: false}, // To Date - If Present Employer *
    tDtStr: {type: String, required: false}, // To Date String - If Present Employer *
    country: {type: String, required: false}, // Country*
    cCode: {type: String, required: false}, // Country Code*
    state: {type: String, required: false}, // State*
    sCode: {type: String, required: false}, // State Code*
    city: {type: String, required: false}, // City*
    skills: {type: String, required: false}, // Skills*
    skillsArr: {type: [String], required: false}, // Skills List*
    designation: {type: String, required: false}, // Developer
    rolesRes: {type: String, required: false}, // Roles and Responsibilities*
    desc: {type: String, required: false} // Description
  }],

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

schema.index({tExp: 'text', jobTitle: 'text', primSkills: 'text'});
schema.index({delFlag: -1, b2b: 1, uid: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collB2BEuInvitesWrkExps, schema);
// --- End: B2B Partner End Users Invitations Work Experiences Schema --- //
