const nodemailer = require("nodemailer");
const transporter = require("../configs/emailTransport");

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Hệ thống của bạn" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

const resetPasswordTemplate = (resetLink) => `
  <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu từ bạn.</p>
  <p>Nhấn vào liên kết dưới đây để đặt lại mật khẩu:</p>
  <a href="${resetLink}">${resetLink}</a>
  <p><i>Liên kết này sẽ hết hạn trong 15 phút.</i></p>
`;

const verifyEmailTemplate = (verifyLink) => `
  <h3>Chào bạn,</h3>
  <p>Bạn vừa đăng ký tài khoản trên hệ thống của chúng tôi.</p>
  <p>Vui lòng nhấn vào liên kết bên dưới để xác nhận địa chỉ email:</p>
  <a href="${verifyLink}">${verifyLink}</a>
  <p><i>Liên kết sẽ hết hạn sau 24 giờ.</i></p>
`;

module.exports = {
  sendEmail,
  resetPasswordTemplate,
  verifyEmailTemplate,
};
