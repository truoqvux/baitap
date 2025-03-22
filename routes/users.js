var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { check_authentication, check_authorization } = require('../utils/check_auth')
let { CreateSuccessRes } = require('../utils/responseHandler')
let constants = require('../utils/constants')
/* GET users listing. */
router.get('/', check_authentication,
  check_authorization(constants.MOD_PERMISSION)
  , async function (req, res, next) {
    try {
      let users = await userController.GetAllUsers();
      CreateSuccessRes(res, users, 200);
    } catch (error) {
      next(error)
    }
  });
router.get('/:id', check_authentication, check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    try {
      // Lấy ID từ token của user đăng nhập
      let requesterId = req.user.id;
      let requestedId = req.params.id;

      // Kiểm tra nếu MOD đang cố lấy chính ID của mình
      if (requesterId === requestedId) {
        return res.status(403).json({ message: "Bạn không thể lấy thông tin của chính mình." });
      }

      // Lấy thông tin user nếu ID hợp lệ
      let users = await userController.GetUserByID(requestedId);
      CreateSuccessRes(res, users, 200);
    } catch (error) {
      next(error);
    }
  });
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION)
  , async function (req, res, next) {
    try {
      let body = req.body
      let user = await userController.CreateAnUser(
        body.username, body.password, body.email, body.role
      )
      CreateSuccessRes(res, user, 200);
    } catch (error) {
      next(error)
    }
  });
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION)
  , async function (req, res, next) {
    try {
      let body = req.body
      let user = await userController.UpdateAnUser(req.params.id, body)
      CreateSuccessRes(res, user, 200);
    } catch (error) {
      next(error)
    }
  });
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION)
  , async function (req, res, next) {
    try {
      let body = req.body
      let user = await userController.DeleteAnUser(req.params.id)
      CreateSuccessRes(res, user, 200);
    } catch (error) {
      next(error)
    }
  });

module.exports = router;
