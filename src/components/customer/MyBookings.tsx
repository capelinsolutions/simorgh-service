import React from 'react';

const MyBookings = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">No bookings yet. Book your first service to get started!</p>
      </div>
    </div>
  );
};

export default MyBookings;