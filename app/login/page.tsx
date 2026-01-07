'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { verifyUser, loginRegister } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'

type Step = 'PHONE' | 'OTP' | 'NAME'

export default function LoginPage() {
  const router = useRouter()
  const setToken = useAuthStore((s) => s.setToken)

  const [step, setStep] = useState<Step>('PHONE')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isExistingUser, setIsExistingUser] = useState(false)
  const [serverOtp, setServerOtp] = useState('') // Store OTP from server

  // -----------------------------
  // STEP 1: Verify Phone
  // -----------------------------
  const handleVerifyPhone = async () => {
    if (!phone.trim()) {
      setError('Please enter phone number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await verifyUser(phone)
      
      // Store OTP for verification
      setServerOtp(res.otp)
      setIsExistingUser(res.user)
      
      // Move to OTP screen
      setStep('OTP')
      
      // Show OTP as toast/alert
      alert(`Your OTP is: ${res.otp}`)
      
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  // -----------------------------
  // STEP 2: Verify OTP
  // -----------------------------
  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      setError('Please enter OTP')
      return
    }

    // Verify OTP (static check)
    if (otp !== serverOtp) {
      setError('Invalid OTP')
      return
    }

    setError('')

    // If existing user, login with the token
    if (isExistingUser) {
      // For existing users, we need to call login-register endpoint
      // or use the token received from verify endpoint
      // Based on your API, let's call loginRegister for both cases
      handleExistingUserLogin()
    } else {
      // New user → go to name screen
      setStep('NAME')
    }
  }

  // -----------------------------
  // Login existing user
  // -----------------------------
  const handleExistingUserLogin = async () => {
    setLoading(true)
    try {
      // For existing users, we still need to call login-register
      // But we don't have name yet. API might accept without name.
      const res = await loginRegister({
        phone_number: phone,
        name: '', // Empty name for existing users
      })

      loginSuccess(res.token.access)
    } catch (err: any) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  // -----------------------------
  // STEP 3: Register (New User)
  // -----------------------------
  const handleRegister = async () => {
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await loginRegister({
        phone_number: phone,
        name,
      })

      loginSuccess(res.token.access)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // -----------------------------
  // Login success handler
  // -----------------------------
  const loginSuccess = (token: string) => {
    document.cookie = `access_token=${token}; path=/`
    setToken(token)
    router.push('/')
  }

  // -----------------------------
  // Reset state for new login
  // -----------------------------
  const handleBack = () => {
    if (step === 'OTP') {
      setStep('PHONE')
      setOtp('')
      setServerOtp('')
    } else if (step === 'NAME') {
      setStep('OTP')
      setName('')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Back button for OTP and NAME steps */}
        {step !== 'PHONE' && (
          <button
            onClick={handleBack}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back
          </button>
        )}

        {/* ---------------- PHONE ---------------- */}
        {step === 'PHONE' && (
          <>
            <h1 className="text-xl font-semibold text-center">Log In</h1>
            <div className="space-y-4">
              <input
                placeholder="Enter Phone Number"
                className="w-full bg-neutral-900 p-3 rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
              />
              <button
                onClick={handleVerifyPhone}
                disabled={loading || !phone.trim()}
                className="w-full bg-white text-black py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Continue'}
              </button>
            </div>
          </>
        )}

        {/* ---------------- OTP ---------------- */}
        {step === 'OTP' && (
          <>
            <h1 className="text-xl font-semibold text-center">
              Verify Phone
            </h1>
            <p className="text-center text-gray-400">
              Enter OTP sent to {phone}
            </p>
            <div className="space-y-4">
              <input
                placeholder="Enter OTP"
                className="w-full bg-neutral-900 p-3 rounded text-center tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
              <button
                onClick={handleVerifyOtp}
                disabled={loading || !otp.trim()}
                className="w-full bg-white text-black py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </>
        )}

        {/* ---------------- NAME ---------------- */}
        {step === 'NAME' && (
          <>
            <h1 className="text-xl font-semibold text-center">
              Welcome! What's your name?
            </h1>
            <div className="space-y-4">
              <input
                placeholder="Eg: John Mathew"
                className="w-full bg-neutral-900 p-3 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                onClick={handleRegister}
                disabled={loading || !name.trim()}
                className="w-full bg-white text-black py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Continue'}
              </button>
            </div>
          </>
        )}

        {error && (
          <p className="text-red-500 text-center text-sm py-2">{error}</p>
        )}

        {/* OTP Info Message */}
        {step === 'OTP' && serverOtp && (
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Demo OTP: <span className="font-bold">{serverOtp}</span></p>
            <p className="text-xs mt-1">(Use this OTP for testing)</p>
          </div>
        )}
      </div>
    </div>
  )
}