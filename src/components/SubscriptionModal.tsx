import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Shield, IndianRupee, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SubscriptionPlan } from '../types';
import { api } from '../lib/api';

export const SubscriptionModal: React.FC = () => {
  const { subscriptionModalOpen, closeSubscriptionModal, user, subscription, setUserAndSub } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subscriptionModalOpen) {
      const role = user?.role || 'crew';
      api.getPlans(role).then(res => setPlans(res || [])).catch(err => console.error(err));
    }
  }, [subscriptionModalOpen, user]);

  if (!subscriptionModalOpen) return null;

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) return;
    setSubscribing(plan.id);
    setError(null);

    try {
      const res = await api.subscribe(user.id, plan.id);
      setUserAndSub(user, res.subscription);
      setSubscribing(null);
      setSuccessMsg(`Successfully subscribed to ${plan.name}!`);
      setTimeout(() => {
        setSuccessMsg(null);
        closeSubscriptionModal();
      }, 1800);
    } catch (err: any) {
      setSubscribing(null);
      setError(err.message || 'Subscription failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 my-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={closeSubscriptionModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            {user?.role === 'handler' ? 'Event Organizer Subscriptions' : 'Crew Member Pass'}
          </span>
          <h3 className="text-2xl font-black text-slate-900">
            {user?.role === 'handler' ? 'Publish Events & Hire Top Crew' : 'Unlock Unlimited Event Applications'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Choose a flexible plan that fits your needs. Cancel or upgrade anytime without data loss.
          </p>
        </div>

        {subscription && (
          <div className="mb-6 p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-blue-900">Current Plan: {subscription.planName}</div>
              <div className="text-[11px] text-blue-700">
                Expires on: {new Date(subscription.expiryDate).toLocaleDateString()}
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-full">
              {subscription.status.toUpperCase()}
            </span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center">
            {successMsg}
          </div>
        )}

        {/* Plan Cards Grid */}
        <div className="grid sm:grid-cols-3 gap-4 my-4">
          {plans.map(p => {
            const isCurrent = subscription?.planId === p.id && subscription.status === 'active';
            const isBest = p.durationMonths === 12 || p.priceInr === 1999 || p.priceInr === 699;

            return (
              <div
                key={p.id}
                className={`relative rounded-2xl p-5 border-2 flex flex-col justify-between transition-all ${
                  isBest
                    ? 'border-blue-600 bg-blue-50/30 shadow-md'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                {isBest && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Best Value
                  </span>
                )}

                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">{p.name}</h4>
                  <div className="text-2xl font-black text-slate-900 my-2 flex items-baseline gap-0.5">
                    <IndianRupee className="w-5 h-5 text-blue-600" />
                    {p.priceInr}
                    <span className="text-xs font-normal text-slate-500">
                      / {p.durationMonths === 1 ? 'month' : `${p.durationMonths} months`}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 my-4">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-tight">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(p)}
                  disabled={isCurrent || subscribing === p.id}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-slate-200 text-slate-500 cursor-default'
                      : isBest
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCurrent ? 'Active Plan' : subscribing === p.id ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          <span>Safe & Secure Payment Architecture • No hidden renewal charges • Priority 24/7 Support</span>
        </div>
      </div>
    </div>
  );
};
