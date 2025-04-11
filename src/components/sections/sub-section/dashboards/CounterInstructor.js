"use client";
import { useEffect, useState } from "react";
import counter1 from "@/assets/images/counter/counter__1.png";
import counter2 from "@/assets/images/counter/counter__2.png";
import counter3 from "@/assets/images/counter/counter__3.png";
import counter4 from "@/assets/images/counter/counter__4.png";
import CounterDashboard from "@/components/shared/dashboards/CounterDashboard";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

const CounterInstructor = () => {
  const [counts, setCounts] = useState([
    {
      name: "Enrolled Courses",
      image: counter1,
      data: 0,
      symbol: "+",
    },
    {
      name: "Active Courses",
      image: counter2,
      data: 0,
      symbol: "+",
    },
    {
      name: "Complete Courses",
      image: counter3,
      data: 0,
      symbol: "+",
    },
    {
      name: "Total Courses",
      image: counter4,
      data: 0,
      symbol: "+",
    },
    {
      name: "Total Students",
      image: counter3,
      data: 0,
      symbol: "+",
    },
    {
      name: "Total Earning",
      image: counter4,
      data: 0,
      symbol: "k+",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounterData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard statistics");
        }
        const data = await response.json();
        
        if (!data || !data.counts) {
          throw new Error("Invalid data format from API");
        }

        // Create a mapping between API names and our counter names
        const nameMapping = {
          "Enrolled Courses": "Enrolled Courses",
          "Active Courses": "Active Courses",
          "Completed Courses": "Complete Courses",
          "Total Courses": "Total Courses",
          "Total Students": "Total Students",
          "Total Earning": "Total Earning"
        };

        // Safely update counts while preserving the original order and images
        const updatedCounts = counts.map(counter => {
          const apiCounter = data.counts.find(ac => 
            nameMapping[ac.name] === counter.name
          );
          
          return {
            ...counter,
            data: apiCounter?.data || 0,
            symbol: counter.symbol
          };
        });

        setCounts(updatedCounts);
        setError(null);
      } catch (err) {
        console.error("Error fetching counter data:", err);
        setError(err.message || "An error occurred while loading statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchCounterData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard statistics...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <CounterDashboard counts={counts}>
      <HeadingDashboard>Dashboard</HeadingDashboard>
    </CounterDashboard>
  );
};

export default CounterInstructor;