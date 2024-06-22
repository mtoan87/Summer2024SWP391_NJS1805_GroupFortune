import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Slider, Button } from 'antd';
import type { TableProps } from 'antd';
import api from '../../../../../../config/axios';

interface JewelrySilver {
  jewelrySilverId: number;
  accountId: number;
  name: string;
  category: string;
  materials: string;
  description: string;
  purity: string;
  price: number | null;
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

const SilverTable: React.FC = () => {
  const [data, setData] = useState<JewelrySilver[]>([]);
  const [loading, setLoading] = useState(false);
  const [purityRange, setPurityRange] = useState<[number, number]>([0, 100]);
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
            total: response.data.totalCount,
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
    filters: JSON.stringify({
      ...params.filters,
      purity: purityRange,
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
    JSON.stringify(purityRange),
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
  };

  const handlePurityRangeChange = (range: [number, number]) => {
    setPurityRange(range);
  };

  const applyPurityFilter = () => {
    setTableParams({
      ...tableParams,
      filters: {
        ...tableParams.filters,
        purity: purityRange,
      },
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  const columns = [
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
        { text: 'Ring', value: 'ring' },
        { text: 'Necklace', value: 'necklace' },
        { text: 'Bracelet', value: 'bracelet' },
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
      title: 'Purity',
      dataIndex: 'purity',
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Slider
            range
            step={0.01}
            defaultValue={purityRange}
            onChange={handlePurityRangeChange}
            max={100}
            marks={{ 0: '0%', 100: '100%' }}
          />
          <Button
            type="primary"
            onClick={applyPurityFilter}
            style={{ marginTop: 8 }}
          >
            Apply
          </Button>
        </div>
      ),
      filterIcon: () => (
        <Tooltip title={`Purity range: ${purityRange[0]}% - ${purityRange[1]}%`}>
          <span>{`Purity: ${purityRange[0]}% - ${purityRange[1]}%`}</span>
        </Tooltip>
      ),
      onFilter: (value, record) => {
        const [min, max] = value as [number, number];
        const purityValue = parseFloat(record.purity);
        return purityValue >= min && purityValue <= max;
      },
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

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.jewelrySilverId.toString()}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default SilverTable;
