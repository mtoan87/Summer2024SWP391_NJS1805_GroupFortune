import React, { useState, useEffect } from 'react';
import { Select, Row, Col, Card, Statistic, Progress, Table, Modal, Button, Form, Input, Switch, Tabs } from 'antd';
import { Cell,PieChart, Pie,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RubyOutlined, GoldOutlined, UsergroupAddOutlined, DollarOutlined, PlusOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import api from '../../../../config/axios';
import './maincontent.scss';
const { Option } = Select;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
interface DataType {
  key: string;
  time: string;
  plan: string;
  description: string;
}
interface PieChartData {
  name: string;
  value: number;
}
interface ChartDataType {
  name: string;
  sales?: number;
  profits?: number;
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
    render: (text: string) => `${text}$`,
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
    render: (text: string) => `${text}$`,
  },
  {
    title: 'Max Price',
    dataIndex: 'maxprice',
    key: 'maxprice',
    render: (text: string) => `${text}$`,
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
    width: 100,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (text: string) => `${text}$`,
  },
  {
    title: 'Total Price',
    dataIndex: 'totalprice',
    key: 'totalprice',
    render: (text: string) => `${text}$`,
  },
  {
    title: 'Fee',
    dataIndex: 'fee',
    key: 'fee',
    render: (text: string) => `${text}$`,
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

  // const [isModalVisible, setIsModalVisible] = useState(false);
  const [revenue, setRevenue] = useState<number>(0);
  // const [monthlyData, setMonthlyData] = useState<ChartDataType[]>([]);
  // const [dailyData, setDailyData] = useState<ChartDataType[]>([]);
  const [totalFees, setTotalFees] = useState<number>(0);
  const [amountOfJewelry, setAmountOfJewelry] = useState<number>(0);
  const [amountOfAuction, setAmountOfAuction] = useState<number>(0);
  const [AmountOfCostomer, SetAmountOfCostomer] = useState<number>(0);
  const [biddingData, setBiddingData] = useState<BiddingDataType[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentDataType[]>([]);
  const [transactionsData, setTransactionsData] = useState<TransactionDataType[]>([]);
  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState<PieChartData[]>([]);
  const [viewBy, setViewBy] = useState('month');
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState({});
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAvailableYearsAndMonths();
  }, []);

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
    
      if (viewBy === 'month' && selectedYear !== null) {
        fetchMonthlyData(selectedYear);
      } else if (viewBy === 'year' && selectedYear !== null && selectedMonth !== null) {
        fetchDailyData(selectedYear, selectedMonth);
      }


      
  }, [viewBy, selectedYear, selectedMonth]);

  const fetchAvailableYearsAndMonths = async () => {
    try {
      const [monthResponse, dateResponse] = await Promise.all([
        api.get('api/Payment/fees-statistics-by-month'),
        api.get('api/Payment/fees-statistics-by-date'),
      ]);

      const years = new Set();
      const months = {};

      monthResponse.data.$values.forEach(item => {
        years.add(item.year);
        if (!months[item.year]) {
          months[item.year] = new Set();
        }
        months[item.year].add(item.month);
      });

      dateResponse.data.$values.forEach(item => {
        const year = new Date(item.date).getFullYear();
        const month = new Date(item.date).getMonth() + 1;
        years.add(year);
        if (!months[year]) {
          months[year] = new Set();
        }
        months[year].add(month);
      });

      setAvailableYears(Array.from(years).sort((a, b) => b - a));
      setAvailableMonths(months);
    } catch (error) {
      console.error('Error fetching available years and months:', error);
    }
  };

  const fetchMonthlyData = async (year) => {
    try {
      const response = await api.get(`api/Payment/fees-statistics-by-month`);
      const monthlyData = response.data.$values
        .filter(item => item.year === year)
        .map(item => ({
          name: `${item.year}-${item.month}`,
          profits: item.totalFees,
          sales: item.totalPrice
        }));
      setData(monthlyData);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const fetchDailyData = async (year, month) => {
    try {
      const response = await api.get(`api/Payment/fees-statistics-by-date`);
      const dailyData = response.data.$values
        .filter(item => new Date(item.date).getFullYear() === year && new Date(item.date).getMonth() + 1 === month)
        .map(item => ({
          name: item.date.split('T')[0],
          profits: item.totalFees,
          sales: item.totalPrice
        }));
      setData(dailyData);
    } catch (error) {
      console.error('Error fetching daily data:', error);
    }
  };
  
  // const showModal = () => {
  //   setIsModalVisible(true);
  // };

  // const handleOk = () => {
  //   form.validateFields().then(values => {
  //     const newData: DataType = {
  //       key: (tableData.length + 1).toString(),
  //       time: moment().format('YYYY-MM-DD HH:mm:ss'),
  //       plan: values.plan,
  //       description: values.description,
  //     };
  //     setTableData([newData, ...tableData]);
  //     setIsModalVisible(false);
  //     form.resetFields();
  //   });
  // };

  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  const handleViewChange = (value) => {
    setViewBy(value);
    setSelectedYear(null);
    setSelectedMonth(null);
    setData([]);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    setSelectedMonth(null);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const PieChartComponent: React.FC = () => {
  const [data, setData] = useState<PieChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalPriceResponse = await api.get('api/Payment/total-price');
        const totalPrice = totalPriceResponse.data;
        const totalFeesResponse = await api.get('api/Payment/total-fees');
        const totalFees = totalFeesResponse.data;
        const priceResponse = await api.get('api/Payment/price');
        const price = priceResponse.data;
        const totalSales = totalFees + price;
        setData([
          { name: 'Profit', value: totalFees },
          { name: 'Sales', value: price },
          // { name: 'Total Sales', value: totalSales },
        ]);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <PieChart width={400} height={400}>
      <Tooltip />
      <Legend />
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        outerRadius={150}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
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
              title="Profit"
              value={formatNumber(totalFees)}
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
          <Row style={{ marginBottom: 20 }}>
        <Col>
          <Select defaultValue="Select View Type" onChange={handleViewChange} style={{ width: 120, marginRight: 10 }}>
            <Option value="year">Month</Option>
            <Option value="month">Year</Option>
          </Select>
        </Col>
        <Col>
          <Select
            placeholder="Select Year"
            onChange={handleYearChange}
            style={{ width: 120, marginRight: 10 }}
            value={selectedYear}
          >
            {availableYears.map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        </Col>
        {viewBy === 'year' && selectedYear !== null && (
          <Col>
            <Select
              placeholder="Select Month"
              onChange={handleMonthChange}
              style={{ width: 120 }}
              value={selectedMonth}
              disabled={selectedYear === null}
            >
              {availableMonths[selectedYear] && Array.from(availableMonths[selectedYear]).map(month => (
                <Option key={month} value={month}>{month}</Option>
              ))}
            </Select>
          </Col>
        )}
      </Row>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="profits" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Performance">
          <PieChartComponent />
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


      {/* <Row gutter={16} style={{ marginTop: 16 }}>
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
      </Modal> */}
    </div>
  );
};

export default MainContent;