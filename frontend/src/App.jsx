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
  const [serviceTitle, setServiceTitle] = useState('Deluxe Room');
  const [serviceDescription, setServiceDescription] = useState('Sea view room with king-size bed');
  const [serviceDuration, setServiceDuration] = useState(1);
  const [servicePrice, setServicePrice] = useState(120.0);
  const [bookingData, setBookingData] = useState({
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+94771234567',
    serviceId: 1,
    bookingDate: new Date().toISOString().split('T')[0],
    bookingTime: '14:00',
    notes: 'Late check-in requested',
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
      setMessage('Room type added');
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
      <div className="hero-banner">
        <div>
          <p className="eyebrow">Hotel Booking Dashboard</p>
          <h1>Reserve rooms instantly</h1>
          <p className="hero-copy">A simple hotel booking frontend integrated with your NestJS booking API.</p>
        </div>
        <div className="hero-box">
          <p>Fast hotel reservations</p>
          <p>Room management</p>
          <p>Booking overview</p>
        </div>
      </div>

      <header>
        <h2>Admin portal</h2>
        {token && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>

      <div className="grid-layout">
        <section className="card card-highlight">
          <h3>Authentication</h3>
          <p>Login to manage rooms and view reservations.</p>
          <div className="field-row">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hotel@admin.com" />
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

        <section className="card card-highlight">
          <h3>Quick Booking</h3>
          <p>Guests can submit bookings without login.</p>
          <div className="field-row">
            <label>Guest Name</label>
            <input value={bookingData.customerName} onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })} />
          </div>
          <div className="field-row">
            <label>Guest Email</label>
            <input value={bookingData.customerEmail} onChange={(e) => setBookingData({ ...bookingData, customerEmail: e.target.value })} />
          </div>
          <div className="field-row">
            <label>Phone</label>
            <input value={bookingData.customerPhone} onChange={(e) => setBookingData({ ...bookingData, customerPhone: e.target.value })} />
          </div>
          <div className="field-row">
            <label>Room ID</label>
            <input type="number" value={bookingData.serviceId} onChange={(e) => setBookingData({ ...bookingData, serviceId: Number(e.target.value) })} />
          </div>
          <div className="field-row">
            <label>Check-in</label>
            <input type="date" value={bookingData.bookingDate} onChange={(e) => setBookingData({ ...bookingData, bookingDate: e.target.value })} />
          </div>
          <div className="field-row">
            <label>Arrival time</label>
            <input type="time" value={bookingData.bookingTime} onChange={(e) => setBookingData({ ...bookingData, bookingTime: e.target.value })} />
          </div>
          <div className="field-row">
            <label>Notes</label>
            <input value={bookingData.notes} onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })} />
          </div>
          <button onClick={handleCreateBooking}>Book Room</button>
        </section>
      </div>

      {token && (
        <div className="grid-layout">
          <section className="card">
            <h3>Add Room Type</h3>
            <p>Create room offerings for guests.</p>
            <div className="field-row">
              <label>Room Name</label>
              <input value={serviceTitle} onChange={(e) => setServiceTitle(e.target.value)} />
            </div>
            <div className="field-row">
              <label>Description</label>
              <input value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} />
            </div>
            <div className="field-row">
              <label>Capacity</label>
              <input type="number" value={serviceDuration} onChange={(e) => setServiceDuration(Number(e.target.value))} />
            </div>
            <div className="field-row">
              <label>Price / night</label>
              <input type="number" step="0.1" value={servicePrice} onChange={(e) => setServicePrice(Number(e.target.value))} />
            </div>
            <button onClick={handleCreateService}>Add Room Type</button>
          </section>

          <section className="card">
            <h3>Available Rooms</h3>
            {services.length === 0 ? <p>No room types yet.</p> : null}
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <div className="room-title">{service.title}</div>
                  <div className="room-details">{service.description}</div>
                  <div className="room-meta">Capacity: {service.duration} | ${service.price}/night</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h3>Recent Reservations</h3>
            {bookings.length === 0 ? <p>No reservations yet.</p> : null}
            <ul>
              {bookings.map((booking) => (
                <li key={booking.id}>
                  <div className="booking-title">{booking.customerName}</div>
                  <div className="booking-details">
                    {booking.service?.title || 'Room'} • {booking.bookingDate} {booking.bookingTime}
                  </div>
                  <div className="booking-status">Status: {booking.status}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {message && <div className="toast">{message}</div>}
    </div>
  );
}

export default App;
