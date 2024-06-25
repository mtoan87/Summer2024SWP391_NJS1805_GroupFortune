import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Button, message } from 'antd';
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

const columns = (toggleStatus: (record: JewelrySilver) => void) => [
  {
    title: 'Jewelry ID',
    dataIndex: 'jewelrySilverId',
    width: '11%',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '20%',
    render: (text: string, record: JewelrySilver) => (
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
    title: 'Purity',
    dataIndex: 'purity',
    
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
      { text: 'Verified', value: 'Verified' },
      { text: 'UnVerified', value: 'UnVerified' },
    ],
    onFilter: (value, record) => record.status.includes(value as string),
    render: (_: string, record: JewelrySilver) => (
      <Button type="primary" onClick={() => toggleStatus(record)}>
        {record.status === 'Verified' ? 'Verified' : 'UnVerified'}
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
          .filter((item: any) => item.price !== undefined) 
          .map((item: any) => ({
            ...item,
            price: item.price, 
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
    ...params.filters, 
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

   
    if (
      pagination.pageSize &&
      pagination.pageSize !== tableParams.pagination?.pageSize
    ) {
      setData([]);
    }
  };

  const toggleStatus = (record: JewelrySilver) => {
    const newStatus = record.status === 'Verified' ? 'UnVerified' : 'Verified';
    const updatedRecord = { ...record, status: newStatus };
  
    const formData = new FormData();
    formData.append('AccountId', record.accountId.toString());
    formData.append('JewelryImg', record.jewelryImg);
    formData.append('Name', record.name);
    formData.append('Materials', record.materials);
    formData.append('Category', record.category);
    formData.append('Description', record.description);
    formData.append('Weight', record.weight);
    formData.append('Purity', record.purity);
    formData.append('Price', record.price !== null ? record.price.toString() : '');
    formData.append('Status', newStatus);
  
    api.put(`/api/JewelrySilver/UpdateJewelrySilverManager?id=${record.jewelrySilverId}`, formData)
      .then(() => {
        setData((prevData) =>
          prevData.map((item) =>
            item.jewelrySilverId === record.jewelrySilverId ? updatedRecord : item
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
      rowKey={(record) => record.jewelrySilverId.toString()}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default SilverTable;