const express = require("express");
const {
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const { authenticate } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();
router.get("/",authenticate, getMenu);
router.post("/", authenticate, upload.single("image"), addMenuItem);
router.put("/:id", authenticate, upload.single("image"), updateMenuItem);
router.delete("/:id", authenticate, deleteMenuItem);

module.exports = router;

