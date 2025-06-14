var nodemailer = require('nodemailer');
const helper = require('./helper')
// const { watched } = require('../common/mailTemplate')
const EMAIL = 'biuro@moto-trade.pl'
const HOST = 'http://localhost:8333'
var transporter = nodemailer.createTransport({
  host: 'ssl0.ovh.net',
  port: 465,

  secure: true,
  auth: {
    user: EMAIL,
    pass: 'KnybsAct0j@'
  }
});

exports.sendCustomMail = async (title, message, email) => {
  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: title,
    html: message
  };

  transporter.sendMail(mailOptions, (error, info) => { console.log(error, info) });
  return
}

exports.sendConfirmMail = async (email, data) => {
  const signature = await helper.generateConfirmationToken(email)
  let mailOptions = {
    from: EMAIL,
    to: email,
    subject: 'Potwierdź adres email aby otrzymywać informacje o nowych wpisach',
    html: confirmMail.replace(/{{CONFIRMATION_URL}}/, HOST +'/confirm-mail?tid=' + signature)
  };

  transporter.sendMail(mailOptions, (error, info) => { console.log(error, info, 'notifier') });
  return
}
exports.sendNewsMail = async (email, data) => {
  const signature = await helper.generateConfirmationToken(email)

  let mailOptions = {
    from: EMAIL,
    to: email,
    subject: data.title,
    html: newsMail
      .replace(/{{title}}/, data.blog.title)
      .replace(/{{link}}/, HOST +'/blog/' + data.blog.slug)
      .replace(/{{link}}/, HOST + '/blog/' + data.blog.slug)
      .replace(/{{imageUrl}}/, HOST + '/' + data.blog.image)
      .replace(/{{unsubscribeLink}}/, HOST + '/unsubscribe?tid=' + signature)
  };

  transporter.sendMail(mailOptions, (error, info) => { console.log(error, info, 'notifier') });
  return
}
const confirmMail = `
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <title>Potwierdzenie zapisu</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      padding: 2rem;
      color: #333;
      min-wdth: 600px;
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      max-width: 600px;
      margin: auto;
    }
    .button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 1.5rem;
    }
    .footer {
      margin-top: 2rem;
      font-size: 0.85rem;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Dziękujemy za zapis!</h2>
    <p>Cieszymy się, że chcesz być na bieżąco. Aby zakończyć zapis, kliknij poniższy przycisk:</p>

    <a href="{{CONFIRMATION_URL}}" class="button">Potwierdź zapis</a>

    <p>Po potwierdzeniu będziesz otrzymywać informacje o nowych wpisach, aktualnościach i ważnych wydarzeniach.</p>

    <div class="footer">
      Jeśli to nie Ty zapisywałeś(-aś) się do newslettera, możesz zignorować tę wiadomość.
    </div>
  </div>

<div class="footer" style=" font-family: Arial, sans-serif; border-top: 6px solid #0b2c3d; border-bottom: 6px solid #0b2c3d; padding: 20px; text-align: center;">
  <div class="footer-content" style="display: flex; flex-wrap: wrap; align-items: center;">

    <div class="logo" style="align-items: left; gap: 10px; margin: auto">
      <img src="https://gierusradca.pl/images/logo.png" alt="Logo" style="height: 100px;" />
    </div>

    <div class="contact" style="display: flex;  flex-wrap: wrap; justify-content: flex-start; gap: 20px 40px; margin: 15px;">

    <table cellpadding="0" cellspacing="0" border="0" style=" text-align:left; width: 100%; max-width: 600px; margin-top: 30px;">
    <tr>
      <!-- Kolumna 1 -->
      <td valign="top" style="padding: 10px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-size: 16px; color: #333; padding-bottom: 10px; min-width: 200px;">
              <img src="https://cdn-icons-png.flaticon.com/512/597/597177.png" alt="Phone" width="16" height="16" style="vertical-align: middle; margin-right: 6px;" />
              <a href="tel:505175334" style="text-decoration: none; color: #333;">505 175 334</a>
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px; color: #333; min-width: 200px;">
              <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" width="16" height="16" style="vertical-align: middle; margin-right: 6px;" />
              <a href="mailto:biuro@gierusradca.pl" style="text-decoration: none; color: #333;">biuro@gierusradca.pl</a>
            </td>
          </tr>
        </table>
      </td>

      <!-- Kolumna 2 -->
      <td valign="top" style="padding: 10px;">
        <table cellpadding="0" cellspacing="0" border="0" style="text-align:left;">
          <tr>
            <td style="font-size: 16px; color: #333; padding-bottom: 10px; min-width: 200px;">
              <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" alt="Website" width="16" height="16" style="vertical-align: middle; margin-right: 6px;" />
              <a href="https://www.gierusradca.pl" target="_blank" style="text-decoration: none; color: #333;">www.gierusradca.pl</a>
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px; color: #333; min-width: 200px;">
              <img src="https://cdn-icons-png.flaticon.com/512/1250/1250689.png" alt="ID" width="16" height="16" style="vertical-align: middle; margin-right: 6px;" />
              5170404383
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

    </div>
  </div>
</div>
</body>
</html>
`;

const newsMail = `<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <title>Nowy wpis na blogu</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">

      <h2 style="color: #222;">🆕 Nowy wpis na blogu: <span style="color: #0066cc;">{{title}}</span></h2>

      <a href="{{link}}" target="_blank" style="text-decoration: none;">
        <img src="{{imageUrl}}" alt="Obrazek wpisu" style="width: 100%; object-fit: cover; border-radius: 6px; margin-top: 10px;" />
      </a>


      <div style="text-align: center; margin-top: 25px;">
        <a href="{{link}}" style="background-color: #0066cc; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
          Czytaj cały wpis
        </a>
      </div>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 12px; color: #999; text-align: center;">
        Otrzymałeś(-aś) tę wiadomość, ponieważ zapisałeś(-aś) się na newsletter Gierus Radca.<br>
        Jeśli chcesz zrezygnować, kliknij <a href="{{unsubscribeLink}}" style="color: #999;">tutaj</a>.
      </p>
    </div>
  </body>
</html>
`