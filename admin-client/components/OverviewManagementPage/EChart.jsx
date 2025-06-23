import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { homeAPI } from "@/config";
import { Row, Col, Typography, Spin, Select } from "antd";

function EChart() {
  const { Title, Paragraph } = Typography;
  const { Option } = Select;

  const [chartData, setChartData] = useState({ categories: [], data: [] });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("month");

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${homeAPI}/dashboards/revenue?filter=${filter}`
        );
        const { labels, data } = res.data;
        setChartData({ categories: labels, data });
      } catch (error) {
        console.error("Lỗi lấy dữ liệu biểu đồ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [filter]);

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    grid: {
      show: true,
      borderColor: "#ccc",
      strokeDashArray: 2,
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: { colors: "#fff" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#fff" },
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
      color: "#fff",
    },
  ];

  const items = [
    { Title: "12 triệu", user: "Hôm nay" },
    { Title: "98 triệu", user: "Tuần này" },
    { Title: "350 triệu", user: "Tháng này" },
    { Title: "1.2 tỷ", user: "Năm nay" },
  ];

  return (
    <>
      <div id="chart">
        <div style={{ marginBottom: 20 }}>
          <Select
            defaultValue="month"
            onChange={(value) => setFilter(value)}
            style={{ width: 140 }}
          >
            <Option value="month">Theo tháng</Option>
            <Option value="year">Theo năm</Option>
          </Select>
        </div>

        {loading ? (
          <Spin />
        ) : (
          <ReactApexChart
            className="bar-chart"
            options={options}
            series={series}
            type="bar"
            height={250}
          />
        )}
      </div>

      <div className="chart-vistior">
        <Title level={5}>Thống kê doanh thu</Title>
        <Paragraph className="lastweek">
          So với kỳ trước <span className="bnb2">+15%</span>
        </Paragraph>
        <Paragraph className="lastweek">
          Biểu đồ doanh thu giúp bạn theo dõi hiệu suất bán hàng theo thời gian.
        </Paragraph>
        <Row gutter>
          {items.map((v, index) => (
            <Col xs={6} xl={6} sm={6} md={6} key={index}>
              <div className="chart-visitor-count">
                <Title level={4}>{v.Title}</Title>
                <span>{v.user}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default EChart;
