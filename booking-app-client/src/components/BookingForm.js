// import React, { useState } from 'react';
// import axios from 'axios';
// import './BookingForm.css'; // Import your CSS styles

// const BookingForm = () => {
//   const [userCheckIn, setUserCheckIn] = useState('');
//   const [userCheckOut, setUserCheckOut] = useState('');
//   const [ownerNotification, setOwnerNotification] = useState('');
//   const [pendingRequests, setPendingRequests] = useState([]);

//   const handleUserBooking = async () => {
//     if (!userCheckIn || !userCheckOut) {
//       setOwnerNotification('User: Please select both check-in and check-out dates.');
//       return;
//     }
    
//     try {
//       const response = await axios.post('http://localhost:5000/api/bookings', {
//         checkIn: userCheckIn,
//         checkOut: userCheckOut,
//         userId: '123', // Example user ID
//         ownerId: '456'  // Example owner ID
//       });
//       setPendingRequests([...pendingRequests, { id: response.data.booking._id, userId: '123' }]);
//       setOwnerNotification(`User Booking Requested: ${response.data.message}`);
//     } catch (error) {
//       console.error('Error confirming user booking:', error);
//       setOwnerNotification('User Booking failed: ' + (error.response ? error.response.data.message : 'Unknown error'));
//     }
//   };

//   const handleApproveBooking = async (bookingId) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/bookings/approve', {
//         requestId: bookingId,
//       });

//       alert(`Booking approved: ${response.data.message}`);
//       setPendingRequests(pendingRequests.filter(req => req.id !== bookingId)); // Remove approved request
//     } catch (error) {
//       console.error('Error approving booking:', error);
//       alert('Approval failed: ' + (error.response ? error.response.data.message : 'Unknown error'));
//     }
//   };

//   return (
//     <div className="booking-container">
//       <h2 className="booking-title">Booking Form</h2>
      
//       {/* User Booking Section */}
//       <div className="booking-section">
//         <h3>User Check-In/Out</h3>
//         <label className="booking-label">
//           Check-In Date:
//           <input 
//             type="date" 
//             className="booking-input" 
//             value={userCheckIn} 
//             onChange={(e) => setUserCheckIn(e.target.value)} 
//           />
//         </label>
//         <label className="booking-label">
//           Check-Out Date:
//           <input 
//             type="date" 
//             className="booking-input" 
//             value={userCheckOut} 
//             onChange={(e) => setUserCheckOut(e.target.value)} 
//           />
//         </label>
//         <button className="booking-button" onClick={handleUserBooking}>
//           Request User Booking
//         </button>
//       </div>
      
//       {/* Owner Notification Section */}
//       <div className="booking-section">
//         <h3>Owner Notifications</h3>
        
//         {/* Owner Notification */}
//         {ownerNotification && (
//           <div className="notification">
//             {ownerNotification}
//           </div>
//         )}
        
//         <h3>Pending Booking Requests</h3>
//         {pendingRequests.length === 0 ? (
//           <p>No pending requests</p>
//         ) : (
//           <ul>
//             {pendingRequests.map(request => (
//               <li key={request.id}>
//                 Booking Request from User {request.userId} 
//                 <button onClick={() => handleApproveBooking(request.id)}>Approve</button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookingForm;






import React, { useState } from 'react';
import axios from 'axios';
import './BookingForm.css'; // Import your CSS styles

const UserBookingForm = ({ onRequestBooking, userNotification }) => {
  const [userCheckIn, setUserCheckIn] = useState('');
  const [userCheckOut, setUserCheckOut] = useState('');

  const handleUserBooking = async () => {
    if (!userCheckIn || !userCheckOut) {
      onRequestBooking('Please select both check-in and check-out dates.', ''); // Pass error message
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
        checkIn: userCheckIn,
        checkOut: userCheckOut,
        userId: '123', // Example user ID
        ownerId: '456' // Example owner ID
      });
      onRequestBooking(`Booking Requested: Your booking is pending approval.`, response.data.booking._id); // Pass booking ID
    } catch (error) {
      console.error('Error confirming user booking:', error);
      onRequestBooking('Booking failed: ' + (error.response ? error.response.data.message : 'Unknown error'), ''); // Pass error message
    }
  };

  return (
    <div className="user-booking-form">
      <h3>User Check-In/Out</h3>
      <label>
        Check-In Date:
        <input type="date" value={userCheckIn} onChange={(e) => setUserCheckIn(e.target.value)} />
      </label>
      <label>
        Check-Out Date:
        <input type="date" value={userCheckOut} onChange={(e) => setUserCheckOut(e.target.value)} />
      </label>
      <button onClick={handleUserBooking}>Request Booking</button>
      {userNotification && <div className="notification">{userNotification}</div>} {/* Show user notification */}
    </div>
  );
};

const OwnerPage = ({ pendingRequests, onApproveBooking }) => {
  return (
    <div className="owner-page">
      <h3>Owner Page: Pending Booking Requests</h3>
      {pendingRequests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ul>
          {pendingRequests.map(request => (
            <li key={request.id}>
              Booking Request from User {request.userId}
              <button className="approve-button" onClick={() => onApproveBooking(request)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const BookingForm = () => {
  const [pendingRequests, setPendingRequests] = useState([]); // Stores requests from users that are pending approval.
  const [userNotifications, setUserNotifications] = useState({}); // Store notifications for users
  const [ownerNotifications, setOwnerNotifications] = useState([]); // Store notifications for owners

  const handleRequestBooking = (notification, bookingId) => {
    if (bookingId) {
      setPendingRequests(prev => [...prev, { id: bookingId, userId: '123', status: 'pending' }]);
    }
    setUserNotifications(prev => ({ ...prev, '123': notification })); // Update user notification
    if (notification.includes("pending")) {
      setOwnerNotifications(prev => [...prev, `New booking request from User 123`]); // Notify owner
    }
  };

  const handleApproveBooking = async (request) => {
    try {
      const response = await axios.post('http://localhost:5000/api/bookings/approve', { requestId: request.id });
      const message = response.data.message;

      // Update the status of the approved booking
      setPendingRequests(prev =>
        prev.map(req =>
          req.id === request.id ? { ...req, status: 'confirmed' } : req
        )
      );

      // Update the user notification to confirm the booking
      setUserNotifications(prev => ({
        ...prev,
        [request.userId]: `Booking Confirmed: Your booking is confirmed!` // Update user notification
      }));

      // Notify the owner about the confirmation
      setOwnerNotifications(prev => [...prev, `Booking confirmed for User ${request.userId}`]);
    } catch (error) {
      console.error('Error approving booking:', error);
      setUserNotifications(prev => ({
        ...prev,
        [request.userId]: 'Approval failed: ' + (error.response ? error.response.data.message : 'Unknown error')
      }));
    }
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Booking Form</h2>
      <UserBookingForm 
        onRequestBooking={handleRequestBooking} 
        userNotification={userNotifications['123']} // Pass user notification to UserBookingForm
      />
      <OwnerPage pendingRequests={pendingRequests} onApproveBooking={handleApproveBooking} />
      {ownerNotifications.length > 0 && (
        <div className="owner-notifications">
          <h3>Owner Notifications</h3>
          <ul>
            {ownerNotifications.map((notification, index) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookingForm;




















