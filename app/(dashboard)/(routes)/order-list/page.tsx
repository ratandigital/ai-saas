'use client'
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  userId: string;
  amount: number;
  status: string;
  remark: string;
  orderType: string;
  createdAt: string;
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    const queryParams = new URLSearchParams({
      page: currentPage.toString(),
      pageSize: pageSize.toString(),
      ...(statusFilter && { status: statusFilter }),
    });

    const response = await fetch(`/api/order-list?${queryParams}`);
    const data = await response.json();

    setOrders(data.orders);
    setTotalPages(data.pagination.totalPages);
  };

  const handleApprove = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      } else {
        alert('Order approved successfully!');
      }

      // Refresh orders to show the updated status
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert('Could not approve the order');
    }
  };
  const handleReject = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/reject`, {
        method: 'PUT',
      });
  
      if (!response.ok) {
        throw new Error('Failed to reject order');
      } else {
        alert('Order rejected successfully!');
      }
  
      // Refresh orders to show the updated status
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert('Could not reject the order');
    }
  };
  
  

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Order List</h2>

      {/* Filter by Status */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center">
        <label htmlFor="status" className="mr-2">Filter by Status:</label>
        <select
          id="status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-auto"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Canceled</option>
          <option value="Approved">Approved</option>
        </select>
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="py-3 px-4 md:px-6 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-4 md:px-6 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                User ID
              </th>
              <th className="py-3 px-4 md:px-6 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-4 md:px-6 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 md:px-6 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Order Type
              </th>
              <th className="py-3 px-4 md:px-6 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Action
              </th>
              <th className="py-3 px-4 md:px-6 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-3 px-4 md:px-6 text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 md:px-6 text-sm font-medium text-gray-900">{order.userId}</td>
                <td className="py-3 px-4 md:px-6 text-sm font-medium text-gray-900">${order.amount}</td>
                <td className="py-3 px-4 md:px-6 text-sm font-medium text-gray-900">{order.status}</td>
                <td className="py-3 px-4 md:px-6 text-sm font-medium text-gray-900">{order.orderType}</td>
                
                <td className="py-3 px-4 md:px-6 text-sm font-medium text-gray-900">
  {order.status === 'Pending' && (
    <button
      onClick={() => handleApprove(order.id)}
      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
    >
      Approve
    </button>
  )}
</td>

<td className="py-3 px-4 md:px-6 text-sm font-medium text-gray-900">
  {order.status === 'Pending' && (
    <button
      onClick={() => handleReject(order.id)}
      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Reject
    </button>
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
