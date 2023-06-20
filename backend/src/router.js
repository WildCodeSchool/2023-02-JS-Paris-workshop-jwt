const express = require("express");

const { UserController } = require("./controllers");

const router = express.Router();

// TODO modify the `register` method in UserController
router.post("/users/register", UserController.register);
// TODO modify the `login` method in UserController
router.post("/users/login", UserController.login);
// TODO add the JWT middlewares to the `/users` route
router.get("/users", UserController.authorization, UserController.isAdmin, UserController.browse);
// TODO modify the `logout` method in UserController
router.get("/users/logout",UserController.authorization, UserController.logout);

router.put("/users/:id", UserController.edit);
router.delete("/users/:id", UserController.delete);

module.exports = router;
