import React, { useState } from 'react';
import { X, Camera, User, Phone, MapPin, Building, Briefcase, Check, Sparkles, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { CustomDatePicker } from './CustomDatePicker';
import { ALL_INDIAN_STATES, getCitiesByState } from '../data/indianCities';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, setUserAndSub, subscription, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [bio, setBio] = useState(user?.bio || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [address, setAddress] = useState(user?.address || '');
  const [state, setState] = useState(user?.state || 'Gujarat');
  const [city, setCity] = useState(user?.city || 'Surat');
  const [skillsStr, setSkillsStr] = useState((user?.skills || []).join(', '));
  const [experience, setExperience] = useState(user?.experience || '1 Year');
  const [dob, setDob] = useState(user?.dob || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Delete Account Confirmation State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleStateChange = (newState: string) => {
    setState(newState);
    const cities = getCitiesByState(newState);
    setCity(cities.length > 0 ? cities[0] : '');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const skills = skillsStr
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await api.updateProfile(user.id, {
        name,
        phone,
        avatarUrl,
        gender,
        bio,
        companyName,
        address,
        state,
        city,
        skills,
        experience,
        dob
      });

      setUserAndSub(res.user, subscription);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setError(null);

    try {
      await api.deleteAccount(user.id);
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      onClose();
      logout();
    } catch (err: any) {
      setDeleteLoading(false);
      setError(err.message || 'Failed to delete account. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Edit Profile Details</h2>
              <p className="text-[11px] text-slate-500">Update your photo, contact, and profile settings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Delete Confirmation Modal Layer */}
        {showDeleteConfirm ? (
          <div className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">Delete Account Permanently?</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Are you sure you want to delete your account? All your personal information, applications, event records, and subscription access will be completely removed. This action is irreversible.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> {successMsg}
              </div>
            )}

            {/* Profile Photo Section */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Profile Photo (Optional)</label>
                <span className="text-[11px] text-slate-400">Upload custom photo or leave blank</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      name ? name.charAt(0).toUpperCase() : <User className="w-8 h-8" />
                    )}
                  </div>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full text-[10px] shadow"
                      title="Remove Photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all">
                      <Upload className="w-3.5 h-3.5" /> Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">JPG, PNG or WEBP up to 5MB.</p>
                </div>
              </div>
            </div>

            {/* Core Info Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {user.role === 'crew' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Male', 'Female', 'Other'].map(g => (
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
              )}

              {user.role === 'handler' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organizer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Surat Events & Decor"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio / About</label>
                <textarea
                  rows={2}
                  placeholder="Share a short bio or experience summary..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {user.role === 'crew' && (
                <>
                  <CustomDatePicker
                    label="Date of Birth"
                    value={dob}
                    onChange={setDob}
                    minYear={1960}
                    maxYear={2012}
                    helperText="Easily change birth year and month"
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Skills (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Hospitality, Stage Setup, Wedding Usher, Security"
                      value={skillsStr}
                      onChange={e => setSkillsStr(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
                    <select
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                    >
                      <option value="Fresher / Keen Learner">Fresher / Keen Learner</option>
                      <option value="1 Year Experience">1 Year Experience</option>
                      <option value="2-3 Years Experience">2-3 Years Experience</option>
                      <option value="4+ Years Veteran Crew">4+ Years Veteran Crew</option>
                    </select>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State / UT *</label>
                  <select
                    required
                    value={state}
                    onChange={e => handleStateChange(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium text-slate-800"
                  >
                    <option value="">-- Select State --</option>
                    {ALL_INDIAN_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <select
                    required
                    disabled={!state}
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium text-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    {!state ? (
                      <option value="">-- Select State First --</option>
                    ) : (
                      <>
                        <option value="">-- Select City --</option>
                        {getCitiesByState(state).map(ct => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Area / Locality / Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vesu, Adajan, Ring Road"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

            </div>

            {/* Account Deletion Area */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
