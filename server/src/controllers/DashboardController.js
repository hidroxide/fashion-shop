const Order = require("../models/order");
const OrderStatusChangeHistory = require("../models/order_status_change_history");
const OrderItem = require("../models/order_item");
const Category = require("../models/category");
const ProductVariant = require("../models/product_variant");
const Product = require("../models/product");

const dayjs = require("dayjs");
const { Sequelize } = require("sequelize");

const { Op, fn, col, literal } = Sequelize;

const revenueChart = async (req, res) => {
  const { filter } = req.query;

  try {
    let groupFormat =
      filter === "year"
        ? fn("YEAR", col("created_at"))
        : literal("DATE_FORMAT(`created_at`, '%Y-%m')");

    const data = await OrderStatusChangeHistory.findAll({
      attributes: [
        [groupFormat, "label"],
        [fn("SUM", col("Order.total_order_value")), "total"],
      ],
      where: { state_id: 4 },
      include: [
        {
          model: Order,
          attributes: [],
        },
      ],
      group: [groupFormat],
      order: [literal("label ASC")],
      raw: true,
    });

    const labels = data.map((item) => item.label);
    const totals = data.map((item) => parseInt(item.total, 10));

    res.json({ labels, data: totals });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const revenueByDay = async (req, res) => {
  const { month } = req.query;

  try {
    const startDate = `${month}-01`;
    const endDate = dayjs(startDate).endOf("month").format("YYYY-MM-DD");

    const data = await OrderStatusChangeHistory.findAll({
      attributes: [
        [fn("DATE", col("created_at")), "label"],
        [fn("SUM", col("Order.total_order_value")), "total"],
      ],
      where: {
        state_id: 4,
        created_at: { [Op.between]: [startDate, endDate] },
      },
      include: [{ model: Order, attributes: [] }],
      group: [fn("DATE", col("created_at"))],
      order: [[fn("DATE", col("created_at")), "ASC"]],
      raw: true,
    });

    const categories = data.map((r) => r.label); // VD: '2025-06-01'
    const values = data.map((r) => parseInt(r.total, 10));

    res.json({ categories, data: values });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const revenueByCategory = async (req, res) => {
  try {
    const data = await OrderStatusChangeHistory.findAll({
      where: { state_id: 4 }, // Chỉ tính đơn hàng đã giao
      include: [
        {
          model: Order,
          attributes: [],
          include: [
            {
              model: OrderItem,
              attributes: [],
              include: [
                {
                  model: ProductVariant,
                  attributes: [],
                  include: [
                    {
                      model: Product,
                      attributes: [],
                      include: [
                        {
                          model: Category,
                          attributes: ["title", "category_id"], // ✅ Thêm category_id
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      attributes: [
        [
          col("Order->Order_Items->product_variant->Product->Category.title"),
          "label",
        ],
        [
          col(
            "Order->Order_Items->product_variant->Product->Category.category_id"
          ),
          "category_id",
        ], // ✅ Bổ sung column gây lỗi
        [fn("SUM", col("Order->Order_Items.total_value")), "total"],
      ],
      group: [
        col("Order->Order_Items->product_variant->Product->Category.title"),
        col(
          "Order->Order_Items->product_variant->Product->Category.category_id"
        ),
      ], // ✅ Group cả 2 cột
      raw: true,
    });

    const labels = data.map((item) => item.label || "Không rõ");
    const values = data.map((item) =>
      item.total === null ? 0 : parseInt(item.total, 10)
    );

    res.json({ labels, data: values });
  } catch (err) {
    console.error("Lỗi khi lấy doanh thu theo danh mục:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  revenueChart,
  revenueByDay,
  revenueByCategory,
};
