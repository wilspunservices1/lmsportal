"use client";

import React from 'react';
import Link from 'next/link';

const MainCertificate = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Certificates</h1>
        <Link 
          href="/dashboards/questionnaire/add"
          className="bg-primaryColor text-white px-4 py-2 rounded hover:bg-secondaryColor transition-colors"
        >
          Create New
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-whiteColor-dark p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link 
              href="/dashboards/certificates/add"
              className="block p-4 border rounded hover:border-primaryColor transition-colors"
            >
              Create New Certificate
            </Link>
            <Link 
              href="/dashboards/certificates/manage"
              className="block p-4 border rounded hover:border-primaryColor transition-colors"
            >
              Manage Existing Certificates
            </Link>
            <Link 
              href="/dashboards/certificates/edit"
              className="block p-4 border rounded hover:border-primaryColor transition-colors"
            >
              Existing Certificates
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-whiteColor-dark p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600 dark:text-gray-400">
            No recent activity
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainCertificate; 