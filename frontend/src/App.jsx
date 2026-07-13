import { useEffect, useState } from 'react';
import { register, login, getServices, createService, createBooking, getBookings } from './api';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [serviceTitle, setServiceTitle] = useState('Haircut');
  const [serviceDescription, setServiceDescription] = useState('Professional haircut');
  const [serviceDuration, setServiceDuration] = useState(60);
  const [servicePrice, setServicePrice] = useState(25.5);
  const [bookingData, setBookingData] = useState({
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    customerPhone: '+94771234567',
    serviceId: 1,
    bookingDate: new Date().toISOString().split('T')[0],
    bookingTime: '12:00',
    notes: 'Please call before arriving',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      fetchServices();
      fetchBookings();
    }
  }, [token]);

  const handleRegister = async () => {
    setAuthError('');
    try {
      const response = await register({ email, password });
      localStorage.setItem('token', response.accessToken);
      setToken(response.accessToken);
      setMessage('Registered and logged in successfully');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogin = async () => {
    setAuthError('');
    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.accessToken);
      setToken(response.accessToken);
      setMessage('Logged in successfully');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await getServices(token);
      setServices(data);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await getBookings(token);
      setBookings(data.data || []);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleCreateService = async () => {
    try {
      await createService(token, {
        title: serviceTitle,
        description: serviceDescription,
        duration: Number(serviceDuration),
        price: Number(servicePrice),
        isActive: true,
      });
      setMessage('Service created');
      fetchServices();
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleCreateBooking = async () => {
    try {
      await createBooking(bookingData);
      setMessage('Booking created successfully');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setServices([]);
    setBookings([]);
    setMessage('Logged out');
  };

  return (
    <div className="app-container">
      <header>
        <h1>Booking Platform Client</h1>
        {token ? (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        ) : null}
      </header>

      <section className="card">
        <h2>Authentication</h2>
        <div className="field-row">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
        </div>
        <div className="field-row">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="StrongPass123" />
        </div>
        <div className="button-row">
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </div>
        {authError && <p className="error">{authError}</p>}
      </section>

      <section className="card">
        <h2>Create Booking (Public)</h2>
        <div className="field-row">
          <label>Name</label>
          <input value={bookingData.customerName} onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })} />
        </div>
        <div className="field-row">
          <label>Email</label>
          <input value={bookingData.customerEmail} onChange={(e) => setBookingData({ ...bookingData, customerEmail: e.target.value })} />
        </div>
        <div className="field-row">
          <label>Phone</label>
          <input value={bookingData.customerPhone} onChange={(e) => setBookingData({ ...bookingData, customerPhone: e.target.value })} />
        </div>
        <div className="field-row">
          <label>Service ID</label>
          <input type="number" value={bookingData.serviceId} onChange={(e) => setBookingData({ ...bookingData, serviceId: Number(e.target.value) })} />
        </div>
        <div className="field-row">
          <label>Date</label>
          <input type="date" value={bookingData.bookingDate} onChange={(e) => setBookingData({ ...bookingData, bookingDate: e.target.value })} />
        </div>
        <div className="field-row">
          <label>Time</label>
          <input type="time" value={bookingData.bookingTime} onChange={(e) => setBookingData({ ...bookingData, bookingTime: e.target.value })} />
        </div>
        <div className="field-row">
          <label>Notes</label>
          <input value={bookingData.notes} onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })} />
        </div>
        <button onClick={handleCreateBooking}>Create Booking</button>
      </section>

      {token && (
        <>
          <section className="card">
            <h2>Create Service</h2>
            <div className="field-row">
              <label>Title</label>
              <input value={serviceTitle} onChange={(e) => setServiceTitle(e.target.value)} />
            </div>
            <div className="field-row">
              <label>Description</label>
              <input value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} />
            </div>
            <div className="field-row">
              <label>Duration</label>
              <input type="number" value={serviceDuration} onChange={(e) => setServiceDuration(Number(e.target.value))} />
            </div>
            <div className="field-row">
              <label>Price</label>
              <input type="number" step="0.1" value={servicePrice} onChange={(e) => setServicePrice(Number(e.target.value))} />
            </div>
            <button onClick={handleCreateService}>Create Service</button>
          </section>

          <section className="card">
            <h2>Services</h2>
            {services.length === 0 ? <p>No services yet</p> : null}
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <strong>{service.title}</strong> — {service.description} ({service.duration} mins, ${service.price})
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2>Bookings</h2>
            {bookings.length === 0 ? <p>No bookings yet</p> : null}
            <ul>
              {bookings.map((booking) => (
                <li key={booking.id}>
                  {booking.customerName} — {booking.service?.title || 'Service'} on {booking.bookingDate} at {booking.bookingTime} ({booking.status})
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {message && <div className="toast">{message}</div>}
    </div>
  );
}

export default App;
