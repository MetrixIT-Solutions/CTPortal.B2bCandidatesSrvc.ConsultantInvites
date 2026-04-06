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

// --- Begin: B2B Partner End Users Invitations Meetings Schema --- //
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
  invite: {type: String, required: true},
  invUserId: {type: String, required: true},
  invUserPrimary: {type: String, required: true},
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

  swc: {type: String, required: true}, // Scheduled With Candidate (Invited User Name)
  scMobCcNum: {type: String, required: false}, // Scheduled Candidate Mobile Number (Invited User Mobile Number)
  sbUser: {type: String, required: true}, // Scheduled By(B2B Org Users._id)
  sbuName: {type: String, required: true}, // Scheduled B2B User Name
  sbuEid: {type: String, required: true}, // Scheduled B2B User Email ID
  sbuMob: {type: String, required: false}, // Scheduled B2B User Mobile Number with country code

  mType: {type: String, required: true}, // Meeting Type: Telephone, Online, Face to Face(Offline)
  msub: {type: String, required: true}, // Meeting Subject
  mpCc: {type: String, required: false}, // Meeting Phone Country Code
  mpNum: {type: String, required: false}, // Meeting Phone Number
  mpCcNum: {type: String, required: false}, // Meeting Phone Number with Country Code
  mpExt: {type: String, required: false}, // Meeting Phone Extension
  mLink: {type: String, required: false}, // Meeting Link
  mobId: {type: String, required: false}, // Meeting Org Branch Record ID
  mobName: {type: String, required: false}, // Meeting Org Branch Name
  mobCode: {type: String, required: false}, // Meeting Org Branch Code
  mobAdrs: {type: String, required: false}, // Meeting Org Branch Address

  mbrIds: {type: [String], required: true}, // B2B Users Participant Members Ids._ids
  mbrNames: {type: [String], required: true}, // B2B Users Participant Members Names
  members: [{ // B2B Users Participant Members
    _id: {type: String, required: true}, // _ids
    name: {type: String, required: true}, // Name
    refUID: {type: String, required: true},
    emID: {type: String, required: true}, // Mail,
  }],
  msDtTm: {type: Date, required: true}, // Meeting Start Date Time
  msDtTmStr: {type: String, required: true}, // Meeting Start Date Time String
  meDtTm: {type: Date, required: false}, // Meeting End Date Time
  meDtTmStr: {type: String, required: false}, // Meeting End Date Time String
  mDrx: {type: Number, required: false}, // Meeting Duration: In Minutes
  mTz: {type: String, required: true}, // Meeting Timezone

  mDesc: {type: String, required: true}, // Meeting Description
  mNotes: {type: String, required: false}, // Meeting Notes
  mStatus:  {type: String, required: true}, // Meeting Status: Scheduled, Completed, Cancelled
  type: {type: String, required: true}, // Interview, on Boarding

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

schema.index({mType: 'text', msub: 'text', sDtTmStr: 'text', swc: 'text', invUserPrimary: 'text', sbuName: 'text'});
schema.index({delFlag: -1, b2b: 1, invite: 1, mStatus: 1, type: 1});
schema.index({delFlag: -1, b2b: 1, mbrIds: 1, msDtTmStr: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collB2BEuInvitesMeetings, schema);
// --- End: B2B Partner End Users Invitations Meetings Schema --- //
