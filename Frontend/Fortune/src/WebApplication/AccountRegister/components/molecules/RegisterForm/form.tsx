import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './form.scss'; // Import the custom CSS file
import useFetch from './api';
function BasicExample() {
  // Define state for each input
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setEmail] = useState('');
  const [accountPassword, setPassword] = useState('');
  const [accountPhone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState('');
  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    // Log the data before sending the request
    const requestData = {
      accountId: 88,
      accountName,
      accountEmail,
      accountPassword,
      accountPhone,
      roleId: 1, // Assuming roleId is fixed for this request
    };
    console.log('Request Data:', requestData);
    
    try {
      const response = await fetch('https://localhost:7152/Account/Create%20Account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      console.log('response Data:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
     if(response.ok===true){
       // Clear form inputs
       setAccountName('');
       setEmail('');
       setPassword('');
       setPhone('');
       setAgree(false);
       
       // Set success message
       setMessage('Account created successfully!');
     }
      // If you need to handle the response from the server, you can do so here
      const responseData = await response.json();
      console.log('Response Data:', responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleInputChange = () => {
    setMessage('');
  };
  return (
    <div className="form-container">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicAccountName">
          <Form.Label>Account Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="User Name"
            value={accountName}
            onChange={(e) => {
              setAccountName(e.target.value);
              handleInputChange(); 
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Example@gmail.com"
            value={accountEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={accountPassword}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Phone Number"
            value={accountPhone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label={
              <span>
                I agree to the{' '}
                <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                  terms and conditions
                </a>
              </span>
            }
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
        </Form.Group>

        <div className='bt'>
          <Button className="Summitbt" variant="primary" type="submit">
            Submit
          </Button>
        </div>
        {message && <p>{message}</p>}
      </Form>
    </div>
  );
}

export default BasicExample;
