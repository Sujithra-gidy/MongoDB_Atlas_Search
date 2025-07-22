const express = require("express");
const router = express.Router();
const { search_profiles, get_all_profiles } = require("../controller/search");

router.get("/search", search_profiles);
router.get("/profiles", get_all_profiles)
module.exports = router;