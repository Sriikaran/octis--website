import React, { useState } from 'react';
import Link from 'next/link';
import LandingLayout from '../components/landing/LandingLayout';
import { toast } from 'react-hot-toast';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  ShoppingBag,
  Scale,
  Coins,
  ShieldCheck,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    showroomName: '',
    phone: '',
    email: '',
    city: '',
    product: 'jewellery-erp',
    message: '',
    website_url: '', // Anti-spam honeypot
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setFieldErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSubmitted(true);
        toast.success(data.message || 'Thank you! Your showroom inquiry has been received.');
      } else {
        if (data.fields) {
          setFieldErrors(data.fields);
        }
        toast.error(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      toast.error('Network error. Please check your connection or call sales directly.');
    }
  };

  return (
    <LandingLayout path="/contact">
      {/* Contact Page Hero */}
      <section className="relative pt-12 pb-14 md:pt-16 md:pb-20 bg-gradient-to-b from-[#faf8f4] via-cream-50 to-[#faf8f4] border-b border-gold-300/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/15 border border-gold-400/30 text-xs font-semibold text-gold-800 uppercase tracking-widest mb-4">
            <Building2 className="w-3.5 h-3.5 text-gold-600" />
            <span>Showroom Advisory &amp; Support</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a2f4a] tracking-tight mb-5 max-w-4xl mx-auto">
            Speak with an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-[#9a7209]">
              Octis Specialist
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-brown-600 max-w-2xl mx-auto leading-relaxed">
            Schedule a personalized live demonstration for your showroom, discuss custom karigar workflows, or get direct technical guidance.
          </p>
        </div>
      </section>

      {/* Main Form and Direct Contact Cards */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            {/* Left Contact Details & Quick Links (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Highlight to Request Demo Calendar */}
              <div className="p-6 rounded-2xl bg-gold-400/10 border border-gold-400/30 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-700 block mb-1">
                  Online Scheduling Available
                </span>
                <h3 className="font-display text-lg font-bold text-[#1a2f4a] mb-2">
                  Prefer to Pick Your Time Slot?
                </h3>
                <p className="text-xs text-brown-600 mb-4 leading-relaxed">
                  Use our interactive calendar to reserve a 30-minute demonstration slot with real-time availability.
                </p>
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a2f4a] text-[#f6edd9] font-semibold text-xs shadow-sm hover:bg-[#243a58] transition-all"
                >
                  <span>Open Demo Booking Calendar &rarr;</span>
                </Link>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-[#1a2f4a] mb-3">
                  Direct Showroom Channels
                </h2>
                <p className="text-sm text-brown-600 leading-relaxed">
                  We work closely with retail jewellers, pawn brokers, and bullion houses across all major jewellery hubs in India.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <a
                  href="tel:+917396029339"
                  className="p-5 rounded-2xl bg-[#faf8f4] border border-gold-300/40 hover:border-gold-400 flex items-start gap-4 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-gold-300 transition-colors shrink-0">
                    <Phone className="w-5 h-5 text-gold-600 group-hover:text-gold-300" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Direct Showroom Advisory
                    </span>
                    <span className="text-base font-bold text-[#1a2f4a] group-hover:text-gold-600 transition-colors block mt-0.5">
                      +91 7396 029 339
                    </span>
                    <span className="text-xs text-brown-600 block mt-1">
                      Mon – Sat: 9:30 AM – 7:30 PM IST
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:hello@octis.in"
                  className="p-5 rounded-2xl bg-[#faf8f4] border border-gold-300/40 hover:border-gold-400 flex items-start gap-4 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-gold-300 transition-colors shrink-0">
                    <Mail className="w-5 h-5 text-gold-600 group-hover:text-gold-300" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      General &amp; Demo Enquiries
                    </span>
                    <span className="text-base font-bold text-[#1a2f4a] group-hover:text-gold-600 transition-colors block mt-0.5">
                      hello@octis.in
                    </span>
                    <span className="text-xs text-brown-600 block mt-1">
                      Responses within 4 business hours
                    </span>
                  </div>
                </a>

                <div className="p-5 rounded-2xl bg-[#faf8f4] border border-gold-300/40 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-primary shrink-0">
                    <ShieldCheck className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      National On-Site Rollouts
                    </span>
                    <span className="text-sm font-bold text-[#1a2f4a] block mt-0.5">
                      Pan-India Migration &amp; Staff Training
                    </span>
                    <span className="text-xs text-brown-600 block mt-1">
                      On-site counter setup available for multi-branch showrooms
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Consultation Form (7 cols) */}
            <div className="lg:col-span-7 bg-[#faf8f4] p-8 sm:p-10 rounded-3xl border border-gold-300/50 shadow-md">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#1a2f4a] mb-2">
                    Demo Request Received
                  </h3>
                  <p className="text-sm text-brown-600 max-w-md mx-auto mb-6 leading-relaxed">
                    Thank you, <span className="font-semibold text-foreground">{formData.name}</span>. An Octis specialist will contact you at <span className="font-semibold text-foreground">{formData.phone}</span> to coordinate your demonstration.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        showroomName: '',
                        phone: '',
                        email: '',
                        city: '',
                        product: 'jewellery-erp',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#1a2f4a] text-[#f6edd9] text-xs font-semibold hover:bg-[#243a58]"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Anti-spam honeypot */}
                  <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                    <input
                      type="text"
                      name="website_url"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website_url}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#1a2f4a] mb-1">
                      Schedule a Live Consultation
                    </h3>
                    <p className="text-xs sm:text-sm text-brown-600">
                      Fill in your details below and our advisory team will arrange a guided walkthrough.
                    </p>
                  </div>

                  {/* Product Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Primary Software of Interest
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'jewellery-erp', label: 'Jewellery ERP' },
                        { id: 'pawnify', label: 'Pawnify (Loan)' },
                        { id: 'bulion', label: 'Bulion Trading' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, product: item.id }))}
                          className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                            formData.product === item.id
                              ? 'bg-[#1a2f4a] text-[#f6edd9] border-[#1a2f4a] shadow-xs'
                              : 'bg-white text-foreground/80 border-gold-300/60 hover:bg-gold-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name and Showroom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rajesh Verma"
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-300/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Jewellery Showroom / Business Name
                      </label>
                      <input
                        type="text"
                        name="showroomName"
                        value={formData.showroomName}
                        onChange={handleChange}
                        placeholder="e.g. Verma Jewellers"
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-300/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Phone and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-300/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rajesh@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-300/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      City &amp; State
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Hyderabad, Telangana"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-300/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Specific Requirements or Current Software
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your showroom counters, number of branches, or migration questions..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-300/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#1a2f4a] text-[#f6edd9] hover:bg-[#243a58] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Request Demonstration</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}

