// components/ReferralSubmissionForm.tsx
'use client';

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

const initialFormData: FormData = {
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
};

const inputClasses = "mt-1 block w-full px-4 py-3 rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder-gray-400 bg-white text-gray-900 text-base transition-colors duration-200";

export default function ReferralSubmissionForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (section: keyof FormData, field: string | null, value: string) => {
    setFormData(prev => {
      if (field === null) {
        return { ...prev, [section]: value };
      }
      
      return {
        ...prev,
        [section]: {
          ...((prev[section] as any) || {}),
          [field]: value
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit referral');
      }

      setSubmitStatus('success');
      setFormData(initialFormData);
      setTimeout(() => setSubmitStatus('idle'), 5000);

    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit referral');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {submitStatus === 'success' && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">Referral submitted successfully!</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">
            Product/Service Name
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => handleChange('productName', null, e.target.value)}
              className={inputClasses}
              placeholder="Enter product or service name"
              required
            />
          </label>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Your Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-base font-medium text-gray-700">
              First Name
              <input
                type="text"
                value={formData.referrer.firstName}
                onChange={(e) => handleChange('referrer', 'firstName', e.target.value)}
                className={inputClasses}
                placeholder="Your first name"
                required
              />
            </label>
            <label className="block text-base font-medium text-gray-700">
              Last Name
              <input
                type="text"
                value={formData.referrer.lastName}
                onChange={(e) => handleChange('referrer', 'lastName', e.target.value)}
                className={inputClasses}
                placeholder="Your last name"
                required
              />
            </label>
          </div>
          <label className="block text-base font-medium text-gray-700">
            Email
            <input
              type="email"
              value={formData.referrer.email}
              onChange={(e) => handleChange('referrer', 'email', e.target.value)}
              className={inputClasses}
              placeholder="your.email@example.com"
              required
            />
          </label>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Referral Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-base font-medium text-gray-700">
              First Name
              <input
                type="text"
                value={formData.referee.firstName}
                onChange={(e) => handleChange('referee', 'firstName', e.target.value)}
                className={inputClasses}
                placeholder="Their first name"
                required
              />
            </label>
            <label className="block text-base font-medium text-gray-700">
              Last Name
              <input
                type="text"
                value={formData.referee.lastName}
                onChange={(e) => handleChange('referee', 'lastName', e.target.value)}
                className={inputClasses}
                placeholder="Their last name"
                required
              />
            </label>
          </div>
          <label className="block text-base font-medium text-gray-700">
            Email
            <input
              type="email"
              value={formData.referee.email}
              onChange={(e) => handleChange('referee', 'email', e.target.value)}
              className={inputClasses}
              placeholder="their.email@example.com"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-medium transition-colors duration-200 disabled:bg-blue-400"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Referral'}
        </button>
      </form>
    </div>
  );
}