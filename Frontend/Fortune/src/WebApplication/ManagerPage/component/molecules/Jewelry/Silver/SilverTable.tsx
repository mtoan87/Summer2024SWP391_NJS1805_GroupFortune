import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Button, message, Input } from 'antd';
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
  toggleStatus: (record: JewelrySilver) => void,
  handlePriceChange: (value: string, record: JewelrySilver) => void,
  savePrice: (record: JewelrySilver) => void
) => [
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
      { text: 'Earrings', value: 'Earrings' },
      { text: 'Pendant', value: 'Pendant' },
      { text: 'Brooch', value: 'Brooch' },
      { text: 'Anklet', value: 'Anklet' },
      { text: 'Charm', value: 'Charm' },
      { text: 'Cufflinks', value: 'Cufflinks' },
      { text: 'Tiara', value: 'Tiara' },
      { text: 'Diadem', value: 'Diadem' },
      { text: 'Choker', value: 'Choker' },
      { text: 'Bangle', value: 'Bangle' },
      { text: 'Hairpin', value: 'Hairpin' },
      { text: 'Barrette', value: 'Barrette' },
      { text: 'Locket', value: 'Locket' },
      { text: 'SignetRing', value: 'SignetRing' },
      { text: 'StudEarrings', value: 'StudEarrings' },
      { text: 'HoopEarrings', value: 'HoopEarrings' },
      { text: 'Cameo', value: 'Cameo' },
      { text: 'ClusterRing', value: 'ClusterRing' },
      { text: 'CocktailRing', value: 'CocktailRing' },
      { text: 'CuffBracelet', value: 'CuffBracelet' }
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Input
          value={price !== null ? price.toString() : ''}
          onChange={(e) => handlePriceChange(e.target.value, record)}
          onBlur={() => savePrice(record)}
          style={{ width: '10%' }}
        />
        <span>$</span>
      </div>
    ),
    
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
      <Button
        type="primary"
        onClick={() => toggleStatus(record)}
        style={{ backgroundColor: record.status === 'Verified' ? 'green' : 'grey', borderColor: record.status === 'Verified' ? 'green' : 'grey' }}
      >
        {record.status === 'Verified' ? 'Verified' : 'Unverified'}
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
    const newStatus = record.status === 'Verified' ? 'Unverified' : 'Verified';
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

  const handlePriceChange = (value: string, record: JewelrySilver) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.jewelrySilverId === record.jewelrySilverId ? { ...item, price: value ? parseFloat(value) : null } : item
      )
    );
  };

  const savePrice = (record: JewelrySilver) => {
    const updatedRecord = { ...record };

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
    formData.append('Status', record.status);

    api.put(`/api/JewelrySilver/UpdateJewelrySilverManager?id=${record.jewelrySilverId}`, formData)
      .then(() => {
        setData((prevData) =>
          prevData.map((item) =>
            item.jewelrySilverId === record.jewelrySilverId ? updatedRecord : item
          )
        );
        
      })
      .catch((error) => {
        console.error('Error updating price:', error);
        message.error('Failed to update price');
      });
  };

  return (
    <Table
      columns={columns(toggleStatus, handlePriceChange, savePrice)}
      rowKey={(record) => record.jewelrySilverId.toString()}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default SilverTable;
