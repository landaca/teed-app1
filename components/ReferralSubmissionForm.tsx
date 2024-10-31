"use client"

import React, { useState } from 'react';

interface FormData {
  productName: string;
  referrer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  referee: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function ReferralSubmissionForm() {
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    referrer: {
      firstName: '',
      lastName: '',
      email: ''
    },
    referee: {
      firstName: '',
      lastName: '',
      email: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here we would typically send the data to an API
  };

  const handleChange = (section: keyof FormData | 'referrer' | 'referee', field: string | null, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: field 
        ? {
            ...prev[section as 'referrer' | 'referee'],
            [field]: value
          }
        : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product/Service Name
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => handleChange('productName', null, e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </label>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Your Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-gray-700">
            First Name
            <input
              type="text"
              value={formData.referrer.firstName}
              onChange={(e) => handleChange('referrer', 'firstName', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
            <input
              type="text"
              value={formData.referrer.lastName}
              onChange={(e) => handleChange('referrer', 'lastName', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            value={formData.referrer.email}
            onChange={(e) => handleChange('referrer', 'email', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </label>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Referral Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-gray-700">
            First Name
            <input
              type="text"
              value={formData.referee.firstName}
              onChange={(e) => handleChange('referee', 'firstName', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
            <input
              type="text"
              value={formData.referee.lastName}
              onChange={(e) => handleChange('referee', 'lastName', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            value={formData.referee.email}
            onChange={(e) => handleChange('referee', 'email', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Submit Referral
      </button>
    </form>
  );
}