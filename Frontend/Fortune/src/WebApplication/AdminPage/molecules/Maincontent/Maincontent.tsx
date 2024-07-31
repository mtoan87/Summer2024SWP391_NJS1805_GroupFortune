import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Modal, Button, Form, Input, Switch, Tabs } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RubyOutlined, GoldOutlined, UsergroupAddOutlined, DollarOutlined, PlusOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import api from '../../../../config/axios';
import './maincontent.scss';

interface DataType {
  key: string;
  time: string;
  plan: string;
  description: string;
}

interface ChartDataType {
  name: string;
  totalPrice?: number;
  totalFees?: number;
}
interface BiddingDataType {
  key: string;
  bidId: number;
  auctionId: number;
  minprice: number;
  maxprice: number;
  datetime: string;
  date: string;
  time: string;
}
interface PaymentDataType {
  key: string;
  paymentId: number;
  accountId: number;
  auctionResultId: number;
  status: number;
  paymentmethod: string;
  price:number;
  totalprice: number;
  fee:number;
  date: string;
  time: string;
}
interface TransactionDataType {
  key: string;
  paymentId: number;
  accountId: number;
  auctionResultId: number;
  status: number;
  paymentmethod: string;
  price:number;
  totalprice: number;
  fee:number;
  date: string;
  time: string;
}
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
const transactionsColumns = [
  {
    title: 'Transaction',
    dataIndex: 'transactionId',
    key: 'transactionId',
  },
  {
    title: 'Wallet Id',
    dataIndex: 'accountwalletId',
    key: 'accountwalletId',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
];
const biddingColumns = [
  {
    title: 'Bid ID',
    dataIndex: 'bidId',
    key: 'bidId',
  },
  {
    title: 'Auction ID',
    dataIndex: 'auctionId',
    key: 'auctionId',
  },
  {
    title: 'Min Price',
    dataIndex: 'minprice',
    key: 'minprice',
  },
  {
    title: 'Max Price',
    dataIndex: 'maxprice',
    key: 'maxprice',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
];
const paymentColumns = [
  {
    title: 'Payment ID',
    dataIndex: 'paymentId',
    key: 'paymentId',
  },
  {
    title: 'Account ID',
    dataIndex: 'accountId',
    key: 'accountId',
  },
  {
    title: 'Payment Method',
    dataIndex: 'paymentmethod',
    key: 'paymentmethod',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Total Price',
    dataIndex: 'totalprice',
    key: 'totalprice',
  },
  {
    title: 'Fee',
    dataIndex: 'fee',
    key: 'fee',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text: string) => {
      let backgroundColor = 'transparent'; // Default background
      let color = 'black'; // Default text color

      if (text === 'Successful') {
        backgroundColor = 'green';
        color = 'white'; // White text for better contrast
      } else if (text === 'Failed') {
        backgroundColor = 'red';
        color = 'white'; // White text for better contrast
      }

      return (
        <span
        style={{
          display: 'inline-block',
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor,
          color,
          textAlign: 'center', // Center-align text
          width: '100%', // Make sure text is centered in the box
          boxSizing: 'border-box' // Ensure padding is included in width
        }}
      >
          {text}
        </span>
      );
    },
  },
];

const MainContent: React.FC = () => {
  const [tableData, setTableData] = useState<DataType[]>([
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
  const [revenue, setRevenue] = useState<number>(0);
  const [monthlyData, setMonthlyData] = useState<ChartDataType[]>([]);
  const [dailyData, setDailyData] = useState<ChartDataType[]>([]);
  const [totalFees, setTotalFees] = useState<number>(0);
  const [amountOfJewelry, setAmountOfJewelry] = useState<number>(0);
  const [amountOfAuction, setAmountOfAuction] = useState<number>(0);
  const [AmountOfCostomer, SetAmountOfCostomer] = useState<number>(0);
  const [biddingData, setBiddingData] = useState<BiddingDataType[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentDataType[]>([]);
  const [transactionsData, setTransactionsData] = useState<TransactionDataType[]>([]);
  const [isMonthlyView, setIsMonthlyView] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch total fees from the API
    api.get('api/Payment/total-fees')
      .then(response => {
        setTotalFees(response.data);
      })
      .catch(error => {
        console.error('Error fetching total fees:', error);
      });

    // Fetch total price from the API
    api.get('api/Payment/total-price')
      .then(response => {
        setRevenue(response.data); // Update state with fetched revenue
      })
      .catch(error => {
        console.error('Error fetching total price:', error);
      });

    // Fetch monthly statistics from the API
    api.get('api/Payment/fees-statistics-by-month')
      .then(response => {
        const monthlyStats = response.data.$values.map((item: any) => ({
          name: moment().month(item.month - 1).format('MMM YYYY'), // Format month and year
          totalPrice: item.totalPrice,
        }));
        setMonthlyData(monthlyStats);
      })
      .catch(error => {
        console.error('Error fetching monthly stats:', error);
      });

    // Fetch daily statistics from the API
    api.get('api/Payment/fees-statistics-by-date')
      .then(response => {
        const dailyStats = response.data.$values.map((item: any) => ({
          name: moment(item.date).format('YYYY-MM-DD'),
          totalFees: item.totalFees,
        }));
        setDailyData(dailyStats);
      })
      .catch(error => {
        console.error('Error fetching daily stats:', error);
      });

      api.get('api/Bid/GetAllBids')
      .then(response => {
        const bids = response.data.$values.map((item: any) => {
          const formattedDateTime = moment(item.datetime);
          const date = formattedDateTime.format('YYYY-MM-DD');
          const time = formattedDateTime.format('HH:mm:ss');
          
          return {
            key: item.bidId.toString(),
            bidId: item.bidId,
            auctionId: item.auctionId,
            minprice: item.minprice,
            maxprice: item.maxprice,
            date,
            time,
          };
        });
        setBiddingData(bids);
      })
      .catch(error => {
        console.error('Error fetching bids data:', error);
      });

      api.get('api/Payment/GetAllPayments')
      .then(response => {
        const Payments = response.data.$values.map((item: any) => {
          const formattedDateTime = moment(item.datetime);
          const date = formattedDateTime.format('YYYY-MM-DD');
          const time = formattedDateTime.format('HH:mm:ss');
          
          return {
            key: item.paymentId.toString(),
            paymentId: item.paymentId,
            accountId: item.accountId,
            auctionResultId: item.auctionResultId,
            paymentmethod: item.paymentmethod,
            price: item.price,
            totalprice: item.totalprice,
            fee: item.fee,
            date,
            time,
            status : item.status,
          };
        });
        setPaymentData(Payments);
      })
      .catch(error => {
        console.error('Error fetching bids data:', error);
      });

      api.get('api/Transaction/GetAllTransactions')
      .then(response => {
        const Transactions = response.data.$values.map((item: any) => {
          const formattedDateTime = moment(item.datetime);
          const date = formattedDateTime.format('YYYY-MM-DD');
          const time = formattedDateTime.format('HH:mm:ss');
          
          return {
            key: item.transactionId.toString(),
            transactionId: item.transactionId,
            accountwalletId: item.accountwalletId,
            amount: item.amount,
            date,
            time,
          };
        });
        setTransactionsData(Transactions);
      })
      .catch(error => {
        console.error('Error fetching bids data:', error);
      });

    api.get('api/Jewelries')
      .then(response => {
        const { jewelrySilver, jewelryGold, jewelryGoldDiamond } = response.data;
        const totalJewelry = [
          ...jewelrySilver.$values,
          ...jewelryGold.$values,
          ...jewelryGoldDiamond.$values,
        ].length;
        setAmountOfJewelry(totalJewelry);
      })
      .catch(error => {
        console.error('Error fetching jewelry data:', error);
      });

      api.get('api/Auctions/GetAllAuctions')
      .then(response => {
 
        const auctions = response.data.$values || [];
  
        const totalAuctions = auctions.length;
   
        setAmountOfAuction(totalAuctions);
      })
      .catch(error => {
        console.error('Error fetching auction data:', error);
      });
      api.get('Account/GetAllAccount')
      .then(response => {
        const accounts = response.data.$values || [];
        const role2Accounts = accounts.filter(account => account.roleId === 2);
        const totalRole2Accounts = role2Accounts.length;
        SetAmountOfCostomer(totalRole2Accounts);
      })
      .catch(error => {
        console.error('Error fetching account data:', error);
      });
    
  }, []);

  
  const combinedData = isMonthlyView
    ? monthlyData
    : dailyData;

 
  const formatXAxis = (tickItem: string) => {
    
    if (tickItem.includes('-')) {
      return moment(tickItem).format('YYYY-MM-DD'); // Return full date for daily data
    } else {
      return moment(tickItem, 'MMM YYYY').format('MMM YYYY'); // Return month and year for monthly data
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newData: DataType = {
        key: (tableData.length + 1).toString(),
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        plan: values.plan,
        description: values.description,
      };
      setTableData([newData, ...tableData]);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="main-content">
      <h1>ADMIN</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={AmountOfCostomer}
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
              value={amountOfAuction}
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
              value={amountOfJewelry}
              valueStyle={{ color: '#D4AF37' }}
              suffix={<RubyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={formatNumber(revenue)}
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
            <Switch
              checked={isMonthlyView}
              onChange={setIsMonthlyView}
              checkedChildren="Month View"
              unCheckedChildren="Date View"
              style={{ marginBottom: 16 }}
            />
            <ResponsiveContainer width="100%" height={410}>
              <LineChart
                data={combinedData}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickFormatter={formatXAxis} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalPrice" stroke="#8884d8" dot={false} />
                <Line type="monotone" dataKey="totalFees" stroke="#82ca9d" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Performance">
            <Progress type="circle" percent={75} /> 
            <div style={{ marginTop: 24 }}>
              <Progress type="circle" percent={50} status="exception" />
            </div>
            <div style={{ marginTop: 24 }}>
            <Progress type="circle" percent={100} status="success" />
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs type="card" tabPosition="top" className="custom-tabs">
          <Tabs.TabPane tab="Biddings" key="1">
          <Table
              columns={biddingColumns}
              dataSource={biddingData}
              pagination={{ pageSize: 5 }}
              rowKey="key"
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Payments" key="2">
          <Table
              columns={paymentColumns}
              dataSource={paymentData}
              pagination={{ pageSize: 5 }}
              rowKey="key"
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Transactions" key="3">
          <Table
              columns={transactionsColumns}
              dataSource={transactionsData}
              pagination={false}
              rowKey="key"
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Revenue" key="4">
          <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              rowKey="key"
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>


      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Tasks">
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              rowKey="key"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
              style={{ marginTop: 16 }}
            >
              Add Task
            </Button>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Add New Task"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          name="add_task"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Plan"
            name="plan"
            rules={[{ required: true, message: 'Please input your plan!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input your description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MainContent;

