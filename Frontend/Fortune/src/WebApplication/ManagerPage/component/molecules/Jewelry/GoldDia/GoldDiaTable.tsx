import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Button, message } from 'antd';
import { TableProps } from 'antd/es/table';
import api from '../../../../../../config/axios';

interface JewelryGoldDia {
  jewelryGolddiaId: number;
  accountId: number;
  name: string;
  category: string;
  materials: string;
  description: string;
  goldAge: string;
  carat: string;
  clarity: string;
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
  '14K':'Gold14',
  '18K': 'Gold18',
  '20K':'Gold20',
  '22K': 'Gold22',
  '24K': 'Gold24',
}
const columns = (toggleStatus: (record: JewelryGoldDia) => void) => [
  {
    title: 'Jewelry ID',
    dataIndex: 'jewelryGolddiaId',
    width: '5%',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '20%',
    render: (text: string, record: JewelryGoldDia) => (
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
    width: '20%',
  },
  {
    title: 'clarity',
    dataIndex: 'clarity',
  },
  {
    title: 'carat',
    dataIndex: 'carat',
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

const GoldTable: React.FC = () => {
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
        const jewelryGoldData = response.data.$values
          .filter((item: any) => item.price !== undefined) 
          .map((item: any) => ({
            ...item,
            price: item.price, 
          }));
        setData(jewelryGoldData);
        console.log(data);
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
        console.error('Error fetching jewelry gold diamond data:', error);
        setLoading(false);
      });
  };

  const getJewelryGoldDiaParams = (params: TableParams) => ({
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

   
    if (
      pagination.pageSize &&
      pagination.pageSize !== tableParams.pagination?.pageSize
    ) {
      setData([]);
    }
  };

  const toggleStatus = (record: JewelryGoldDia) => {
    console.log(record);
    const newStatus = record.status === 'Verified' ? 'Unverified' : 'Verified';
    const updatedRecord = { ...record, status: newStatus };
  
    const payload = {
      accountId: record.accountId,
      jewelryImg: record.jewelryImg,
      name: record.name,
      carat: record.carat,
      clarity: record.clarity,
      category: record.category,
      materials: record.materials,
      description: record.description,
      goldAge: record.goldAge,
      price: record.price,
      weight: record.weight,
      status: newStatus,
    };
  
    console.log('Payload:', payload); 
  
    api.put(`/api/JewelryGoldDia/UpdateJewelryGoldDiamondManager?id=${record.jewelryGolddiaId}`, payload)
      .then(() => {
        setData((prevData) =>
          prevData.map((item) =>
            item.jewelryGolddiaId === record.jewelryGolddiaId ? updatedRecord : item
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
      rowKey={(record) => record.jewelryGolddiaId.toString()}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default GoldTable;