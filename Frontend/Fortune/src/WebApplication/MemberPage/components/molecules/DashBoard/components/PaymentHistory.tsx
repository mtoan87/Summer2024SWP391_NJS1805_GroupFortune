import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import api from '../../../../../../config/axios';

interface Payment {
  paymentId: number;
  accountId: number;
  auctionResultId: number;
  status: string;
  paymentmethod: string;
  date: string;
  time: string;
  price: number;
  totalprice: number;
  fee: number;
  account: Account;
}

interface Account {
  accountId: number;
  accountName: string;
  accountEmail: string;
  accountPhone: string;
  roleId: number;
  accountWallets: AccountWallet[];
}

interface AccountWallet {
  accountwalletId: number;
  accountId: number;
  bankName: string;
  bankNo: number;
  budget: number;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const loginedUser = sessionStorage.getItem('loginedUser');

      if (!loginedUser) {
        setError('No logged-in user found.');
        return;
      }

      const user = JSON.parse(loginedUser);
      const accountId = user.accountId;

      try {
        const response = await api.get<{ $id: string, $values: Payment[] }>(`api/Payment/GetPaymentByAccountId?id=${accountId}`);
        
        if (response.data && response.data.$values) {
          const formattedPayments = response.data.$values.map(payment => {
            const [date, time] = formatDateTime(payment.date);
            return {
              ...payment,
              date,
              time,
            };
          });
          setPayments(formattedPayments);
        } else {
          setPayments([]);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch payment history');
      }
    };

    const formatDateTime = (dateTime: string): [string, string] => {
      const jsDate = new Date(dateTime);
      const date = jsDate.toLocaleDateString();
      const time = jsDate.toLocaleTimeString();
      return [date, time];
    };

    fetchPaymentHistory();
  }, []);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: keyof Payment,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof Payment): TableColumnType<Payment> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<Payment> = [
    {
      title: 'Payment ID',
      dataIndex: 'paymentId',
      key: 'paymentId',
      ...getColumnSearchProps('paymentId'),
    },
   
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentmethod',
      key: 'paymentmethod',
      ...getColumnSearchProps('paymentmethod'),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      ...getColumnSearchProps('date'),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      ...getColumnSearchProps('time'),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      ...getColumnSearchProps('price'),
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      ...getColumnSearchProps('fee'),
    },
    {
      title: 'Total Price',
      dataIndex: 'totalprice',
      key: 'totalprice',
      ...getColumnSearchProps('totalprice'),
    },
   
  ];

  return (
    <div>
      <h1>Payment History</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Table columns={columns} dataSource={payments} rowKey="paymentId" />
    </div>
  );
};

export default PaymentHistory;
