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

  useEffect(() => {
    const fetchCounterData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard statistics");
        }
        const { counts: apiCounts } = await response.json();
        
        // Map the API response to your component's expected format
        const mappedCounts = counts.map((counter, index) => {
          const apiCounter = apiCounts[index];
          if (!apiCounter) return counter;
          
          return {
            ...counter,
            data: apiCounter.data,
            symbol: counter.symbol // Keep your frontend's symbol logic
          };
        });

        setCounts(mappedCounts);
      } catch (error) {
        console.error("Error fetching counter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounterData();
  }, []);

  if (loading) {
    return <div>Loading dashboard statistics...</div>;
  }

  return (
    <CounterDashboard counts={counts}>
      <HeadingDashboard>Dashboard</HeadingDashboard>
    </CounterDashboard>
  );
};

export default CounterInstructor;