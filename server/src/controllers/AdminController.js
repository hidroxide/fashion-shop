const bcrypt = require("bcrypt");
const User = require("../models/user");
const Customer_Info = require("../models/customer_info");

let registerAdmin = async (req, res, next) => {
  let email = req.body.email;
  if (email === undefined)
    return res.status(400).send("Trường email không tồn tại");
  let admin = await User.findOne({ where: { email, role_id: 1 } });
  if (admin) return res.status(409).send("Email đã tồn tại");
  else {
    try {
      let hashPassword = bcrypt.hashSync(req.body.password, 10);
      let newAdmin = { email: email, password: hashPassword, role_id: 1 };
      let createAdmin = await User.create(newAdmin);
      return res.send(createAdmin);
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .send("Có lỗi trong quá trình tạo tài khoản vui lòng thử lại");
    }
  }
};

let loginAdmin = async (req, res, next) => {
  let email = req.body.email;
  if (email === undefined)
    return res.status(400).send("Trường email không tồn tại");
  let password = req.body.password;
  if (password === undefined)
    return res.status(400).send("Trường password không tồn tại");

  try {
    let admin = await User.findOne({ where: { email, role_id: 1 } });
    if (!admin) {
      return res.status(401).send("Email không chính xác");
    }

    let isPasswordValid = bcrypt.compareSync(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).send("Mật khẩu không chính xác");
    }

    return res.send({ email: admin.email });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send("Có lỗi trong quá trình tạo tài khoản vui lòng thử lại");
  }
};

let registerUser = async (req, res) => {
  const { email, password, customer_name, phone_number } = req.body;

  if (!email) return res.status(400).send("Trường email không tồn tại");
  if (!password) return res.status(400).send("Trường password không tồn tại");

  try {
    const existed = await User.findOne({ where: { email, role_id: 2 } });
    if (existed) return res.status(409).send("Email đã tồn tại");

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashPassword,
      role_id: 2,
      is_verified: true,
    });

    await Customer_Info.create({
      user_id: newUser.user_id,
      customer_name: customer_name || "",
      phone_number: phone_number || "",
    });

    return res.send({ message: "Đăng ký thành công", data: newUser });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send("Có lỗi trong quá trình tạo tài khoản vui lòng thử lại");
  }
};

const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { email, new_password, customer_name, phone_number, address } =
    req.body;

  try {
    const user = await User.findOne({ where: { user_id, role_id: 2 } });
    if (!user) return res.status(404).send("Không tìm thấy người dùng");

    // Cập nhật email nếu có
    if (email && email !== user.email) {
      const existed = await User.findOne({ where: { email, role_id: 2 } });
      if (existed)
        return res
          .status(409)
          .send("Email mới đã được sử dụng bởi tài khoản khác");
      await user.update({ email });
    }

    // Cập nhật mật khẩu nếu có
    if (new_password) {
      const hashed = await bcrypt.hash(new_password, 10);
      await user.update({ password: hashed });
    }

    // Cập nhật Customer_Info nếu có
    const customerInfo = await Customer_Info.findOne({ where: { user_id } });
    if (customerInfo) {
      await customerInfo.update({
        customer_name: customer_name ?? customerInfo.customer_name,
        phone_number: phone_number ?? customerInfo.phone_number,
        address: address ?? customerInfo.address,
      });
    }

    return res.send({ message: "Cập nhật thông tin người dùng thành công" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send("Có lỗi xảy ra khi cập nhật thông tin người dùng");
  }
};

const deleteUserByAdmin = async (req, res) => {
  const admin_id = req.token?.customer_id;
  const { user_id } = req.params;

  try {
    const admin = await User.findOne({ where: { user_id: admin_id } });
    if (!admin || admin.role_id !== 1)
      return res.status(403).send("Bạn không có quyền thực hiện thao tác này");

    const user = await User.findOne({ where: { user_id } });
    if (!user) return res.status(404).send("Người dùng không tồn tại");

    await Customer_Info.destroy({ where: { user_id } });
    await User.destroy({ where: { user_id } });

    return res.send({ message: "Đã xoá người dùng thành công" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Lỗi khi xoá người dùng");
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role_id: 2 },
      include: [
        {
          model: Customer_Info,
          attributes: ["customer_name", "phone_number", "address"],
        },
      ],
      attributes: { exclude: ["password", "verify_token"] },
    });

    return res.send({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Có lỗi xảy ra khi lấy danh sách người dùng");
  }
};

const getUserById = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findOne({
      where: { user_id, role_id: 2 },
      include: [
        {
          model: Customer_Info,
          attributes: ["customer_name", "phone_number", "address"],
        },
      ],
      attributes: { exclude: ["password", "verify_token"] },
    });

    if (!user) {
      return res.status(404).send("Người dùng không tồn tại");
    }

    return res.send({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Có lỗi xảy ra khi lấy thông tin người dùng");
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  registerUser,
  updateUser,
  deleteUserByAdmin,
  listUsers,
  getUserById,
};
