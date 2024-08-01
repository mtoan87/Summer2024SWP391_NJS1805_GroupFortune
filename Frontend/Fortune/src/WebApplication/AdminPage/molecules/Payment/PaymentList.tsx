import React, { useEffect, useState, useRef } from 'react';
import { Table, Input, Form, Popconfirm, message } from 'antd';
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../../../config/axios';
import './tablePayments.scss'; // Import SCSS file

const { Search } = Input;

const TablePayment = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchPaymentData();
  }, []);

  useEffect(() => {
    filterData();
  }, [paymentData, searchText]);

  const fetchPaymentData = async () => {
    try {
      const response = await api.get('api/Payment/GetAllPayments');
      console.log('Fetched data:', response.data);
      const formattedData = response.data.$values.map(payment => ({
        paymentId: payment.paymentId,
        accountId: payment.accountId,
        auctionResultId: payment.auctionResultId,
        status: payment.status,
        paymentmethod: payment.paymentmethod,
        date: payment.date, // Maintain the original date format
        price: payment.price,
        totalprice: payment.totalprice,
        fee: payment.fee
      }));
      setPaymentData(formattedData);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  const filterData = () => {
    const lowerCaseSearchText = searchText.toLowerCase();
    const filtered = paymentData.filter(payment => {
      return (
        payment.paymentId.toString().includes(lowerCaseSearchText) ||
        payment.accountId.toString().includes(lowerCaseSearchText) ||
        payment.auctionResultId.toString().includes(lowerCaseSearchText) ||
        payment.status.toLowerCase().includes(lowerCaseSearchText) ||
        payment.paymentmethod.toLowerCase().includes(lowerCaseSearchText) ||
        payment.date.includes(lowerCaseSearchText) ||
        payment.price.toString().includes(lowerCaseSearchText) ||
        payment.totalprice.toString().includes(lowerCaseSearchText) ||
        payment.fee.toString().includes(lowerCaseSearchText)
      );
    });
    setFilteredData(filtered);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReload = () => {
    fetchPaymentData();
    setSearchText('');
  };

  const handleSave = async (row) => {
    try {
      await api.put(`api/Payment/UpdatePayment/${row.paymentId}`, row);
      fetchPaymentData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`api/Payment/DeletePayment?id=${id}`);
      message.success('Payment deleted successfully');
      fetchPaymentData(); // Refresh data after delete
    } catch (error) {
      console.error('Error deleting payment:', error);
      message.error('Failed to delete payment');
    }
  };

  const editable = (column) => {
    return column !== 'paymentId' && column !== 'accountId' && column !== 'auctionResultId' && column !== 'action';
  };

  const columns = [
    {
      title: 'Payment ID',
      dataIndex: 'paymentId',
      key: 'paymentId',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Account ID',
      dataIndex: 'accountId',
      key: 'accountId',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Auction Result ID',
      dataIndex: 'auctionResultId',
      key: 'auctionResultId',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentmethod',
      key: 'paymentmethod',
      align: 'center',
      className: 'table-column',
      editable: editable('paymentmethod'),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      className: 'table-column',
      editable: editable('date'),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      className: 'table-column',
      editable: editable('price'),
      render: (text) => `${text}$`,
    },
    {
      title: 'Total Price',
      dataIndex: 'totalprice',
      key: 'totalprice',
      align: 'center',
      className: 'table-column',
      editable: editable('totalprice'),
      render: (text) => `${text}$`,
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      align: 'center',
      className: 'table-column',
      editable: editable('fee'),
      render: (text) => `${text}$`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (_, record) =>
        paymentData.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.paymentId)}>
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        ) : null,
    },
  ];

  const mergedColumns = columns.map(col => ({
    ...col,
    onCell: record => ({
      record,
      editable: editable(col.dataIndex),
      title: col.title,
      handleSave: handleSave,
    }),
  }));

  return (
    <>
      <div className="table-container">
        <h1>Payment Data</h1>
        <ReloadOutlined onClick={handleReload} className="reload" style={{ fontSize: '20px', marginBottom: '10px', cursor: 'pointer' }} />
        <Search
          placeholder="Search payments..."
          onSearch={handleSearch}
          style={{ marginBottom: 10 }}
          enterButton
        />
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergedColumns}
          dataSource={filteredData}
          rowKey="paymentId"
          pagination={{ pageSize: 15 }}
        />
      </div>
    </>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [title]: record[title] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  return (
    <td {...restProps}>
      {editable ? (
        editing ? (
          <Form form={form} component={false}>
            <Form.Item
              name={title}
              style={{ margin: 0 }}
              initialValue={record[title]}
            >
              <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
          </Form>
        ) : (
          <div onClick={toggleEdit}>{children}</div>
        )
      ) : (
        children
      )}
    </td>
  );
};

export default TablePayment;
