import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Button, message, Input, Select } from 'antd';
import { TableProps } from 'antd/es/table';
import api from '../../../../../../config/axios';

interface jewelryGoldDia {
  jewelryGolddiaId: number;
  accountId: number;
  name: string;
  category: string;
  materials: string;
  description: string;
  goldAge: string;
  clarity: string;
  carat: string;
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
  handlePriceChange: (value: string, record: jewelryGoldDia) => void,
  handleStatusChange: (value: string, record: jewelryGoldDia) => void,
  handleUpdate: (record: jewelryGoldDia) => void
) => [
  {
    title: 'Jewelry ID',
    dataIndex: 'jewelryGolddiaId',
    width: '10%',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '15%',
    render: (text: string, record: jewelryGoldDia) => (
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
    render: (goldAge: string) => Object.keys(goldage).find(key => goldage[key] === goldAge),
  },
  {
    title: 'clarity',
    dataIndex: 'clarity',
    filters: [
      { text: 'FL', value: 'FL' },
      { text: 'IF', value: 'IF' },
      { text: 'VVS1', value: 'VVS1' },
      { text: 'VVS2', value: 'VVS2' },
      { text: 'VS1', value: 'VS1' },
      { text: 'VS2', value: 'VS2' },
      { text: 'SI1', value: 'SI1' },
      { text: 'SI2', value: 'SI2' },
      { text: 'I1', value: 'I1' },
      { text: 'I2', value: 'I2' },
      { text: 'I3', value: 'I3' },
    ],
    onFilter: (value, record) => record.clarity.includes(value as string)
  },
  {
    title: 'carat',
    dataIndex: 'carat',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    width: '10%',
    render: (price: number | null, record: jewelryGoldDia) => (
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
    render: (status: string, record: jewelryGoldDia) => (
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
    render: (_: string, record: jewelryGoldDia) => (
      <Button type="primary" onClick={() => handleUpdate(record)}>
        Update
      </Button>
    ),
  },
];

const GoldTable: React.FC = () => {
  const [data, setData] = useState<jewelryGoldDia[]>([]);
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
    api.get('/api/JewelryGoldDia', { params })
      .then((response) => {
        const jewelryGoldDiaData = response.data.$values
          .filter((item: any) => item.price !== undefined) // Filter out items without price
          .map((item: any) => ({
            ...item,
            price: item.price, // Price is already defined here
          }));
        setData(jewelryGoldDiaData);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination!,
            total: jewelryGoldDiaData.length,
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

  const handleTableChange: TableProps<jewelryGoldDia>['onChange'] = (
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

  const handlePriceChange = (value: string, record: jewelryGoldDia) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.jewelryGolddiaId === record.jewelryGolddiaId ? { ...item, price: value ? parseFloat(value) : null } : item
      )
    );
  };

  const handleStatusChange = (value: string, record: jewelryGoldDia) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.jewelryGolddiaId === record.jewelryGolddiaId ? { ...item, status: value } : item
      )
    );
  };

  const handleUpdate = (record: jewelryGoldDia) => {
    const updatedRecord = { ...record };
    const formData = new FormData();
    formData.append('Price', record.price !== null ? record.price.toString() : '');
    formData.append('Status', record.status);
    api.put(`/api/JewelryGoldDia/UpdateJewelryGoldDiamondManager?id=${record.jewelryGolddiaId}`, formData)
      .then(() => {
        setData((prevData) =>
          prevData.map((item) =>
            item.jewelryGolddiaId === record.jewelryGolddiaId ? updatedRecord : item
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
      <Table
        columns={columns(handlePriceChange, handleStatusChange, handleUpdate)}
        rowKey={(record) => record.jewelryGolddiaId.toString()}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default GoldTable;
