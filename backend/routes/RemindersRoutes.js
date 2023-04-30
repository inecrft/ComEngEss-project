const express = require("express");
const RemindersController = require("../controller/RemindersController");

const router = express.Router();

router.post("/users", RemindersController.addNewUser);
router.get("/", RemindersController.getReminders);
router.put("/", RemindersController.addReminder);
// router.post("/", RemindersController.addItem);
// router.delete("/:item_id", RemindersController.deleteItem);

module.exports = router;
