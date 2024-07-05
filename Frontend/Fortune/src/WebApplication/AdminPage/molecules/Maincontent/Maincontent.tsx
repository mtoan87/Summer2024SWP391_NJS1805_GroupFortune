import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Modal, Button, Form, Input } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RubyOutlined, GoldOutlined, UsergroupAddOutlined, DollarOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import './maincontent.scss';

const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const columns = [
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Plan',
    dataIndex: 'plan',
    key: 'plan',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
];

const MainContent = () => {
  const [tableData, setTableData] = useState([
    {
      key: '1',
      time: '09:00 AM',
      plan: 'Meeting with team',
      description: 'Discuss project progress and next steps.',
    },
    {
      key: '2',
      time: '11:00 AM',
      plan: 'Client call',
      description: 'Review project requirements with the client.',
    },
    {
      key: '3',
      time: '01:00 PM',
      plan: 'Lunch break',
      description: 'Take a break and have lunch.',
    },
    {
      key: '4',
      time: '03:00 PM',
      plan: 'Development work',
      description: 'Continue working on the new features.',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newData = {
        key: (tableData.length + 1).toString(),
        time: moment().format('YYYY-MM-DD HH:mm:ss'), // Lấy thời gian hiện tại
        plan: values.plan,
        description: values.description,
      };
      setTableData([...tableData, newData]);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="main-content">
      <h1>BOSS</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={1128}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              suffix={<UsergroupAddOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="New Auction"
              value={93}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              suffix={<GoldOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Amount of Jewelry"
              value={112893}
              valueStyle={{ color: '#D4AF37' }}
              suffix={<RubyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={12893}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="Profits Overview">
            <ResponsiveContainer width="100%" height={410}>
              <LineChart
                data={data}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Performance">
            <Progress type="circle" percent={75} /> USERS
            <div style={{ marginTop: 24 }}>
              <Progress type="circle" percent={50} status="exception" />
            </div>
            <div style={{ marginTop: 24 }}>
              <Progress type="circle" percent={100} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card
            className="table-plan-card"
            title="Table Plan"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={showModal} className="add-plan-button">Add Plan</Button>}
          >
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={{ pageSize: 5 }} // Giới hạn số lượng hàng hiển thị mỗi trang
            />
          </Card>
        </Col>
      </Row>

      <Modal title="Add Plan" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical" className="modal-form">
          <Form.Item
            name="plan"
            label="Plan"
            rules={[{ required: true, message: 'Please input the plan!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MainContent;
