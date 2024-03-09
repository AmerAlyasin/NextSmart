'use client'
import React, { useState, useEffect } from 'react';
import Card from '../ui/dashboard/card/card';
import styles from '../ui/dashboard/dashboard.module.css';
import Rightbar from '../ui/dashboard/rightbar/rightbar';
/*import Transactions from '../ui/dashboard/transactions/transactions';
import Chart from '../ui/dashboard/chart/chart';*/
import { Suspense } from 'react';
import ErrorBoundary from '../ui/dashboard/errorBoundary/errorBoundary';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    userCount: null,
    clientCount: null,
    supplierCount: null
  }); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const domain = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const timestamp = new Date().getTime(); // Get the current timestamp
        console.log(process.env.NEXT_PUBLIC_API_URL);
        const [userRes, clientRes, supplierRes] = await Promise.all([
          fetch(`${domain}/api/allUsersCount`),
          fetch(`${domain}/api/allClientsCount`),
          fetch(`${domain}/api/allSuppliersCount`)
        ]);
  
        // Check if all responses are OK
        if (!userRes.ok || !clientRes.ok || !supplierRes.ok) {
          throw new Error('HTTP error when fetching counts');
        }
  
        // Parse JSON for all responses
        const [userData, clientData, supplierData] = await Promise.all([
          userRes.json(),
          clientRes.json(),
          supplierRes.json()
        ]);
  
        // Set all counts
        setCounts({
          userCount: userData.count,
          clientCount: clientData.count,
          supplierCount: supplierData.count
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCounts();
  }, []); // Remove 'counts' from the dependency array
  

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error fetching data: {error}</p>;
  }
  


  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>Error fetching user data: {error}</p>;
  }

  return (
    <ErrorBoundary>
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <div className={styles.cards}>
            {counts.userCount !== null ? (
              <Card
                key="total-users-card"
                title="Total Users"
                number={counts.userCount}
                detailText={`${counts.userCount} registered users`}
              />
            ) : (
              <p>Loading users count...</p>
            )}
            {counts.clientCount !== null ? (
              <Card
                key="total-client-card"
                title="Total Clients"
                number={counts.clientCount}
                detailText={`${counts.clientCount} registered clients`}
              />
            ) : (
              <p>Loading Clients count...</p>
            )}
            {counts.supplierCount !== null ? (
              <Card
                key="total-suppliers-card"
                title="Total Suppliers"
                number={counts.supplierCount}
                detailText={`${counts.supplierCount} registered suppliers`}
              />
            ) : (
              <p>Loading Suppliers count...</p>
            )}
          </div>
         {/* <Transactions />*/}
          {/* <Chart /> */}
        </div>
        <div className={styles.side}>
          <Rightbar />
        </div>
      </div>
    </Suspense>
  </ErrorBoundary>
  );
};

export default Dashboard;
