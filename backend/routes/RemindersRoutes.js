const express = require("express");
const RemindersController = require("../controller/RemindersController");

const router = express.Router();

router.post("/users", RemindersController.addNewUser);
router.get("/", RemindersController.getReminders);
router.put("/", RemindersController.putReminder);

module.exports = router;
