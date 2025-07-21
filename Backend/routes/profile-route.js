const express = require("express");
const router = express.Router();
const { profile_upload, synonym_upload } = require("../controller/upload-docs");

router.post("/add-profiles", profile_upload);
router.post("/add-synonyms", synonym_upload);


module.exports = router;