import { useEffect, useState } from "react";
import { Spin, Typography } from "antd";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { homeAPI } from "@/config";

const { Title } = Typography;

function PieChart() {
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRevenueByCategory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${homeAPI}/dashboards/revenue/category`);

        setChartData(res.data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu pie chart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueByCategory();
  }, []);

  const options = {
    chart: {
      type: "pie",
    },
    labels: chartData.labels,
    legend: {
      position: "bottom",
      labels: {
        colors: "#000",
        useSeriesColors: false,
        formatter: function (seriesName, opts) {
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${seriesName}: ${value.toLocaleString("vi-VN")} ₫`;
        },
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

  const isDataReady =
    chartData &&
    Array.isArray(chartData.labels) &&
    chartData.labels.length > 0 &&
    Array.isArray(chartData.data) &&
    chartData.data.length > 0;

  return (
    <>
      <Title level={5}>Tỉ lệ doanh thu theo danh mục</Title>
      {loading ? (
        <Spin />
      ) : isDataReady ? (
        <ReactApexChart
          options={options}
          series={chartData.data}
          type="pie"
          width={"100%"}
          height={320}
        />
      ) : (
        <div style={{ textAlign: "center", color: "#fff" }}>
          Không có dữ liệu
        </div>
      )}
    </>
  );
}

export default PieChart;
