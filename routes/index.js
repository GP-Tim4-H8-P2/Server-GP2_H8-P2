const Controller = require("../controllers/controller");

const router = require("express").Router();

router.get("/word", Controller.getWords);

module.exports = router;
