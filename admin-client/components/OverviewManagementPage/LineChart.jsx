import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography, Select, Spin } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { MinusOutlined } from "@ant-design/icons";
import { homeAPI } from "@/config";

const { Title, Paragraph } = Typography;

function LineChart() {
  const currentMonth = dayjs().format("YYYY-MM");
  const currentYear = parseInt(dayjs().format("YYYY"), 10);

  const [month, setMonth] = useState(currentMonth);
  const [chartData, setChartData] = useState({ categories: [], data: [] });
  const [loading, setLoading] = useState(false);

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, "0");
    return {
      value: `${currentYear}-${m}`,
      label: `Tháng ${i + 1}/${currentYear}`,
    };
  });

  useEffect(() => {
    const fetchRevenueByDay = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${homeAPI}/dashboards/revenue/daily?month=${month}`
        );
        const { categories, data } = res.data;
        setChartData({ categories, data });
      } catch (err) {
        console.error("Lỗi khi lấy doanh thu theo ngày:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueByDay();
  }, [month]);

  const options = {
    chart: {
      width: "100%",
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: chartData.categories,
      labels: { style: { colors: "#000" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#000" },
        formatter: (val) =>
          val.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
          }),
      },
    },

    tooltip: {
      y: {
        formatter: (val) =>
          val.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
          }),
      },
    },
  };

  const series = [
    {
      name: "Doanh thu",
      data: chartData.data,
    },
  ];

  return (
    <>
      <div className="linechart">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Title level={5}>Doanh thu theo ngày</Title>
            <Paragraph className="lastweek">
              Trong tháng <span className="bnb2">{month}</span>
            </Paragraph>
          </div>

          <Select
            style={{ width: 160 }}
            value={month}
            onChange={setMonth}
            options={monthOptions}
          />
        </div>

        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Danh thu</li>
          </ul>
        </div>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <ReactApexChart
          className="full-width"
          options={options}
          series={series}
          type="area"
          height={350}
          width={"100%"}
        />
      )}
    </>
  );
}

export default LineChart;
