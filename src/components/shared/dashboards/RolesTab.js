"use client"

import React, { useEffect, useState, useMemo } from "react";
import useTab from "@/hooks/useTab";
import TabButtonSecondary from "../buttons/TabButtonSecondary";
import TabContentWrapper from "../wrappers/TabContentWrapper";
import RolesTable from "./_comp/RolesTable";
import TeacherRequestTable from "./_comp/TeacherRequestTable";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { formatDate } from "@/actions/formatDate";
import ErrorBoundary from "./RolesErrorBoundary";

const RolesTab = () => {
  const { currentIdx, handleTabClick } = useTab();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/all");

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received.");
        }

        setUsers(data);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  const filterUsersByRole = (role) => {
    try {
      return users?.filter((user) => user?.roles?.includes(role)) || [];
    } catch (e) {
      return [];
    }
  };

  const trainees = useMemo(() => filterUsersByRole("user"), [users]);
  const trainers = useMemo(() => filterUsersByRole("instructor"), [users]);
  const admins = useMemo(() => filterUsersByRole("admin"), [users]);

  const tabbuttons = useMemo(() => [
    {
      name: "Trainee",
      content: (
        <RolesTable
          isLoading={loading}
          users={trainees}
          setUsers={setUsers}
          fallbackMessage="No trainees available."
        />
      ),
    },
    {
      name: "Trainers",
      content: (
        <RolesTable
          isLoading={loading}
          users={trainers}
          setUsers={setUsers}
          fallbackMessage="No trainers available."
        />
      ),
    },
    {
      name: "Admins",
      content: (
        <RolesTable
          isLoading={loading}
          users={admins}
          setUsers={setUsers}
          fallbackMessage="No admins available."
        />
      ),
    },
    {
      name: "Requests",
      content: (
        <TeacherRequestTable />
      ),
    },
  ], [loading, trainees, trainers, admins]);

  const downloadExcel = () => {
    try {
      if (users.length === 0) {
        alert("No users available to download.");
        return;
      }

      const worksheetData = users.map(user => ({
        ID: user?.uniqueIdentifier || "N/A",
        Name: user?.name || "N/A",
        Email: user?.email || "N/A",
        Username: user?.username || "N/A",
        PhoneNumber: user?.phone || "N/A",
        EnrolledCoursesCount: user?.enrolledCoursesCount || 0,
        CreatedAt: user?.createdAt ? formatDate(user.createdAt) : "N/A",
        Roles: user?.roles?.join(", ") || "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });

      saveAs(data, "users.xlsx");
    } catch (err) {
      alert("Error downloading Excel: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-10px min-h-[400px] md:px-4 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
            Administrative Roles
          </h2>
          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blueDark focus:outline-none"
          >
            Download as Excel
          </button>
        </div>

        <div>
          <div className="flex flex-wrap mb-10px lg:mb-50px rounded gap-10px">
            {tabbuttons.map(({ name }, idx) => (
              <TabButtonSecondary
                key={idx}
                name={name}
                idx={idx}
                currentIdx={currentIdx}
                handleTabClick={handleTabClick}
                button="small"
              />
            ))}
          </div>

          <div>
            {tabbuttons.map(({ content }, idx) => (
              <TabContentWrapper key={idx} isShow={idx === currentIdx}>
                {content}
              </TabContentWrapper>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default RolesTab;
