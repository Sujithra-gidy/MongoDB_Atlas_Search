const express = require("express");
const router = express.Router();
const { search_profiles, get_all_profiles } = require("../controller/search");
const validateQuery = require("../middleware/data_validation");

router.get("/search", validateQuery, search_profiles);
router.get("/profiles", get_all_profiles)
module.exports = router;