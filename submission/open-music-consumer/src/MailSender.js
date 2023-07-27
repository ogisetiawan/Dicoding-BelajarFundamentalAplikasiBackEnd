const nodemailer = require('nodemailer');
 
class MailSender {
  constructor() {
    //? object transport untuk nodemailer
    this._transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, playlistName, content) {
    const message = {
      from: 'OpenMusic Apps',
      to: targetEmail,
      subject: `Ekspor Lagu pada Playlists ${playlistName}`,
      text: 'Terlampir hasil dari ekspor playlist',
      attachments: [
          {
              filename: `${playlistName}.json`,
              content,
          },
      ],
  };

  return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;