const { sendEmail } = require('./sendEmail'); // Import the SendGrid function
const db = require('./db'); // Example database connection

const sendDailyEmails = async () => {
  const users = await db.query('SELECT email, saved_info FROM users');

  for (const user of users) {
    const { email, saved_info } = user;
    const subject = 'Your Daily Update';
    const text = `Hello! Here’s your info for today: ${saved_info}`;
    const html = `<p>Hello!</p><p>Here’s your info for today:</p><p>${saved_info}</p>`;

    await sendEmail(email, subject, text, html);
  }
};

module.exports = { sendDailyEmails };