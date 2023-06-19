const models = require("../models");
const argon2 = require('argon2')

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

    models.user
      .findByMail(email)
      .then(async ([rows]) => {
        if (rows[0] == null) {
          // TODO invalid email
        } else {
          const { id, email, password: hash, role } = rows[0];

          // TODO invalid password

          // TODO sign JWT with 1h expiration

          // TODO send the response and the HTTP cookie
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
