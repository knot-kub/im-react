'use client'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useEffect, useMemo } from 'react';

export default function Login() {
  const { onLogin, setPassword, setUsername, error, isLoading } = useAuthentication()

  const emailWarning = useMemo(() => {
    return error && (
      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
        <span className="font-medium">Oops!</span> Email Wrong!
      </p>
    )
  }, [error])

  const passwordWarning = useMemo(() => {
    return error && (
      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
        <span className="font-medium">Oops!</span> Password Wrong!
      </p>
    )
  }, [error])

  return (
    <div className="bg-indigo-400 h-screen px-5 py-8">
      <div className="flex justify-center bg-white h-full rounded-lg overflow-hidden p-6">
        <div className="text-gray-800 bg-gray-100 rounded-xl h-fit mt-10 w-full sm:w-2/3 md:w-2/4 lg:w-1/3">
          <div className="text-xl text-center font-bold py-6">Log-in</div>
          <div className="flex flex-col justify-center">
            <div className="mx-4 sm:mx-6 md:mx-8">
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Your email
                </label>
                <input
                  onChange={(event) => setUsername(event.target.value)}
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="email@example.com"
                  required
                />
                {emailWarning}
              </div>
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Your password
                </label>
                <input
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  id="password"
                  placeholder="p@ssword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
                {passwordWarning}
              </div>
              {
                isLoading ? 
                  <div className="flex justify-center mb-6">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status">
                      <span
                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                      >Loading...</span>
                    </div>
                  </div>
                  : <button
                      onClick={() => onLogin()}
                      className="w-full px-5 py-2.5 mb-6 text-white bg-indigo-400 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm text-center"
                    >
                      Submit
                    </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}