import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Mail, Smartphone, Lock, User, MapPin, Building, Briefcase, Calendar, Sparkles, Check, Upload, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { CustomDatePicker } from './CustomDatePicker';
import { AboveZLogo } from './AboveZLogo';
import { ALL_INDIAN_STATES, getCitiesByState } from '../data/indianCities';

const SKILL_OPTIONS = [
  'Wedding Management',
  'Hospitality & Welcoming',
  'Exhibition Stall Staff',
  'Stage & Sound Setup',
  'Corporate Registration',
  'Promotional Branding',
  'Food & Beverage Service',
  'Security & Crowd Control'
];

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const AuthModals: React.FC = () => {
  const { authModalType, closeAuthModal, login, activeCity } = useAuth();

  const [signupStep, setSignupStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common Auth Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Location Fields (Mandatory)
  const [selectedState, setSelectedState] = useState<string>(activeCity?.state || 'Gujarat');
  const [selectedCity, setSelectedCity] = useState<string>(activeCity?.name || 'Surat');

  // Crew Specific
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('Flexible / Weekends');

  // Handler Specific
  const [companyName, setCompanyName] = useState('');
  const [handlerAddress, setHandlerAddress] = useState('');

  if (!authModalType) return null;

  const isCrewSignup = authModalType === 'crew-signup';
  const isCrewLogin = authModalType === 'crew-login';
  const isHandlerSignup = authModalType === 'handler-signup';
  const isHandlerLogin = authModalType === 'handler-login';
  const isAdminLogin = authModalType === 'admin-login';

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const cities = getCitiesByState(newState);
    setSelectedCity(cities.length > 0 ? cities[0] : '');
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const expectedRole = isCrewLogin ? 'crew' : isAdminLogin ? 'admin' : 'handler';

    try {
      const loginIdentifier = email || phone;
      const res = await api.login(loginIdentifier, password, expectedRole);
      login(res.user, res.subscription);
      setLoading(false);
      closeAuthModal();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleCrewSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict validation across all required registration fields
    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in your Full Name, Mobile, Email, and Password.');
      return;
    }
    if (!gender) {
      setError('Please select your Gender.');
      return;
    }
    if (!dob) {
      setError('Please select your Date of Birth.');
      return;
    }
    if (!selectedState || !selectedCity) {
      setError('Please select both State and City.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter your Area or Local Address.');
      return;
    }
    if (selectedSkills.length === 0) {
      setError('Please select at least one Work Skill.');
      return;
    }
    if (!experience.trim()) {
      setError('Please provide your experience level.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.signupCrew({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        gender,
        dob,
        state: selectedState,
        city: selectedCity,
        address: address.trim(),
        skills: selectedSkills,
        experience: experience.trim(),
        availability,
        avatarUrl: avatarUrl || '' // Optional, left blank if user didn't choose one
      });

      setLoading(false);
      closeAuthModal();
      login(res.user, res.trialSubscription);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Signup failed. Please ensure all details are filled properly.');
    }
  };

  const handleHandlerSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict validation for event handler registration
    if (!name.trim() || !companyName.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in Name, Company / Agency Name, Mobile, Email, and Password.');
      return;
    }
    if (!selectedState || !selectedCity) {
      setError('Please select both State and City.');
      return;
    }
    if (!handlerAddress.trim()) {
      setError('Please enter your Office Address or Locality.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.signupHandler({
        name: name.trim(),
        companyName: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        address: handlerAddress.trim(),
        state: selectedState,
        city: selectedCity,
        avatarUrl: avatarUrl || '' // Optional, left blank if not uploaded
      });

      setLoading(false);
      closeAuthModal();
      login(res.user, res.trialSubscription);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Organizer signup failed. Please ensure all fields are filled.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 my-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="mb-6 flex items-start gap-3.5">
          <div className="mt-0.5 shrink-0">
            <AboveZLogo size={54} />
          </div>
          <div className="flex-1">
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 ${
              isAdminLogin ? 'bg-indigo-100 text-indigo-800' : 'text-blue-600 bg-blue-50'
            }`}>
              {isAdminLogin ? 'Admin Console' : (isCrewSignup || isCrewLogin ? 'Crew Portal' : 'Event Handler Portal')}
            </span>
            <h3 className="text-xl font-black text-slate-900 leading-tight">
              {isCrewSignup && 'Join AboveZ'}
              {isCrewLogin && 'Welcome Back, Crew'}
              {isHandlerSignup && 'Publish Events & Hire Staff'}
              {isHandlerLogin && 'Event Organizer Login'}
              {isAdminLogin && 'AboveZ Admin Authentication'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isCrewSignup && 'Step-by-step account creation with instant event access'}
              {isCrewLogin && 'Access nearby events, applications & status updates'}
              {isHandlerSignup && 'Create your organizer account & claim 1-month free trial'}
              {isHandlerLogin && 'Manage your active events and crew applications'}
              {isAdminLogin && 'Enter administrator username/email and password to access the console'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* --- CREW / HANDLER / ADMIN LOGIN --- */}
        {(isCrewLogin || isHandlerLogin || isAdminLogin) && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAdminLogin ? 'Admin Username or Email' : 'Email or Mobile Number'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder={isAdminLogin ? 'Enter admin username or email' : 'email@example.com or 9876543210'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? 'Logging in...' : 'Log In & Continue'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* --- CREW SIGNUP (MULTI-STEP) --- */}
        {isCrewSignup && (
          <form onSubmit={handleCrewSignupSubmit} className="space-y-4">
            {signupStep === 1 ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@gmail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    {GENDER_OPTIONS.map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                          gender === g
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <CustomDatePicker
                    label="Date of Birth *"
                    value={dob}
                    onChange={setDob}
                    minYear={1950}
                    maxYear={2012}
                    placeholder="Select Birth Date"
                    helperText="Easy year & month picker (1950-2012)"
                  />
                </div>

                {/* Optional Profile Photo upload */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-700">Profile Photo (Optional)</label>
                    <span className="text-[10px] text-slate-400">Leave blank if not needed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-blue-600" /> Choose Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl('')}
                          className="text-[11px] text-red-500 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
                      setError('Please fill in Name, Mobile, Email, and Password.');
                      return;
                    }
                    if (!gender) {
                      setError('Please select your Gender.');
                      return;
                    }
                    if (!dob) {
                      setError('Please select your Date of Birth.');
                      return;
                    }
                    setError(null);
                    setSignupStep(2);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1 mt-2"
                >
                  Next Step: State, City & Skills <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Mandatory State & City Selection */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      State / UT <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={selectedState}
                      onChange={e => handleStateChange(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white text-slate-800 font-medium"
                    >
                      <option value="">-- Select State --</option>
                      {ALL_INDIAN_STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      disabled={!selectedState}
                      value={selectedCity}
                      onChange={e => setSelectedCity(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white text-slate-800 font-medium disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {!selectedState ? (
                        <option value="">-- Select State First --</option>
                      ) : (
                        <>
                          <option value="">-- Select City --</option>
                          {getCitiesByState(selectedState).map(ct => (
                            <option key={ct} value={ct}>{ct}</option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Area / Local Address <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. Vesu, MG Road, near ${selectedCity || 'City'}`}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Work Skills <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-50 border border-slate-200 rounded-xl">
                    {SKILL_OPTIONS.map(skill => {
                      const selected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`p-2 text-[11px] font-semibold rounded-lg border text-left flex items-center justify-between transition-colors ${
                            selected
                              ? 'border-blue-600 bg-blue-100 text-blue-900'
                              : 'border-slate-200 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <span>{skill}</span>
                          {selected && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fresher / 1-2 Years in weddings & events"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Availability</label>
                  <input
                    type="text"
                    placeholder="e.g. Flexible / Weekend Work"
                    value={availability}
                    onChange={e => setAvailability(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* --- HANDLER / ORGANIZER SIGNUP --- */}
        {isHandlerSignup && (
          <form onSubmit={handleHandlerSignupSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Patel"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company / Event Agency Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Craft Events & Exhibitions"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="vikram@craftevents.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Mandatory State & City Selection for Organizer */}
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-blue-50/50 rounded-2xl border border-blue-100">
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  State / UT <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={selectedState}
                  onChange={e => handleStateChange(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white text-slate-800 font-medium"
                >
                  <option value="">-- Select State --</option>
                  {ALL_INDIAN_STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  disabled={!selectedState}
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white text-slate-800 font-medium disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {!selectedState ? (
                    <option value="">-- Select State First --</option>
                  ) : (
                    <>
                      <option value="">-- Select City --</option>
                      {getCitiesByState(selectedState).map(ct => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Office Address / Locality <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder={`e.g. Ring Road, Office #402, ${selectedCity || 'City'}`}
                value={handlerAddress}
                onChange={e => setHandlerAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Optional Organizer Logo / Photo */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-700">Company Logo / Profile Photo (Optional)</label>
                <span className="text-[10px] text-slate-400">Leave blank if not needed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Building className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-blue-600" /> Choose Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-[11px] text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Includes <strong>1-Month Free Trial</strong> for Event Handlers. Publish events & hire crew instantly.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              {loading ? 'Creating Organizer Account...' : 'Register as Event Organizer'}
            </button>
          </form>
        )}

        {/* Footer Toggle links */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {isCrewSignup && (
            <span>
              Already have a Crew account?{' '}
              <button
                type="button"
                onClick={() => useAuth().openAuthModal('crew-login')}
                className="text-blue-600 font-bold hover:underline"
              >
                Log In
              </button>
            </span>
          )}
          {isCrewLogin && (
            <span>
              New to AboveZ?{' '}
              <button
                type="button"
                onClick={() => useAuth().openAuthModal('crew-signup')}
                className="text-blue-600 font-bold hover:underline"
              >
                Sign Up as Crew
              </button>
            </span>
          )}
          {isHandlerSignup && (
            <span>
              Already registered as Organizer?{' '}
              <button
                type="button"
                onClick={() => useAuth().openAuthModal('handler-login')}
                className="text-blue-600 font-bold hover:underline"
              >
                Log In
              </button>
            </span>
          )}
          {isHandlerLogin && (
            <span>
              Need an Organizer account?{' '}
              <button
                type="button"
                onClick={() => useAuth().openAuthModal('handler-signup')}
                className="text-blue-600 font-bold hover:underline"
              >
                Register Here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
