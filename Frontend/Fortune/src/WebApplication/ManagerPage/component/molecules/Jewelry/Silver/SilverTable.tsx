import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Button, message, Input, Select } from 'antd';
import { TableProps } from 'antd/es/table';
import api from '../../../../../../config/axios';

interface JewelrySilver {
  jewelrySilverId: number;
  accountId: number;
  name: string;
  category: string;
  materials: string;
  description: string;
  purity: string;
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

const Purity = {
  '92.5%': 'PureSilver925',
  '99.9%': 'PureSilver999',
  '90%': 'PureSilver900',
  '95.8%': 'PureSilver958',
};

const columns = (
  handlePriceChange: (value: string, record: JewelrySilver) => void,
  handleStatusChange: (value: string, record: JewelrySilver) => void,
  handleUpdate: (record: JewelrySilver) => void
) => [
  {
    title: 'Jewelry ID',
    dataIndex: 'jewelrySilverId',
    width: '10%',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '15%',
    render: (text: string, record: JewelrySilver) => (
      <Tooltip title={<img src={`https://localhost:44361/${record.jewelryImg}`} alt={record.name} style={{ maxWidth: '200px' }} />}>
        <span>{text}</span>
      </Tooltip>
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
  },
  {
    title: 'Materials',
    dataIndex: 'materials',
    width: '10%',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    width: '15%',
  },
  {
    title: 'Purity',
    dataIndex: 'purity',
    filters: [
      { text: '99.9%', value: 'PureSilver999' },
      { text: '95.8%', value: 'PureSilver958' },
      { text: '92.5%', value: 'PureSilver925' },
      { text: '90%', value: 'PureSilver900' },
    ],
    onFilter: (value, record) => record.purity.includes(value as string),
    render: (purity: string) => Object.keys(Purity).find(key => Purity[key] === purity),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    width: '10%',
    render: (price: number | null, record: JewelrySilver) => (
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
    render: (status: string, record: JewelrySilver) => (
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
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    render: (_: string, record: JewelrySilver) => (
      <Button type="primary" onClick={() => handleUpdate(record)}>
        Update
      </Button>
    ),
  },
];

const SilverTable: React.FC = () => {
  const [data, setData] = useState<JewelrySilver[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = () => {
    setLoading(true);
    const params = getJewelrySilverParams(tableParams);
    api.get('/api/JewelrySilver', { params })
      .then((response) => {
        const jewelrySilverData = response.data.$values
          .filter((item: any) => item.price !== undefined) // Filter out items without price
          .map((item: any) => ({
            ...item,
            price: item.price, // Price is already defined here
          }));
        setData(jewelrySilverData);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination!,
            total: jewelrySilverData.length,
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching jewelry silver data:', error);
        setLoading(false);
      });
  };

  const getJewelrySilverParams = (params: TableParams) => ({
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

  const handleTableChange: TableProps<JewelrySilver>['onChange'] = (
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

  const handlePriceChange = (value: string, record: JewelrySilver) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.jewelrySilverId === record.jewelrySilverId ? { ...item, price: value ? parseFloat(value) : null } : item
      )
    );
  };

  const handleStatusChange = (value: string, record: JewelrySilver) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.jewelrySilverId === record.jewelrySilverId ? { ...item, status: value } : item
      )
    );
  };

  const handleUpdate = (record: JewelrySilver) => {
    const updatedRecord = { ...record };
    const formData = new FormData();
    formData.append('Price', record.price !== null ? record.price.toString() : '');
    formData.append('Status', record.status);
    api.put(`/api/JewelrySilver/UpdateJewelrySilverManager?id=${record.jewelrySilverId}`, formData)
      .then(() => {
        setData((prevData) =>
          prevData.map((item) =>
            item.jewelrySilverId === record.jewelrySilverId ? updatedRecord : item
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
      <h1>Silver Jewelry Management</h1>
      <Table
        columns={columns(handlePriceChange, handleStatusChange, handleUpdate)}
        rowKey={(record) => record.jewelrySilverId.toString()}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default SilverTable;
