const models = require("../models");
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

class UserController {
  static register = async (req, res) => {
    const { email, password, role} = req.body

    // TODO check for email and password
    if(!email || !password) {
      res.status(400).send('Please specify both email and password')
    }
    // TODO hash password
    try {
      const hashedPassword = await argon2.hash(password)
    
      models.user
        .insert({email, password: hashedPassword, role})
        .then(([result]) => {
          // TODO send the response
          if(result.affectedRows === 1) {
            res.status(201).json({id: result.insertId, email, role})
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send({
            error: err.message,
          });
        });
    } catch(err) {
      console.log(err);
      res.status(500).send({
        error: err.message,
      })
    }
  };

  static login = (req, res) => {
    const { email, password } = req.body;

    // TODO check for email and password
    if(!email || !password) {
      res.status(400).send({error: 'Please specify both email and password'})
    }

    models.user
      .findByMail(email)
      .then(async ([rows]) => {
        if (rows[0] == null) {
          // TODO invalid email
          res.status(403).json('Invalid email')
        } else {
          const { id, email, password: hashedPassword, role } = rows[0];

          // TODO invalid password
          const isVerified = await argon2.verify(hashedPassword, password)
          if(isVerified) {
            // TODO sign JWT with 1h expiration
            const token = jwt.sign({id, role}, process.env.JWT_AUTH_SECRET, {expiresIn: "1h"})

            res.cookie('access_token', token, {
              httpOnly: true,
            }).status(200).json({id, email, role})
             
          } else {
            res.status(403).send({error: "Invalid password"})
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
      .then(([rows]) => {
        // TODO send the list of users (without passwords)
        res.status(200).json(rows)
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          error: err.message,
        });
      });
  };

  static logout = (req, res) => {
    // TODO remove JWT token from HTTP cookies
  };

  // TODO add `authorization` middleware here!
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
