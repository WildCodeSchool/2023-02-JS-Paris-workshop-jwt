const models = require("../models");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

class UserController {
  static register = async (req, res) => {
    // TODO check for email and password
    const { email, password, role } = req.body;
    if (!email || !password) {
      res.status(400).send("Please specify email and password");
    } 

    // TODO hash password
    try {
      const hash = await argon2.hash(password);

      models.user
        .insert({ email, password: hash, role })
        .then(([result]) => {
          // TODO send the response
          res.status(201).send({ id: result.insertId, email, role });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send({
            error: err.message,
          });
        });
    } catch (err) {
      //...
      console.error(err);
      res.status(500).send({
        error: err.message,
      });
    }
  };

  static login = (req, res) => {
    const { email, password } = req.body;

    // TODO check for email and password
    if (!email || !password) {
      res.status(400).send("Please specify email and password");
    }

    models.user
      .findByMail(email)
      .then(async ([rows]) => {
        if (rows[0] == null) {
          // TODO invalid email
          res.status(403).send({ error: "Invalid email" });
        } else {
          const { id, email, password: hash, role } = rows[0];

          // TODO invalid password
          try {
            console.log("HELLO", process.env.JWT_AUTH_SECRET);
            if (await argon2.verify(hash, password)) {
              const token = jwt.sign(
                {
                  id: id,
                  role: role,
                },
                process.env.JWT_AUTH_SECRET,
                { expiresIn: "1h" }
              );
              // TODO sign JWT with 1h expiration

              res.cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
              });
              res.status(200).send({ id, email, role });
            } else {
              res.status(401).send({ error: "Invalid password" });
              // password did not match
            }
          } catch (err) {
            console.error(err);
            res.status(500).send({
              error: err.message,
            });
            // internal failure
          }

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

  // static browse = (req, res) => {
    
  //   models.user
  //     .findAll()
      
  //     .then(([rows]) => {
  //       console.log("hellow", rows)
  //       // TODO send the list of users (without passwords)
  //       res.send(rows.map((user) => {
  //         return { id : user.id, email : user.email, role : user.role, }
  //       }))
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       res.status(500).send({
  //         error: err.message,
  //       });
  //     });
  // };
  // src/controllers/UserController.js

  static browse = (req, res) => {
    models.user
      .findAll()
      .then(([rows]) => {
        res.send(
          rows.map((user) => {
            return {
              id: user.id,
              email: user.email,
              role: user.role,
            };
          })
        );
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          error: err.message,
        });
      });
  };

  // src/controllers/UserController.js

  static authorization = (req, res, next) => {
    
    const token = req.cookies?.access_token;
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
    if (req.userRole === "ROLE_ADMIN") {
      return next()
    } 
    return res.sendStatus(403)
  }

  static logout = (req, res) => {
    // TODO remove JWT token from HTTP cookies
    return res.clearCookie("access_token").status(200).json({ message : "Disconnect"})
    

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
