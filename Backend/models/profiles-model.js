const mongoose = require("mongoose");

const profile = new mongoose.Schema({
  user_id: { type: String },
  subscriber_id: { type: String },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email_id: { type: String, required: true },
  job: { type: String },
  picture: { type: String },
  picture_url: { type: String },
  created_time: { type: String },
  bio: { type: String },
  location: { type: String },
  college_name: { type: String },
  company_name: { type: String },
  skills: { type: Array },
  resume: { type: String },
  education: [{
    education_id: { type: String },
    college_name: { type: String },
    degree: { type: String },
    course: { type: String },
    college_logo: { type: String },
    location: { type: String },
    date_of_joining: { type: String, default: Date.toString('yyyy-MM-dd HH:mm:ss') },
    date_of_completion: { type: String, default: Date.toString('yyyy-MM-dd HH:mm:ss') }
  }],
  experience: [{
    experience_id: { type: String },
    role: { type: String },
    company_name: { type: String },
    company_logo: { type: String },
    location: { type: String },
    date_of_joining: { type: String, default: Date.toString('yyyy-MM-dd HH:mm:ss') },
    date_of_leaving: { type: String, default: Date.toString('yyyy-MM-dd HH:mm:ss') }
  }],
  user_socials: [{
    user_social_id: { type: String },
    user_social_type: { type: String },
    user_social_link: { type: String }
  }],
  user_certificates: [{
    user_certificate_id: { type: String },
    certificate_name: { type: String },
    certificate_description: { type: String },
    certification_provider: { type: String },
    certificate_url: { type: String },
    certificate_provided_date: { type: String, default: Date.toString('yyyy-MM-dd HH:mm:ss') },
    certificate_expiry_date: { type: String, default: Date.toString('yyyy-MM-dd HH:mm:ss') },
    certificate_id: { type: String }
  }],
  account_status: { type: String, default: 'Active' }
});

module.exports = mongoose.model("profiles", profile);