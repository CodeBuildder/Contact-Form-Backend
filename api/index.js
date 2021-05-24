const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const app = express();
app.use(express.json());

app.use(cors({ credentials: true }));
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.render("Hey there!");
});

app.post("/send", (req, res) => {
  const output = `
    <p>Scylla here, Someone is trying to contact you!</p>
    <h3>Contact Details:</h3>
    <ul type ="square">  
      <li>Name: ${req.body.name}</li>
      <li>Subject: ${req.body.subject}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message Fetched:</h3>
    <p>${req.body.message}</p>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    name: req.body.name,
    from: req.body.email, // sender address
    to: "kums2kaushik@gmail.com", // list of receivers
    subject: `Scylla here! ${req.body.email} is trying to get in touch with you.`,
    text: req.body.message,
    html: output, // plain text body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(400);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(201).send({ msg: "Email has been sent" });
  });
});
app.listen(port, () => {
  console.log(`Wakey Wakey kk, Server is up and running @ ${port}`);
});
