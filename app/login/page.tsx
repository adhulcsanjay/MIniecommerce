'use client'
import Image from 'next/image'
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
    window.location.href = "/"

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
  <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-black">

    {/* LEFT IMAGE SECTION */}
    <div className="relative hidden md:block">
      <Image
        src="/Frame 530.png" 
        alt="Login Banner"
        fill
        className="object-cover"
        priority
      />
    </div>

    {/* RIGHT LOGIN SECTION */}
    <div className="flex items-center justify-center px-6 py-10 bg-black text-white">
      <div className="w-full max-w-xl space-y-6">

        

        {/* PHONE STEP */}
        {step === 'PHONE' && (
          <>
            <h1 className="text-[2rem] font-semibold text-center mb-6">Log In</h1>

            <label className="text-sm mb-4">Phone</label>
            <input
              placeholder="Enter Phone"
              className="w-full bg-neutral-900 p-3 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />

            <button
              onClick={handleVerifyPhone}
              disabled={loading || !phone.trim()}
              className="w-full mt-3 bg-white text-black p-3 rounded disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Continue'}
            </button>
          </>
        )}

        {/* OTP STEP */}
        {step === 'OTP' && (
          <>
            <h1 className="text-[2rem] font-semibold text-center mb-4">Verify Phone</h1>
            <div className='flex justify-center gap-2'>
            <p className=" text-gray-400 mb-4 text-[1rem]">
              Enter OTP sent to {phone} 
            </p>
           
            <button  className='w-4 h-4'
            onClick={handleBack}>
            <Image src="/Vector (2).png" alt="logo" width={10} height={10} className='w-4'/>
            </button>
          

            </div>
            <label className="text-md mb-2 block">Enter OTP</label>

<div className="flex justify-between gap-3 mb-4">
  {[0, 1, 2, 3].map((index) => (
    <input
      key={index}
      type="text"
      maxLength={1}
      value={otp[index] || ""}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (!value) return;

        const newOtp = otp.split("");
        newOtp[index] = value;
        const finalOtp = newOtp.join("");
        setOtp(finalOtp);

        // move to next box
        const next = document.getElementById(`otp-${index + 1}`);
        if (next) (next as HTMLInputElement).focus();
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          const newOtp = otp.split("");
          newOtp[index] = "";
          setOtp(newOtp.join(""));

          // move to previous
          const prev = document.getElementById(`otp-${index - 1}`);
          if (prev) (prev as HTMLInputElement).focus();
        }
      }}
      id={`otp-${index}`}
      className="
        w-36 h-24 
        bg-neutral-900 
        rounded-xl
        text-white 
        text-center 
        text-2xl 
        tracking-widest
      "
    />
  ))}
</div>

            <div className="text-sm text-gray-500">
            Demo OTP: <span className="font-bold">{serverOtp}</span>
          </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading || !otp.trim()}
              className="w-full mt-2 bg-white text-black p-3 rounded disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}

        {/* NAME STEP */}
        {step === 'NAME' && (
          <>
            <h1 className="text-[2rem] font-semibold text-center mb-6">
              Welcome, You are?
            </h1>
             <label className="text-md mb-2 block">Name</label>
            <input
              placeholder="Eg: John Mathew"
              className="w-full bg-neutral-900 p-3 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              onClick={handleRegister}
              disabled={loading || !name.trim()}
              className="w-full mt-3 bg-white text-black p-3 rounded disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Continue'}
            </button>
          </>
        )}

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-center text-sm py-2">{error}</p>
        )}


      </div>
    </div>
  </div>
);
}