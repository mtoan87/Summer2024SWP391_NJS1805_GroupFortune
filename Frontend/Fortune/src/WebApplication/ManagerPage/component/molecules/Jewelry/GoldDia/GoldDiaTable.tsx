// SilverTable.tsx

import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Slider, Button } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';
import api from '../../../../../../config/axios';

interface JewelryGoldDia {
  jewelryGolddiaId: number;
  accountId: number;
  name: string;
  category: string;
  materials: string;
  description: string;
  clarity: string;
  carat: string;
  goldAge: string;
  price: number;
  weight: string;
  status: string;
  jewelryImg: string;
}

interface TableParams {
  pagination?: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  sortField?: string;
  sortOrder?: 'ascend' | 'descend' | undefined;
  filters?: Record<string, React.ReactText[] | [number, number]>;
}

const GoldDiaTable: React.FC = () => {
  const [data, setData] = useState<JewelryGoldDia[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = () => {
    setLoading(true);
    const params = getJewelryGoldDiaParams(tableParams);
    api.get('/api/JewelryGoldDia', { params })
      .then((response) => {
        const jewelryGoldDiaData = response.data.$values.map((item: any) => ({
          ...item,
          price: item.price, // Ensure price is properly mapped if needed
        }));
        setData(jewelryGoldDiaData);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination!,
            total: response.data.$values.length, // Adjust according to your API response
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching jewelry gold diamond data:', error);
        setLoading(false);
      });
  };

  const getJewelryGoldDiaParams = (params: TableParams) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    filters: JSON.stringify({
      ...params.filters,
    }),
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

  const handleTableChange: TableProps<JewelryGoldDia>['onChange'] = (
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
  };


  const columns = [
    {
      title: 'Jewelry ID',
      dataIndex: 'jewelryGolddiaId',
      width: '11%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%',
      render: (text: string, record: JewelryGoldDia) => (
        <Tooltip title={<img src={`https://localhost:44361/${record.jewelryImg}`} alt={record.name} style={{ maxWidth: '200px' }} />} >
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
        { text: 'Bracelet', value: 'Bracelet' },
      ],
      onFilter: (value, record) =>
        record.category.toLowerCase().includes((value as string).toLowerCase()),
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
      title: 'Clarity',
      dataIndex: 'clarity',
    },
    {
      title: 'Carat',
      dataIndex: 'carat',
    },
    {
      title: 'Gold Age',
      dataIndex: 'goldAge',
      width: '10%',
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
      render: (price: number) => `$${price}`,
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

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.jewelryGolddiaId.toString()}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default GoldDiaTable;
