import { Card, Col, Row, Typography } from "antd";

import { count } from "./static";
import Header from "@/components/Header";
import dynamic from "next/dynamic";

const EChart = dynamic(
  () => import("@/components/OverviewManagementPage/EChart"),
  { ssr: false }
);

const LineChart = dynamic(
  () => import("@/components/OverviewManagementPage/LineChart"),
  { ssr: false }
);

const PieChart = dynamic(
  () => import("@/components/OverviewManagementPage/PieChart"),
  { ssr: false }
);

const Dashboard = () => {
  const { Title, Text } = Typography;
  return (
    <>
      <Header title="Thống kê" />

      <div className="layout-content">
        <Row
          className="rowgap-vbox"
          style={{ marginTop: "12px" }}
          gutter={[24, 0]}
        >
          {count.map((c, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              xl={6}
              className="mb-24"
            >
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>{c.today}</span>
                      <Title level={3}>{c.title}</Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{c.icon}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <EChart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <PieChart />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
