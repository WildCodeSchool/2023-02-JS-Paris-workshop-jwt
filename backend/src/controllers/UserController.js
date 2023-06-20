const models = require("../models");
const argon = require("argon2");
const jwt = require("jsonwebtoken");

class UserController {

  // src/controllers/UserController.js

  static authorization = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.sendStatus(401);
    }
    try {
      const data = jwt.verify(token, process.env.JWT_AUTH_SECRET);
      req.userId = data.id;
      req.userRole = data.role;
      return next();
    } catch {
      return res.sendStatus(401);
    }
  };

  static isAdmin = (req, res, next) => {
    if (req.userRole === "ROLE_ADMIN")
      next();
    else
      res.sendStatus(403);
  }

  static register = async (req, res) => {
    // TODO check for email and password
    const {email, password, role} = req.body;
    if (!email, !password)
      return res.status(400).json("Please specify both email and password");

    // TODO hash password
    const hash = await argon.hash(password);

    models.user
      .insert({email, password: hash, role})
      .then(([result]) => {
        // TODO send the response
        res.status(201).json({id: result.insertId, email, role});
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          error: err.message,
        });
      });
  };

  static login = (req, res) => {
    const { email, password } = req.body;
    if (!email, !password)
      return res.status(400).json("Please specify both email and password");

    // TODO check for email and password

    models.user
      .findByMail(email)
      .then(async ([users]) => {
        if (users[0] == null) {
          // TODO invalid email
          res.status(403).json("invalid email");
        } else {
          const { id, email, password: hash, role } = users[0];

          const result = await argon.verify(hash, password);

          if(result) {
            const token = jwt.sign({ id, role }, process.env.JWT_AUTH_SECRET, {expiresIn: "1h"});
            res.cookie("access_token", token, {httpOnly: true, secure: process.env.NODE_ENV == "production"});
            res.status(200).json({id, email, role});
          }
          else {
            res.status(403).json("invalid password");
          }
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          error: err.message,
        });
      });
  };

  static browse = (req, res) => {
    models.user
      .findAll()
      .then(([users]) => {
        // TODO send the list of users (without passwords)
        const data = users.map(({id, email, role}) => {
          return {id, email, role};
        });
        res.status(200).json(data);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          error: err.message,
        });
      });
  };

  static logout = (req, res) => {
    res.clearCookie("access_token").sendStatus(200);
  };

  // TODO add `authorization` middleware here!

  // TODO add `isAdmin` middleware here!

  static edit = (req, res) => {
    const user = req.body;

    user.id = parseInt(req.params.id, 10);

    models.user
      .update(user)
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static delete = (req, res) => {
    models.user
      .delete(req.params.id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };
}

module.exports = UserController;
