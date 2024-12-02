'use client'
import { useEffect, useState } from 'react';


export default function OrderList() {

 
  const handleApprove = async () => {
    const response = await fetch('/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.error('Failed to update entries');
      }
  };

  useEffect(() => {
    handleApprove();
  }, []);

  return (
    <h2> update convetion</h2>
  );
}
