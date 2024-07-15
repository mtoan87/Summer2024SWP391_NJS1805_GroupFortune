import React, { useEffect, useState } from 'react';
import { Table, Button, Spin, message, Input, Space, Tooltip, } from 'antd';
import api from '../../../../../config/axios';
import './AuctionsTable.scss';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import Highlighter from 'react-highlight-words'; // Import Highlighter from Ant Design

interface Auction {
  auctionId: number;
  accountId: number | null;
  jewelryGoldId?: number | null;
  jewelryGolddiaId?: number | null;
  jewelrySilverId?: number | null;
  starttime: string;
  endtime: string;
  status: string;
  accountEmail?: string;
  accountName?: string;
  jewelryDetails?: any;
  shipment?: string;
  jewelryName?: string;
}

function AuctionTable() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<[moment.Moment | null, moment.Moment | null]>([null, null]);
  let searchInput: Input | null = null; // Define searchInput here

  useEffect(() => {
    const fetchAccountDetails = async (accountId: number) => {
      try {
        const response = await api.get(`/Account/GetById/${accountId}`);
        return response.data;
      } catch (err) {
        console.error(`Error fetching account details for accountId ${accountId}:`, err);
        return null;
      }
    };

    const fetchJewelryDetails = async (auction: Auction) => {
      try {
        let jewelryDetails = null;
        if (auction.jewelryGoldId) {
          const response = await api.get(`/api/JewelryGold/GetById/${auction.jewelryGoldId}`);
          jewelryDetails = { ...response.data, type: 'Gold' };
        } else if (auction.jewelryGolddiaId) {
          const response = await api.get(`/api/JewelryGoldDia/GetById/${auction.jewelryGolddiaId}`);
          jewelryDetails = { ...response.data, type: 'GoldDia' };
        } else if (auction.jewelrySilverId) {
          const response = await api.get(`/api/JewelrySilver/GetById/${auction.jewelrySilverId}`);
          jewelryDetails = { ...response.data, type: 'Silver' };
        }
    
        if (jewelryDetails) {
          auction.jewelryDetails = jewelryDetails;
          auction.jewelryName = jewelryDetails.name; // Add jewelryName to the auction object
        }
    
        return jewelryDetails;
      } catch (err) {
        console.error('Error fetching jewelry details:', err);
        return null;
      }
    };
    

    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/Auctions/GetAllAuctions');
        if (response.data && Array.isArray(response.data.$values)) {
          const auctionsWithDetails = await Promise.all(
            response.data.$values.map(async (auction: Auction) => {
              if (auction.accountId) {
                const accountDetails = await fetchAccountDetails(auction.accountId);
                if (accountDetails) {
                  auction.accountEmail = accountDetails.accountEmail;
                  auction.accountName = accountDetails.accountName;
                }
              }
              await fetchJewelryDetails(auction); // Fetch jewelry details including name
              return auction;
            })
          );
          console.log(auctionsWithDetails);
          setAuctions(auctionsWithDetails);
        } else {
          console.error('Invalid response data format:', response.data);
          setError('Invalid response data format');
        }
      } catch (err) {
        console.error('Error fetching auctions:', err);
        setError('Error fetching auctions');
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  },[]);
    
  const handleStatusChange = async (auction: Auction) => {
    const newStatus = auction.status === 'Active' ? 'UnActive' : 'Active';
    let apiUrl = '';
    let updateData: any = {
      accountId: auction.accountId,
      starttime: auction.starttime,
      endtime: auction.endtime,
      status: newStatus,
    };

    if (auction.jewelryGoldId !== null) {
      apiUrl = `/api/Auctions/UpdateGoldAuction?id=${auction.auctionId}`;
      updateData['jewelryGoldId'] = auction.jewelryGoldId;
    } else if (auction.jewelryGolddiaId !== null) {
      apiUrl = `/api/Auctions/UpdateGoldDiamondAuction?id=${auction.auctionId}`;
      updateData['jewelryGolddiaId'] = auction.jewelryGolddiaId;
    } else if (auction.jewelrySilverId !== null) {
      apiUrl = `/api/Auctions/UpdateSilverAuction?id=${auction.auctionId}`;
      updateData['jewelrySilverId'] = auction.jewelrySilverId;
    }

    try {
      const sameJewelryAuctions = auctions.filter((a) => {
        if (a.auctionId !== auction.auctionId) { // Exclude the current auction
          if (auction.jewelrySilverId !== null && a.jewelrySilverId !== null && a.jewelrySilverId === auction.jewelrySilverId) {
            return true; // Match for jewelrySilverId
          }
          if (auction.jewelryGoldId !== null && a.jewelryGoldId !== null && a.jewelryGoldId === auction.jewelryGoldId) {
            return true; // Match for jewelryGoldId
          }
          if (auction.jewelryGolddiaId !== null && a.jewelryGolddiaId !== null && a.jewelryGolddiaId === auction.jewelryGolddiaId) {
            return true; // Match for jewelryGolddiaId
          }
        }
        return false;
      });

      console.log("same", sameJewelryAuctions);
      // Prepare promises for deactivating other auctions
      const deactivatePromises = sameJewelryAuctions.map(async (a) => {
        if (a.auctionId !== auction.auctionId && a.status === 'Active') {
          let deactivateApiUrl = '';
          let updateDeactivateData: any = {
            accountId: a.accountId,
            starttime: a.starttime,
            endtime: a.endtime,
            status: 'UnActive',
          };
          if (a.jewelryGoldId !== null) {
            deactivateApiUrl = `/api/Auctions/UpdateGoldAuction?id=${a.auctionId}`;
            updateDeactivateData['jewelryGoldId'] = a.jewelryGoldId;
          } else if (a.jewelryGolddiaId !== null) {
            deactivateApiUrl = `/api/Auctions/UpdateGoldDiamondAuction?id=${a.auctionId}`;
            updateDeactivateData['jewelryGolddiaId'] = a.jewelryGolddiaId;
          } else if (a.jewelrySilverId !== null) {
            deactivateApiUrl = `/api/Auctions/UpdateSilverAuction?id=${a.auctionId}`;
            updateDeactivateData['jewelrySilverId'] = a.jewelrySilverId;
          }

          await api.put(deactivateApiUrl, updateDeactivateData);
        }
      });

      // Execute all deactivate promises
      await Promise.all(deactivatePromises);

      // Update the status of the current auction
      const response = await api.put(apiUrl, updateData);
      console.log("deactivatePromises", response);
      setAuctions((prevAuctions) =>
        prevAuctions.map((a) =>
          a.auctionId === auction.auctionId ? { ...a, status: newStatus } : a
        )
      );
      message.success('Auction status updated successfully');
    } catch (err) {
      console.error('Error updating auction status:', err);
      setError('Error updating auction status');
      message.error('Error updating auction status');
    }
  };

  const expandedRowRender = (record: Auction) => {
    const accountColumns = [
      { title: 'Email', dataIndex: 'accountEmail', key: 'accountEmail' },
      { title: 'Name', dataIndex: 'accountName', key: 'accountName' },
    ];

    const jewelryColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: () => {
          if (record.jewelryDetails?.type === 'Gold') {
            return record.jewelryGoldId;
          } else if (record.jewelryDetails?.type === 'GoldDia') {
            return record.jewelryGolddiaId;
          } else if (record.jewelryDetails?.type === 'Silver') {
            return record.jewelrySilverId;
          }
          return null;
        },
      },
      { title: 'Materials', dataIndex: 'materials', key: 'materials' },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      { title: 'Shipment', dataIndex: 'shipment', key: 'shipment' },
      { title: 'Status', dataIndex: 'status', key: 'status' },
      { title: 'Price', dataIndex: 'price', key: 'price' },
      ...(record.jewelryDetails?.type === 'Gold'
        ? [{ title: 'Gold Age', dataIndex: 'goldAge', key: 'goldAge' }]
        : []),
      ...(record.jewelryDetails?.type === 'GoldDia'
        ? [
            { title: 'Gold Age', dataIndex: 'goldAge', key: 'goldAge' },
            { title: 'Carat', dataIndex: 'carat', key: 'carat' },
            { title: 'Clarity', dataIndex: 'clarity', key: 'clarity' },
          ]
        : []),
      ...(record.jewelryDetails?.type === 'Silver'
        ? [{ title: 'Purity', dataIndex: 'purity', key: 'purity' }]
        : []),
    ];

    return (
      <>
      <>
      <p>Custormer's details</p>
        <Table columns={accountColumns} dataSource={[record]} pagination={false} rowKey="accountId" />
        </>
        {record.jewelryDetails && (
          <>
            <p>Jewelry's Details</p>
            <Table
              columns={jewelryColumns}
              dataSource={[record.jewelryDetails]}
              pagination={false}
              rowKey="id"
            />
          </>
        )}
      </>
    );
  };
  const handleSearch = (selectedKeys: string[], confirm: () => void, dataIndex: string) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleSearchBar = (
    selectedKeys: React.Key[],
    confirm: (param?: string | number) => void,
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0] as string);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  const handleResetBar = (clearFilters: (() => void) | undefined) => {
    clearFilters && clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: string, title?: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${title || dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });
  const columns = [
    { title: 'Auction ID', dataIndex: 'auctionId', key: 'auctionId' ,
      ...getColumnSearchProps('auctionId'),
      
    },
    {
      title: 'Jewelry Name',
      dataIndex: 'jewelryName',
      key: 'jewelryName',
      ...getColumnSearchProps('jewelryName'),
      render: (text: string, record: Auction) => (
        <Tooltip title={<img 
        src={`https://localhost:44361/${record.jewelryDetails?.jewelryImg}`} 
        alt="Jewelry Image" style={{ width: 200, height: 200 }} />}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Start Time',
      dataIndex: 'starttime',
      key: 'starttime',
      sorter: (a: Auction, b: Auction) => moment(a.starttime).unix() - moment(b.starttime).unix(),
      sortDirections: ['ascend', 'descend'],
      render: (starttime: string) => moment(starttime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'End Time',
      dataIndex: 'endtime',
      key: 'endtime',
      sorter: (a: Auction, b: Auction) => moment(a.endtime).unix() - moment(b.endtime).unix(),
      sortDirections: ['ascend', 'descend'],
      render: (endtime: string) => moment(endtime).format('YYYY-MM-DD HH:mm:ss'),  
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'UnActive', value: 'UnActive' },
      ],
      onFilter: (value: string, record: Auction) => record.status === value,
      render: (text, record) => (
        <Button
          type={text === 'Active' ? 'primary' : 'default'}
          onClick={() => handleStatusChange(record)}
        >
          {text}
        </Button>
      ),
    },
  ];

  return (
    <>
     <h1>Auction Management</h1>
      <Input
        placeholder="Search auction data..."
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: '1rem', width: '92rem' }}
        prefix={<SearchOutlined />}
      />
      
      <Table
        columns={columns}
        dataSource={auctions.filter((auction) => {
          if (searchText) {
            const values = Object.values(auction) as Array<string | number>;
            return values.some((value) =>
              value.toString().toLowerCase().includes(searchText.toLowerCase())
            );
          }
          return true;
        })}
        loading={loading}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => !!record.jewelryDetails,
        }}
        rowKey="auctionId"
      />
    </>
  );
}

export default AuctionTable;
