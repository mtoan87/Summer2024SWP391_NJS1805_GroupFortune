import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Button, message } from 'antd';
import { TableProps } from 'antd/es/table';
import api from '../../../../../../config/axios';

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

const columns = (toggleStatus: (record: JewelryGold) => void) => [
  {
    title: 'Jewelry ID',
    dataIndex: 'jewelryGoldId',
    width: '11%',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '20%',
    render: (text: string, record: JewelryGold) => (
      <Tooltip title={<img src={`https://localhost:44361/${record.jewelryImg}`} alt={record.name} style={{ maxWidth: '200px' }} />}>
        <span>{text}</span>
      </Tooltip>
    ),
  },
  {
    title: 'Category',
    dataIndex: 'category',
    width: '15%',
    filters: [
      { text: 'Ring', value: 'Ring' },
      { text: 'Necklace', value: 'Necklace' },
      { text: 'Bracelet', value: 'Bracelet' },
    ],
    onFilter: (value, record) => record.category.includes(value as string),
  },
  {
    title: 'Materials',
    dataIndex: 'materials',
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Gold Age',
    dataIndex: 'goldAge',
    filters: [
      { text: '24K', value: '24K' },
      { text: '22K', value: '22K' },
      { text: '18K', value: '18K' },
      { text: '14K', value: '14K' },
      { text: '10K', value: '10K' },
    ],
    onFilter: (value, record) => record.goldAge.includes(value as string),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    width: '8%',
    render: (price: number | null) => (price !== null ? `$${price}` : 'null'),
  },
  {
    title: 'Weight',
    dataIndex: 'weight',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    filters: [
      { text: 'Available', value: 'Available' },
      { text: 'UnVerified', value: 'UnVerified' },
    ],
    onFilter: (value, record) => record.status.includes(value as string),
    render: (_: string, record: JewelryGold) => (
      <Button type="primary" onClick={() => toggleStatus(record)}>
        {record.status === 'Available' ? 'UnVerified' : 'Available'}
      </Button>
    ),
  },
];

const GoldTable: React.FC = () => {
  const [data, setData] = useState<JewelryGold[]>([]);
  const [loading, setLoading] = useState(false);
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

  const toggleStatus = (record: JewelryGold) => {
    console.log(record);
    const newStatus = record.status === 'Available' ? 'UnVerified' : 'Available';
    const updatedRecord = { ...record, status: newStatus };
  
    const payload = {
      accountId: record.accountId,
      jewelryImg: record.jewelryImg,
      name: record.name,
      category: record.category,
      materials: record.materials,
      description: record.description,
      goldAge: record.goldAge,
      price: record.price,
      weight: record.weight,
      status: newStatus,
    };
  
    console.log('Payload:', payload); // Log payload for debugging
  
    api.put(`/api/JewelryGold/UpdateJewelryGoldManager?id=${record.jewelryGoldId}`, payload)
      .then(() => {
        setData((prevData) =>
          prevData.map((item) =>
            item.jewelryGoldId === record.jewelryGoldId ? updatedRecord : item
          )
        );
        message.success(`Status updated to ${newStatus}`);
      })
      .catch((error) => {
        console.error('Error updating status:', error);
        message.error('Failed to update status');
      });
  };

  return (
    <Table
      columns={columns(toggleStatus)}
      rowKey={(record) => record.jewelryGoldId.toString()}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default GoldTable;