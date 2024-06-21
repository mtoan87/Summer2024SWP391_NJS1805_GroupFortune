import React, { useEffect, useState } from 'react';
import { Table, Tooltip } from 'antd';
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

const columns = [
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

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.jewelryGoldId.toString()}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default GoldTable;
