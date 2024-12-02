'use client'


import { useState } from 'react';

export default function OrderPage() {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState('');
  const [remark, setRemark] = useState('');
  const [orderType, setOrderType] = useState(''); // New state for dropdown

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, amount, status, remark, orderType }),
      });

      if (response.ok) {
        alert('Order created successfully!');
        setUserId('');
        setAmount(0);
        setStatus('');
        setRemark('');
        setOrderType('');
      } else {
        alert('Failed to create order');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md p-8 mx-4 bg-white rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Create Order
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="userId" className="text-sm font-medium text-gray-600">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300 ease-in-out"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="amount" className="text-sm font-medium text-gray-600">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300 ease-in-out"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="status" className="text-sm font-medium text-gray-600">
              Status
            </label>
            <input
              type="text"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300 ease-in-out"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="remark" className="text-sm font-medium text-gray-600">
              Remark
            </label>
            <input
              type="text"
              id="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="mt-1 w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300 ease-in-out"
            />
          </div>
          <div className="relative">
            <label htmlFor="orderType" className="text-sm font-medium text-gray-600">
              Order Type
            </label>
            <select
              id="orderType"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="mt-1 w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300 ease-in-out"
              required
            >
              <option value="" disabled>Select Order Type</option>
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
              <option value="Overnight">Overnight</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-3 mt-4 font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
}
