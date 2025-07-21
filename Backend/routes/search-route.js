const express = require("express");
const router = express.Router();
const { search_profiles } = require("../controller/search");

router.get("/search", search_profiles);

module.exports = router;