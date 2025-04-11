"use client";

import counter1 from "@/assets/images/counter/counter__1.png";
import counter2 from "@/assets/images/counter/counter__2.png";
import counter3 from "@/assets/images/counter/counter__3.png";
import CounterDashboard from "@/components/shared/dashboards/CounterDashboard";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CounterStudent = () => {
  const { data: session } = useSession();
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
      name: "Completed Courses",
      image: counter3,
      data: 0,
      symbol: "+",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/dashboard/stats?userId=${session.user.id}`);
        const result = await response.json();
        
        if (response.ok && result?.counts) {
          setCounts([
            {
              name: "Enrolled Courses",
              image: counter1,
              data: result.counts[0]?.data || 0,
              symbol: "+",
            },
            {
              name: "Active Courses",
              image: counter2,
              data: result.counts[1]?.data || 0,
              symbol: "+",
            },
            {
              name: "Completed Courses",
              image: counter3,
              data: result.counts[2]?.data || 0,
              symbol: "+",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchData();
  }, [session]);

  return (
    <CounterDashboard counts={counts}>
      <HeadingDashboard>Summary</HeadingDashboard>
    </CounterDashboard>
  );
};

export default CounterStudent;