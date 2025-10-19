import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Shield, Image as ImageIcon, KeyRound } from 'lucide-react';
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
    email: '', password: '', name: '', confirmPassword: '', avatar: avatarOptions[0],
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminRegister, setIsAdminRegister] = useState(false);

  const ALLOWED_DOMAINS = ['interiit.tech', 'iit.ac.in', 'iitkgp.ac.in', 'kgpian.iitkgp.ac.in','gmail.com'];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    const domain = email.split('@')[1];
    return ALLOWED_DOMAINS.includes(domain);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = `Email must be from an allowed domain.`;

    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (isAdminRegister) {
        if (!formData.password) newErrors.password = 'Admin password is required.';
      } else {
        if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      if (!formData.password) newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      toast.error(Object.values(validationErrors)[0]);
      return;
    }
    setIsLoading(true);
    try {
      if (isLogin) {
        await loginUser(formData.email, formData.password);
      } else {
    const result = await registerUser(formData.name, formData.email, formData.password, formData.avatar, isAdminRegister);
    if (result && result.success) {
        navigate('/verify-otp', { state: { email: formData.email } });
    }
}
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleAvatarSelect = (avatarUrl) => setFormData(prev => ({ ...prev, avatar: avatarUrl }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Inter IIT Tech 14.0</h1>
            <p className="text-purple-100">Commenting System Access</p>
          </div>
          <div className="flex bg-slate-800/50 p-1 m-6 rounded-lg">
            <button onClick={() => { setIsLogin(true); setErrors({}); }} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isLogin ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-gray-300'}`}>Login</button>
            <button onClick={() => { setIsLogin(false); setErrors({}); }} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isLogin ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-gray-300'}`}>Register</button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Choose Your Avatar</label>
                  <div className="grid grid-cols-4 gap-3 p-3 bg-slate-800/50 rounded-lg">
                    {avatarOptions.map((avatar, i) => <button type="button" key={i} onClick={() => handleAvatarSelect(avatar)} className={`rounded-full p-1 transition-all ${formData.avatar === avatar ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}`}><img src={avatar} alt={`Avatar ${i + 1}`} className="w-16 h-16 rounded-full" /></button>)}
                  </div>
                </div>
                <div className="flex items-center justify-center pt-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={isAdminRegister} onChange={() => setIsAdminRegister(!isAdminRegister)} className="w-4 h-4 rounded text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-600" />
                    Register as Admin
                  </label>
                </div>
              </>
            )}
            {!isLogin && <div className="space-y-2"><label className="text-sm font-medium text-gray-200 flex items-center gap-2"><User className="w-4 h-4" /> Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white" placeholder="Enter your full name" />{errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}</div>}
            <div className="space-y-2"><label className="text-sm font-medium text-gray-200 flex items-center gap-2"><Mail className="w-4 h-4" /> Email Address</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white" placeholder="user@interiit.tech" />{errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}</div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                {isAdminRegister && !isLogin ? <KeyRound className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {isAdminRegister && !isLogin ? 'Admin Password' : 'Password'}
              </label>
              <div className="relative">
                {/* --- THIS IS THE FIX for the placeholder --- */}
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white ${isAdminRegister && !isLogin ? 'border-purple-500' : 'border-slate-700'}`} placeholder={isAdminRegister && !isLogin ? 'Enter admin password' : 'Enter your password' } />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff /> : <Eye />}</button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {!isLogin && !isAdminRegister && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200 flex items-center gap-2"><Lock className="w-4 h-4" /> Confirm Password</label>
                <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white" placeholder="Confirm your password" />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}
            <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">{isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</button>
            <div className="text-center text-xs text-gray-400">{isLogin ? (<p>Don't have an account? <button type="button" onClick={() => setIsLogin(false)} className="text-purple-400">Register here</button></p>) : (<p>Already have an account? <button type="button" onClick={() => setIsLogin(true)} className="text-purple-400">Login here</button></p>)}</div>
          </form>
        </div>
      </div>
    </div>
  );
}

