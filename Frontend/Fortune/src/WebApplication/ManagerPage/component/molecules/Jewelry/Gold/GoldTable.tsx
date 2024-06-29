import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Button, message ,Input} from 'antd';
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
const goldage = {
  '14K':'Gold14',
  '18K': 'Gold18',
  '20K':'Gold20',
  '22K': 'Gold22',
  '24K': 'Gold24',
}

const columns = (
  toggleStatus: (record:JewelryGold) => void,
  handlePriceChange: (value: string, record: JewelryGold) => void,
  savePrice: (record: JewelryGold) => void
) => [
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
    ]
    ,
    onFilter: (value, record) => record.category.includes(value as string),
  },
  {
    title: 'Shipment',
    dataIndex: 'shipment',
  }
  ,
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
    width: '10%',
    render: (price: number | null, record: JewelryGold) => (
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
    render: (_: string, record: JewelryGold) => (
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
    const newStatus = record.status === 'Verified' ? 'Unverified' : 'Verified';
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

  const handlePriceChange = (value: string, record: jewelryGoldId) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.jewelryGoldId === record.jewelryGoldId ? { ...item, price: value ? parseFloat(value) : null } : item
      )
    );
  };

  const savePrice = (record: JewelryGold) => {
    const updatedRecord = { ...record };

 

    const payloadPrice = {
      accountId: record.accountId,
      jewelryImg: record.jewelryImg,
      name: record.name,
      category: record.category,
      materials: record.materials,
      description: record.description,
      goldAge: record.goldAge,
      price: record.price !== null ? record.price.toString() : '',
      weight: record.weight,
      status: record.status,
    };




    api.put(`/api/JewelryGold/UpdateJewelryGoldManager?id=${record.jewelryGoldId}`, payloadPrice)
      .then(() => {
        setData((prevData) =>
          prevData.map((item) =>
            item.jewelryGoldId === record.jewelryGoldId ? updatedRecord : item
          )
        );
        
      })
      .catch((error) => {
        console.error('Error updating price:', error);
        message.error('Failed to update price');
      });
    };  
  return (
    <>
    <h1>Gold Jewelry Management</h1>
    <Table
    columns={columns(toggleStatus, handlePriceChange, savePrice)}
      rowKey={(record) => record.jewelryGoldId.toString()}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    /></>
  );
};

export default GoldTable;