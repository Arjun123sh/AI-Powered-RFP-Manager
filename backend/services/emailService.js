const nodemailer = require("nodemailer");
const imaps = require("imap-simple");
const Proposal = require("../models/Proposal.js");
const { askOllama } = require("./ollamaService.js");

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arjunrocks405@gmail.com",
    pass: "pryvgueehijsipwl"
  }
});

module.exports.sendRfpEmail = async function (to, subject, text) {
  await smtpTransport.sendMail({
    from: "arjunrocks405@gmail.com",
    to,
    subject,
    text
  });
}

// Receive vendor replies
module.exports.readEmails = async function () {
  const config = {
    imap: {
      user: "arjunrocks405@gmail.com",
      password: "yocnrapfrabbtaggm",
      host: "imap.gmail.com",
      port: 993,
      tls: true
    }
  };

  const connection = await imaps.connect(config);
  await connection.openBox("INBOX");

  const messages = await connection.search(['UNSEEN'], {
    bodies: ['TEXT'],
    markSeen: true
  });

  for (let msg of messages) {
    const emailText = msg.parts[0].body;


    const extracted = await askOllama(`
      Extract total_price, delivery_days, warranty, payment_terms 
      from this vendor proposal email.
      Return JSON only.
      Email:
      ${emailText}
    `);

    await Proposal.create({
      vendorEmail: "unknown",
      rawEmail: emailText,
      extracted: JSON.parse(extracted)
    });
  }
}
