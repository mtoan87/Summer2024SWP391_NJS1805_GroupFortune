import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './form.scss'; 
import api from '../../../../../config/axios';
import { useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css'
function BasicExample() {
  // Define state for each input
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setEmail] = useState('');
  const [accountPassword, setPassword] = useState('');
  const [accountPhone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Log the data before sending the request
    const requestData = {
      accountName,
      accountEmail,
      accountPassword,
      accountPhone,
    };
    console.log('Request Data:', requestData);
    
    try {
      const response = await api.post('api/Login/register', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response:', response);
      
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clear form inputs
      setAccountName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setAgree(false);
      
      // Set success message and navigate to login page with the message in URL parameters
      setMessage('Account created successfully!');
      navigate("/login?successMessage=Account+created+successfully!");
      console.log('Response Data:', response.data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to create account. Please check your inputs.');
    }
  };

  const handleInputChange = () => {
    setMessage('');
  };

  return (
    <div className="form-container">
              <div className='Alert'>
              {message && <Alert key={'danger'} variant={'danger'}>
          {message}
        </Alert>}</div>
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
            onChange={(e) => {
              setEmail(e.target.value);
              handleInputChange(); 
            }}
          />
          <Form.Text className="text-muted" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={accountPassword}
            onChange={(e) => {
              setPassword(e.target.value);
              handleInputChange(); 
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Phone Number"
            value={accountPhone}
            onChange={(e) => {
              setPhone(e.target.value);
              handleInputChange(); 
            }}
          />
        </Form.Group>
        
        <Button className="Summitbt" variant="primary" type="submit">
          Register
        </Button>

      </Form>
     
    </div>
  );
}

export default BasicExample;
