import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Button, message, Input, Select } from 'antd';
import { TableProps } from 'antd/es/table';
import api from '../../../../../../config/axios';
import { SearchOutlined } from '@ant-design/icons';
interface JewelryGold {
  jewelryGoldId: number;
  accountId: number;
  name: string;
  category: string;
  materials: string;
  description: string;
  goldAge: string;
  price: number | null; // Allow null for price field
  weight: string;
  status: string;
  jewelryImg: string; // Assuming this field is present in your API response
  // Add more fields as needed
}

interface TableParams {
  pagination?: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  sortField?: string;
  sortOrder?: 'ascend' | 'descend' | undefined;
  filters?: Record<string, React.ReactText[]>;
}

const goldage = {
  '14K': 'Gold14',
  '18K': 'Gold18',
  '20K': 'Gold20',
  '22K': 'Gold22',
  '24K': 'Gold24',
}

const columns = (
  handlePriceChange: (value: string, record: JewelryGold) => void,
  handleStatusChange: (value: string, record: JewelryGold) => void,
  handleUpdate: (record: JewelryGold) => void
) => [
  {
    title: 'Jewelry ID',
    dataIndex: 'jewelryGoldId',
    width: '10%',
    render: (jewelryGoldId: number) => (jewelryGoldId ? jewelryGoldId : <span style={{ color: 'red' }}>N/A</span>),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '15%',
    render: (text: string, record: JewelryGold) => (
      text ? (
        <Tooltip title={<img src={`https://localhost:44361/${record.jewelryImg}`} alt={record.name} style={{ maxWidth: '200px' }} />}>
          <span>{text}</span>
        </Tooltip>
      ) : (
        <span style={{ color: 'red' }}>N/A</span>
      )
    ),
  },
  {
    title: 'Category',
    dataIndex: 'category',
    width: '10%',
    filters: [
      { text: 'Ring', value: 'Ring' },
      { text: 'Necklace', value: 'Necklace' },
      // Add other categories here
    ],
    onFilter: (value, record) => record.category.includes(value as string),
    render: (category: string) => (category ? category : <span style={{ color: 'red' }}>N/A</span>),
  },
  {
    title: 'Materials',
    dataIndex: 'materials',
    width: '10%',
    render: (materials: string) => (materials ? materials : <span style={{ color: 'red' }}>N/A</span>),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    width: '15%',
    render: (description: string) => (description ? description : <span style={{ color: 'red' }}>N/A</span>),
  },
  {
    title: 'Gold Age',
    dataIndex: 'goldAge',
    filters: [
      { text: '24K', value: 'Gold24' },
      { text: '22K', value: 'Gold22' },
      { text: '20K', value: 'Gold20' },
      { text: '18K', value: 'Gold18' },
      { text: '14K', value: 'Gold14' },
    ],
    onFilter: (value, record) => record.goldAge.includes(value as string),
    render: (goldAge: string) => {
      const age = Object.keys(goldage).find(key => goldage[key] === goldAge);
      return age ? age : <span style={{ color: 'red' }}>N/A</span>;
    },
  },
  {
    title: 'Price',
    dataIndex: 'price',
    width: '10%',
    render: (price: number | null, record: JewelryGold) => (
      <Input
        value={price !== null ? price.toString() : ''}
        onChange={(e) => handlePriceChange(e.target.value, record)}
        style={{ width: '100%' }}
      />
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: '10%',
    filters: [
      { text: 'Verified', value: 'Verified' },
      { text: 'Unverified', value: 'Unverified' },
    ],
    onFilter: (value, record) => record.status.includes(value as string),
    render: (status: string, record: JewelryGold) => (
      <Select
        value={status}
        onChange={(value) => handleStatusChange(value, record)}
        style={{ width: '100%' }}
      >
        <Select.Option value="Verified">Verified</Select.Option>
        <Select.Option value="Unverified">Unverified</Select.Option>
      </Select>
    ),
  },
  {
    title: 'Weight',
    dataIndex: 'weight',
    width: '10%',
    render: (weight: string) => (weight ? weight : <span style={{ color: 'red' }}>N/A</span>),
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    render: (_: string, record: JewelryGold) => (
      <Button type="primary" onClick={() => handleUpdate(record)}>
        Update
      </Button>
    ),
  },
];

const GoldTable: React.FC = () => {
  const [data, setData] = useState<JewelryGold[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  let searchInput: Input | null = null; 
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = () => {
    setLoading(true);
    const params = getJewelryGoldParams(tableParams);
    api.get('/api/JewelryGold', { params })
      .then((response) => {
        const jewelryGoldData = response.data.$values
          .filter((item: any) => item.price !== undefined) // Filter out items without price
          .map((item: any) => ({
            ...item,
            price: item.price, // Price is already defined here
          }));
        setData(jewelryGoldData);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination!,
            total: jewelryGoldData.length,
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching jewelry gold data:', error);
        setLoading(false);
      });
  };

  const getJewelryGoldParams = (params: TableParams) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    ...params.filters, // Include filters directly in the params object
  });

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
  ]);
  const handleSearch = (selectedKeys: string[], confirm: () => void, dataIndex: string) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleSearchBar = (
    selectedKeys: React.Key[],
    confirm: (param?: string | number) => void,
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0] as string);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  const handleResetBar = (clearFilters: (() => void) | undefined) => {
    clearFilters && clearFilters();
    setSearchText('');
  };
  const handleTableChange: TableProps<JewelryGold>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: sorter.order,
      sortField: sorter.field,
    });

    // Clear data when pagination settings change
    if (
      pagination.pageSize &&
      pagination.pageSize !== tableParams.pagination?.pageSize
    ) {
      setData([]);
    }
  };

  const handlePriceChange = (value: string, record: JewelryGold) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.jewelryGoldId === record.jewelryGoldId ? { ...item, price: value ? parseFloat(value) : null } : item
      )
    );
  };

  const handleStatusChange = (value: string, record: JewelryGold) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.jewelryGoldId === record.jewelryGoldId ? { ...item, status: value } : item
      )
    );
  };

  const handleUpdate = (record: JewelryGold) => {
    const updatedRecord = { ...record };
    const formData = new FormData();
    formData.append('Price', record.price !== null ? record.price.toString() : '');
    formData.append('Status', record.status);
    api.put(`/api/JewelryGold/UpdateJewelryGoldManager?id=${record.jewelryGoldId}`, formData)
      .then(() => {
        setData((prevData) =>
          prevData.map((item) =>
            item.jewelryGoldId === record.jewelryGoldId ? updatedRecord : item
          )
        );
        message.success('Record updated successfully');
      })
      .catch((error) => {
        console.error('Error updating record:', error);
        message.error('Failed to update record');
      });
  };

  return (
    <>
      <h1>Gold Jewelry Management</h1>
      <Input
        placeholder="Search auction data..."
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: '1rem', width: '80rem' }}
        prefix={<SearchOutlined />}
      />
      <Table
        columns={columns(handlePriceChange, handleStatusChange, handleUpdate)}
        rowKey={(record) => record.jewelryGoldId.toString()}
        
        dataSource={data.filter((jewelry) => {
          if (searchText) {
            const values = Object.values(jewelry) as Array<string | number>;
            return values.some((value) =>
              value.toString().toLowerCase().includes(searchText.toLowerCase())
            );
          }
          return true;
        })}
        pagination={{ pageSize: 10 }}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default GoldTable;
