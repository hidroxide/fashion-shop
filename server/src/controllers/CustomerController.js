const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");

const User = require("../models/user");
const Customer_Info = require("../models/customer_info");
const { sendEmail, verifyEmailTemplate } = require("../utils/sendEmail");

let register = async (req, res, next) => {
  let email = req.body.email;
  if (email === undefined)
    return res.status(400).send({ message: "Vui lòng nhập Email của bạn" });
  let password = req.body.password;
  if (password === undefined)
    return res.status(400).send({ message: "Vui lòng nhập Mật khẩu của bạn" });
  let customer_name = req.body.customer_name;
  if (customer_name === undefined)
    return res.status(400).send({ message: "Vui lòng nhập Họ và Tên của bạn" });
  let phone_number = req.body.phone_number;
  if (phone_number === undefined)
    return res
      .status(400)
      .send({ message: "Vui lòng nhập Số điện thoại của bạn" });

  let customer = await User.findOne({ where: { email, role_id: 2 } });
  if (customer) return res.status(409).send({ message: "Email đã tồn tại" });
  else {
    try {
      let hashPassword = await bcrypt.hash(password, 10);
      let newCustomer = await User.create({
        email: email,
        password: hashPassword,
        role_id: 2,
      });
      await Customer_Info.create({
        user_id: newCustomer.user_id,
        customer_name,
        phone_number,
      });

      const verifyToken = jwt.sign(
        { customer_id: newCustomer.user_id },
        process.env.ACCESSTOKEN_SECRET_KEY,
        { expiresIn: process.env.ACCESSTOKEN_EXPIRES_IN }
      );

      await newCustomer.update({ verify_token: verifyToken });
      const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;

      await sendEmail({
        to: email,
        subject: "Xác thực Email",
        html: verifyEmailTemplate(verifyLink),
      });
      return res.send({
        message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực.",
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: "Có lỗi xảy ra vui lòng thử lại" });
    }
  }
};

let login = async (req, res, next) => {
  let email = req.body.email;
  if (email === undefined)
    return res.status(400).send({ message: "Email hoặc Mật khẩu không đúng" });
  let password = req.body.password;
  if (password === undefined)
    return res.status(400).send({ message: "Email hoặc Mật khẩu không đúng" });

  try {
    let customer = await User.findOne({
      where: { email, role_id: 2 },
    });
    if (!customer) {
      return res
        .status(401)
        .send({ message: "Email hoặc Mật khẩu không đúng" });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .send({ message: "Email hoặc Mật khẩu không đúng" });
    }

    if (!customer.is_verified) {
      return res
        .status(403)
        .send({ message: "Vui lòng xác thực Email trước khi đăng nhập" });
    }

    const accessToken = jwt.sign(
      { customer_id: customer.user_id },
      process.env.ACCESSTOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESSTOKEN_EXPIRES_IN }
    );

    const { exp } = jwtDecode(accessToken);
    const accessTokenExpires = exp;

    const refreshToken = jwt.sign(
      { customer_id: customer.user_id },
      process.env.REFRESHTOKEN_SECRET_KEY,
      { expiresIn: process.env.REFRESHTOKEN_EXPIRES_IN }
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    });
    return res.send({
      access_token: accessToken,
      access_token_expires: accessTokenExpires,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Có lỗi xảy ra, vui lòng thử lại" });
  }
};

let logout = async (req, res, next) => {
  res.clearCookie("refresh_token");
  return res.send({ message: "Đăng xuất thành công" });
};

let refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies?.refresh_token;
  if (refreshToken === undefined)
    return res.status(400).send({ message: "Refresh Token không hợp lệ" });
  try {
    const { iat, exp, ...payload } = jwt.verify(
      refreshToken,
      process.env.REFRESHTOKEN_SECRET_KEY
    );

    const newAccessToken = jwt.sign(
      payload,
      process.env.ACCESSTOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESSTOKEN_EXPIRES_IN }
    );

    const decode = jwtDecode(newAccessToken);
    const newAccessTokenExpires = decode.exp;

    const newRefreshToken = jwt.sign(
      payload,
      process.env.REFRESHTOKEN_SECRET_KEY,
      { expiresIn: process.env.REFRESHTOKEN_EXPIRES_IN }
    );

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    });
    return res.send({
      access_token: newAccessToken,
      access_token_expires: newAccessTokenExpires,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Refresh Token không hợp lệ" });
  }
};

let getInfor = async (req, res, next) => {
  const customerId = req.token.customer_id;
  if (!customerId)
    return res.status(400).send({ message: "Access Token không hợp lệ" });

  try {
    const customer = await User.findOne({
      where: { user_id: customerId, role_id: 2 },
      include: [
        {
          model: Customer_Info,
          attributes: ["customer_name", "phone_number", "address"],
        },
      ],
    });
    if (!customer || !customer.Customer_Info)
      return res
        .status(404)
        .send({ message: "Không tìm thấy thông tin người dùng" });

    return res.send({
      email: customer.email,
      customer_name: customer.Customer_Info.customer_name,
      phone_number: customer.Customer_Info.phone_number,
      address: customer.Customer_Info.address,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Có lỗi xảy ra, vui lòng thử lại" });
  }
};

let update = async (req, res, next) => {
  const user_id = req.token.customer_id;
  if (!user_id)
    return res.status(400).send({ message: "Access Token không hợp lệ" });
  const customer_name = req.body.customer_name;
  if (customer_name === undefined)
    return res
      .status(400)
      .send({ message: "Trường customer_name không tồn tại" });
  const phone_number = req.body.phone_number;
  if (phone_number === undefined)
    return res
      .status(400)
      .send({ message: "Trường phone_number không tồn tại" });
  const address = req.body.address;
  if (address === undefined)
    return res.status(400).send({ message: "Trường address không tồn tại" });

  try {
    const customer = await User.findOne({ where: { user_id, role_id: 2 } });
    if (!customer)
      return res.status(409).send({ message: "Customer không tồn tại" });

    const numberUpdate = await Customer_Info.update(
      { customer_name, phone_number, address },
      { where: { user_id } }
    );
    if (numberUpdate) {
      return res.send({
        customer_name,
        phone_number,
        address,
      });
    } else {
      return res
        .status(500)
        .send({ message: "Có lỗi xảy ra, vui lòng thử lại" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Có lỗi xảy ra, vui lòng thử lại" });
  }
};

let changePassword = async (req, res, next) => {
  const user_id = req.token.customer_id;
  if (!user_id)
    return res.status(400).send({ message: "Access Token không hợp lệ" });

  const { old_password, new_password, confirm_password } = req.body;

  if (!old_password || !new_password || !confirm_password) {
    return res.status(400).send({ message: "Vui lòng nhập đầy đủ thông tin" });
  }

  if (new_password !== confirm_password) {
    return res
      .status(400)
      .send({ message: "Mật khẩu mới và xác nhận mật khẩu không khớp" });
  }

  try {
    const customer = await User.findOne({ where: { user_id, role_id: 2 } });
    if (!customer) {
      return res.status(404).send({ message: "Người dùng không tồn tại" });
    }

    const isPasswordValid = await bcrypt.compare(
      old_password,
      customer.password
    );
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Mật khẩu cũ không đúng" });
    }

    const hashPassword = await bcrypt.hash(new_password, 10);
    await User.update({ password: hashPassword }, { where: { user_id } });

    return res.send({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Có lỗi xảy ra, vui lòng thử lại" });
  }
};

let verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).send({ message: "Token không hợp lệ" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRET_KEY);
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }

  try {
    const user = await User.findOne({
      where: { user_id: decoded.customer_id, verify_token: token, role_id: 2 },
    });
    if (!user)
      return res
        .status(400)
        .send({ message: "Token không chính xác hoặc đã hết hạn" });

    await user.update({ is_verified: true, verify_token: null });

    return res.send({
      message: "Xác thực email thành công. Bạn có thể đăng nhập.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Có lỗi xảy ra, vui lòng thử lại" });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
  getInfor,
  update,
  changePassword,
  verifyEmail,
};
