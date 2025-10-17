import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authcontext';
import toast from 'react-hot-toast';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOtp } = useAuth();
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the email from the navigation state
  const email = location.state?.email;

  // Redirect if email is not available
  useEffect(() => {
    if (!email) {
      toast.error("No email provided. Redirecting to login.");
      navigate('/login');
    }
  }, [email, navigate]);


  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input
      if (value !== '' && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Move focus to the previous input on backspace
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      setIsLoading(false);
      return;
    }

    // Call verifyOtp function from context
    const result = await verifyOtp(email, otpString);
    
    if (result && result.success) {
      toast.success("Verification successful! You can now log in.");
      navigate('/login');
    }
    // Error toast is handled inside the context function
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
            <div className="inline-block p-3 bg-white/20 rounded-full mb-3">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-purple-100 text-sm">
              An OTP has been sent to your email address.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="text-center text-gray-300">
              <p>Please enter the 6-digit code sent to:</p>
              <p className="font-semibold text-white">{email || "your email"}</p>
            </div>

            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </span>
              ) : 'Verify Account'}
            </button>
            
            <div className="text-center text-xs text-gray-400">
              <p>Didn't receive the code? <button type="button" className="text-purple-400 hover:text-purple-300">Resend OTP</button></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
