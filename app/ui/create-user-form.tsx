'use client';

import React, { useState, ChangeEvent } from 'react';
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  Bars3Icon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useFormState, useFormStatus } from 'react-dom';
import { createUser } from '@/app/lib/actions';
import Link from 'next/link';

export default function CreateUserForm() {

  // State to manage the selected value of the Picklist
  const [selectedOption, setSelectedOption] = useState('');

  // Event handler for Picklist change
  const handlePicklistChange = (event : ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };
  // Define Picklist options
  const picklistOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'subcontractor', label: 'Sub Contractor' },
    { value: 'customer', label: 'Customer' },
    { value: 'builder', label: 'Builder' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'employee', label: 'Employee' },
    { value: 'manager', label: 'Manager'},
  ];
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createUser, initialState);
  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please Enter Your Details.
        </h1>
        <div className="w-full">
        <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="firstname"
            >
              First Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="firstname"
                type="firstname"
                name="firstname"
                placeholder="Enter your First Name"
                required
              />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="lastname"
            >
              Last Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="lastname"
                type="lastname"
                name="lastname"
                placeholder="Enter your Last Name"
                required
              />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="profile"
            >
              Profile
            </label>
            <div className="relative">
              <select
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder="Select your profile"
                id="profile"
                name="profile"
                value={selectedOption}
                typeof="profile"
                onChange={handlePicklistChange}
                required
                >
                {picklistOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
                ))}
              </select>
              <Bars3Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative z-index: -1">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
           { /*Commenting out re-enter password for now
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Re-enter Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password2"
                type="password"
                name="password"
                placeholder="Re-enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div> */}
        </div>
        <div className="mt-6 flex justify-end gap-4">
        <Link
            href="/login"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
          Cancel
          </Link>
          <Button type="submit">Submit</Button>
        </div>
        <div className="flex h-8 items-end space-x-1">
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.message && (
              <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.message.toString()}</p>
              </>
            )}
          </div>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.success && (
              <>
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <p className="text-sm text-red-500">{state.message}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function CreateUserButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Submit <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}