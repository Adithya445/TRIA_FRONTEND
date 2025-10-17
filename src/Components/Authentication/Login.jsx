import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Shield, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../contexts/authcontext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const avatarOptions = [
  'https://api.dicebear.com/8.x/lorelei/svg?seed=Misty',
  'https://api.dicebear.com/8.x/lorelei/svg?seed=Abby',
  'https://api.dicebear.com/8.x/lorelei/svg?seed=Max',
  'https://api.dicebear.com/8.x/lorelei/svg?seed=Midnight',
  'https://api.dicebear.com/8.x/adventurer/svg?seed=Max',
  'https://api.dicebear.com/8.x/adventurer/svg?seed=Mimi',
  'https://api.dicebear.com/8.x/adventurer/svg?seed=Patches',
  'https://api.dicebear.com/8.x/adventurer/svg?seed=Sammy',
];

export default function LoginPage() {
  const { loginUser, registerUser } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    avatar: avatarOptions[0],
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const ALLOWED_DOMAINS = ['interiit.tech', 'iit.ac.in', 'iitkgp.ac.in', 'kgpian.iitkgp.ac.in'];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    const domain = email.split('@')[1];
    return ALLOWED_DOMAINS.includes(domain);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = `Email must be from an allowed domain.`;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      }
      if (!formData.avatar) {
        newErrors.avatar = 'Please select an avatar';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
        const firstErrorMessage = Object.values(validationErrors)[0];
        toast.error(firstErrorMessage);
        return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await loginUser(formData.email, formData.password);
      } else {
        const result = await registerUser(formData.name, formData.email, formData.password, formData.avatar);
        if (result && result.success) {
          navigate('/verify-otp', { state: { email: formData.email } });
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
        setErrors(prev => ({...prev, [name]: null}));
    }
  };
  
  const handleAvatarSelect = (avatarUrl) => {
    setFormData(prev => ({ ...prev, avatar: avatarUrl }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
            <div className="inline-block p-3 bg-white/20 rounded-full mb-3">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Inter IIT Tech 14.0</h1>
            <p className="text-purple-100 text-sm">Commenting System Access</p>
          </div>
          
          <div className="flex bg-slate-800/50 p-1 m-6 rounded-lg">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${isLogin ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-gray-300 hover:text-white'}`}>Login</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${!isLogin ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-gray-300 hover:text-white'}`}>Register</button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Choose Your Avatar
                </label>
                <div className="grid grid-cols-4 gap-3 p-3 bg-slate-800/50 rounded-lg">
                  {avatarOptions.map((avatar, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handleAvatarSelect(avatar)}
                      className={`rounded-full p-1 transition-all duration-200 ${
                        formData.avatar === avatar
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 ring-2 ring-offset-2 ring-offset-slate-800 ring-purple-500'
                          : 'hover:scale-110'
                      }`}
                    >
                      <img src={avatar} alt={`Avatar ${index + 1}`} className="w-16 h-16 rounded-full" />
                    </button>
                  ))}
                </div>
                 {errors.avatar && <p className="text-red-400 text-xs mt-1">{errors.avatar}</p>}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200 flex items-center gap-2"><User className="w-4 h-4" />Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter your full name" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200 flex items-center gap-2"><Mail className="w-4 h-4" />Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="user@interiit.tech" />
               {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200 flex items-center gap-2"><Lock className="w-4 h-4" />Password</label>
                <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter your password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"><>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</></button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200 flex items-center gap-2"><Lock className="w-4 h-4" />Confirm Password</label>
                  <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Confirm your password" />
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50">
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
            <div className="text-center text-xs text-gray-400 pt-2">
              {isLogin ? (<p>Don't have an account? <button type="button" onClick={() => setIsLogin(false)} className="text-purple-400 hover:text-purple-300 font-medium">Register here</button></p>) : (<p>Already have an account? <button type="button" onClick={() => setIsLogin(true)} className="text-purple-400 hover:text-purple-300 font-medium">Login here</button></p>)}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}