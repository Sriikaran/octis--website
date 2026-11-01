import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LandingLayout from '../components/landing/LandingLayout';
import { PRODUCT_OPTIONS, DEMO_CONFIG } from '../lib/demoConfig';
import { toast } from 'react-hot-toast';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Building2,
  ShoppingBag,
  Scale,
  Coins,
  Layers,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Download,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';

export default function RequestDemoPage() {
  const router = useRouter();

  // Multi-step: 1 = Business Info, 2 = Product & Profile, 3 = Date & Time, 4 = Review, 5 = Confirmed
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    showroomName: '',
    email: '',
    phone: '',
    city: '',
    product: 'jewellery-erp',
    businessType: 'Retail Showroom',
    branches: '1',
    challenges: '',
    message: '',
    date: '',
    time: '',
  });

  const [errors, setErrors] = useState({});

  // Calendar & Slot States
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Preselect product from query params (?product=pawnify etc.)
  useEffect(() => {
    if (router.query.product) {
      const qProduct = String(router.query.product).toLowerCase();
      const match = PRODUCT_OPTIONS.find(
        (p) => p.id === qProduct || p.name.toLowerCase().includes(qProduct)
      );
      if (match) {
        setFormData((prev) => ({ ...prev, product: match.id }));
      }
    }
  }, [router.query.product]);

  // Compute allowed date ranges
  const { minDateStr, maxDateStr, defaultInitialDate } = useMemo(() => {
    const today = new Date();
    // Default to tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // If tomorrow is Saturday or Sunday, advance to next Monday
    const day = tomorrow.getDay();
    if (day === 6) tomorrow.setDate(tomorrow.getDate() + 2);
    else if (day === 0) tomorrow.setDate(tomorrow.getDate() + 1);

    const max = new Date(today);
    max.setDate(max.getDate() + (DEMO_CONFIG.maxBookingHorizonDays || 30));

    const toStr = (d) => d.toISOString().split('T')[0];

    return {
      minDateStr: toStr(today),
      maxDateStr: toStr(max),
      defaultInitialDate: toStr(tomorrow),
    };
  }, []);

  // Initialize selected date
  useEffect(() => {
    if (!selectedDate && defaultInitialDate) {
      setSelectedDate(defaultInitialDate);
      setFormData((prev) => ({ ...prev, date: defaultInitialDate }));
    }
  }, [defaultInitialDate, selectedDate]);

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;

    let isMounted = true;
    setSlotsLoading(true);
    setSlotsError(null);

    fetch(`/api/demo/availability?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setSlotsLoading(false);
        if (data.success && data.isAvailableDay) {
          setAvailableSlots(data.slots || []);
          setSlotsError(null);
        } else {
          setAvailableSlots([]);
          setSlotsError(data.reason || 'This date is not available for bookings.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setSlotsLoading(false);
        setSlotsError('Failed to check slot availability. Please try again.');
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full name is required (min 2 characters).';
    }
    if (!formData.showroomName.trim() || formData.showroomName.trim().length < 2) {
      errs.showroomName = 'Store or jewellery business name is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please provide a valid 10-digit phone number.';
    }
    if (!formData.city.trim()) {
      errs.city = 'City or showroom location is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    return true; // Product selection always has default
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const errs = {};
    if (!formData.date) {
      errs.date = 'Please select an appointment date.';
    }
    if (!formData.time) {
      errs.time = 'Please select a preferred 30-minute time slot.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (currentStep === 3) {
      if (!validateStep3()) return;
      setCurrentStep(4);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Final Submission
  const handleFinalSubmit = async () => {
    setSubmitting(true);

    try {
      const res = await fetch('/api/demo/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setSubmitting(false);

      if (res.ok && data.success) {
        setBookingResult(data);
        setCurrentStep(5);
        toast.success('Your demonstration appointment is confirmed!');
        window.scrollTo({ top: 80, behavior: 'smooth' });
      } else {
        if (data.code === 'SLOT_UNAVAILABLE') {
          toast.error(data.error);
          setCurrentStep(3); // Return to slot selection
        } else if (data.fields) {
          setErrors(data.fields);
          toast.error(data.error || 'Please correct the highlighted errors.');
          setCurrentStep(1);
        } else {
          toast.error(data.error || 'Failed to confirm booking.');
        }
      }
    } catch (err) {
      setSubmitting(false);
      toast.error('Network error. Please try again.');
    }
  };

  // Generate downloadable .ics calendar file
  const downloadIcsFile = () => {
    if (!bookingResult?.booking) return;
    const { booking, enquiry } = bookingResult;
    const [h, m] = booking.startTime.split(':');
    const [endH, endM] = booking.endTime.split(':');
    const cleanDate = booking.date.replace(/-/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Octis Technologies//Demo Appointment//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${booking.referenceId}@octis.in`,
      `DTSTAMP:${cleanDate}T${h}${m}00Z`,
      `DTSTART;TZID=Asia/Kolkata:${cleanDate}T${h}${m}00`,
      `DTEND;TZID=Asia/Kolkata:${cleanDate}T${endH}${endM}00`,
      `SUMMARY:Octis Software Demonstration (${enquiry.product})`,
      `DESCRIPTION:Showroom demonstration of Octis platform for ${enquiry.showroomName}.\\nBooking Reference: ${booking.referenceId}\\nContact: +91 7396 029 339 / hello@octis.in`,
      'LOCATION:Online Live Demonstration (Screen Share)',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Octis-Demo-${booking.referenceId}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const selectedProductObj = PRODUCT_OPTIONS.find((p) => p.id === formData.product) || PRODUCT_OPTIONS[0];

  const stepsList = [
    { num: 1, title: 'Business Info' },
    { num: 2, title: 'Product & Scope' },
    { num: 3, title: 'Date & Time' },
    { num: 4, title: 'Review & Confirm' },
  ];

  return (
    <LandingLayout path="/request-demo">
      {/* Header Banner */}
      <section className="relative pt-10 pb-8 md:pt-14 md:pb-10 bg-gradient-to-b from-[#faf8f4] via-cream-50 to-[#faf8f4] border-b border-gold-300/30 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/15 border border-gold-400/30 text-xs font-semibold text-gold-800 uppercase tracking-widest mb-3">
            <CalendarCheck className="w-3.5 h-3.5 text-gold-600" />
            <span>Interactive Showroom Demo</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a2f4a] tracking-tight mb-3">
            Schedule a Live{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-[#9a7209]">
              1-on-1 Demonstration
            </span>
          </h1>

          <p className="text-sm sm:text-base text-brown-600 max-w-2xl mx-auto leading-relaxed">
            Experience how Octis unifies showroom POS billing, inventory tags, karigar tracking, and bullion operations. Real-time availability with no waitlists.
          </p>

          {/* Progress Indicator (hidden on step 5) */}
          {currentStep < 5 && (
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
                {stepsList.map((step) => {
                  const isDone = currentStep > step.num;
                  const isCurrent = currentStep === step.num;
                  return (
                    <div key={step.num} className="flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mb-1.5 transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-[#1a2f4a] text-[#f6edd9] ring-4 ring-gold-400/20 shadow-md'
                            : 'bg-white text-muted-foreground border border-gold-300/60'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                      </div>
                      <span
                        className={`text-[11px] sm:text-xs font-semibold ${
                          isCurrent ? 'text-primary' : isDone ? 'text-emerald-700' : 'text-muted-foreground'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Flow Card */}
      <section className="py-12 sm:py-16 bg-[#faf8f4]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-gold-300/60 shadow-xl overflow-hidden p-6 sm:p-10">
            {/* STEP 1: BUSINESS INFO */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-gold-200/50 pb-4">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1a2f4a]">
                    Step 1: Your Business Information
                  </h2>
                  <p className="text-xs sm:text-sm text-brown-600 mt-1">
                    Please provide your contact information so our showroom team can prepare your session.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rajesh Verma"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        errors.name
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-gold-300/60 focus:ring-primary'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Jewellery Showroom / Store Name *
                    </label>
                    <input
                      type="text"
                      name="showroomName"
                      value={formData.showroomName}
                      onChange={handleInputChange}
                      placeholder="e.g. Verma Jewellers"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        errors.showroomName
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-gold-300/60 focus:ring-primary'
                      }`}
                    />
                    {errors.showroomName && (
                      <p className="text-xs text-red-500 mt-1">{errors.showroomName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Phone Number (WhatsApp Ready) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 98765 43210"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-gold-300/60 focus:ring-primary'
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="rajesh@vermajewellers.com"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-gold-300/60 focus:ring-primary'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    City &amp; State *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Hyderabad, Telangana"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      errors.city
                        ? 'border-red-400 focus:ring-red-300'
                        : 'border-gold-300/60 focus:ring-primary'
                    }`}
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a2f4a] text-[#f6edd9] font-semibold text-sm hover:bg-[#243a58] shadow-md transition-all"
                  >
                    <span>Next: Select Product</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PRODUCT SELECTION & PROFILE */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-gold-200/50 pb-4">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1a2f4a]">
                    Step 2: Choose Platform &amp; Business Scope
                  </h2>
                  <p className="text-xs sm:text-sm text-brown-600 mt-1">
                    Select the specific software platform you wish to evaluate during the demo.
                  </p>
                </div>

                {/* Product Radio Cards */}
                <div className="space-y-3">
                  {PRODUCT_OPTIONS.map((prod) => {
                    const isSelected = formData.product === prod.id;
                    return (
                      <div
                        key={prod.id}
                        onClick={() => setFormData((prev) => ({ ...prev, product: prod.id }))}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-gold-50/80 border-primary ring-2 ring-primary/20 shadow-sm'
                            : 'bg-white border-gold-300/40 hover:border-gold-400 hover:bg-cream-50/40'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                            isSelected
                              ? 'border-[#1a2f4a] bg-[#1a2f4a] text-[#f6edd9]'
                              : 'border-gold-300 bg-white'
                          }`}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-gold-300" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-display text-sm font-bold text-[#1a2f4a]">
                              {prod.name}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-gold-200/40 text-gold-800">
                              {prod.tagline}
                            </span>
                          </div>
                          <p className="text-xs text-brown-600 mt-1">{prod.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Profile Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    >
                      <option value="Retail Showroom">Retail Showroom</option>
                      <option value="Multi-Store Chain">Multi-Store Chain</option>
                      <option value="Pawn Broker / Girvi">Pawn Broker / Girvi</option>
                      <option value="Bullion Dealer">Bullion Dealer</option>
                      <option value="Wholesaler / Manufacturer">Wholesaler / Manufacturer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Number of Branches / Counters
                    </label>
                    <select
                      name="branches"
                      value={formData.branches}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    >
                      <option value="1">1 Branch (Single Showroom)</option>
                      <option value="2-5">2 to 5 Branches</option>
                      <option value="6-10">6 to 10 Branches</option>
                      <option value="10+">10+ Branches (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Current Software or Specific Challenges (Optional)
                  </label>
                  <textarea
                    name="challenges"
                    rows={2}
                    value={formData.challenges}
                    onChange={handleInputChange}
                    placeholder="e.g. Currently using Tally, looking to automate HUID tags and karigar job cards..."
                    className="w-full px-4 py-2 rounded-xl border border-gold-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gold-300/60 text-xs font-semibold text-foreground hover:bg-gold-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a2f4a] text-[#f6edd9] font-semibold text-sm hover:bg-[#243a58] shadow-md transition-all"
                  >
                    <span>Next: Choose Date &amp; Time</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DATE & TIME-SLOT SELECTION */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-gold-200/50 pb-4">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1a2f4a]">
                    Step 3: Select Appointment Date &amp; Time
                  </h2>
                  <p className="text-xs sm:text-sm text-brown-600 mt-1">
                    Real-time available slots for 30-minute demonstration in {DEMO_CONFIG.timezoneDisplay}.
                  </p>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Select Appointment Date (Monday – Friday)
                  </label>
                  <div className="relative max-w-sm">
                    <Calendar className="w-4 h-4 text-gold-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      min={minDateStr}
                      max={maxDateStr}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setFormData((prev) => ({ ...prev, date: e.target.value, time: '' }));
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium text-foreground bg-white"
                    />
                  </div>
                  {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                </div>

                {/* Time Slots Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-foreground">
                      Available Time Slots for {selectedDate || 'Selected Date'}
                    </label>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold-600" /> 30 mins each
                    </span>
                  </div>

                  {slotsLoading ? (
                    <div className="py-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                      <span>Checking server availability...</span>
                    </div>
                  ) : slotsError ? (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Date Unavailable</p>
                        <p className="mt-0.5">{slotsError}</p>
                      </div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      No open slots on this date. Please choose another date above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1">
                      {availableSlots.map((slot) => {
                        const isSelected = formData.time === slot.time;
                        return (
                          <button
                            key={slot.slotId}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setFormData((prev) => ({ ...prev, time: slot.time }))}
                            className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center ${
                              isSelected
                                ? 'bg-[#1a2f4a] text-[#f6edd9] border-[#1a2f4a] ring-2 ring-[#1a2f4a]/20 shadow-sm'
                                : slot.available
                                ? 'bg-white hover:bg-gold-50 text-foreground border-gold-300/60 hover:border-gold-400'
                                : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            }`}
                          >
                            <span className="text-[13px]">{slot.display}</span>
                            <span className="text-[10px] font-normal opacity-80 mt-0.5">
                              {slot.available ? 'Available' : 'Unavailable'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {errors.time && <p className="text-xs text-red-500 mt-2">{errors.time}</p>}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gold-300/60 text-xs font-semibold text-foreground hover:bg-gold-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a2f4a] text-[#f6edd9] font-semibold text-sm hover:bg-[#243a58] shadow-md transition-all"
                  >
                    <span>Next: Review &amp; Confirm</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & CONFIRM */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-gold-200/50 pb-4">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1a2f4a]">
                    Step 4: Review Your Booking Details
                  </h2>
                  <p className="text-xs sm:text-sm text-brown-600 mt-1">
                    Please verify your appointment summary before submitting.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="rounded-2xl border border-gold-300/50 bg-[#faf8f4] p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-gold-200/50">
                    <span className="text-muted-foreground font-medium">Selected Platform:</span>
                    <span className="font-bold text-[#1a2f4a] text-sm">
                      {selectedProductObj.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gold-200/50">
                    <span className="text-muted-foreground font-medium">Appointment Date:</span>
                    <span className="font-semibold text-foreground">{formData.date}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gold-200/50">
                    <span className="text-muted-foreground font-medium">Time Slot (30 Mins):</span>
                    <span className="font-bold text-emerald-800 text-sm">
                      {formData.time} ({DEMO_CONFIG.timezone})
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gold-200/50">
                    <span className="text-muted-foreground font-medium">Showroom / Store:</span>
                    <span className="font-semibold text-foreground">
                      {formData.showroomName} ({formData.city})
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gold-200/50">
                    <span className="text-muted-foreground font-medium">Representative Name:</span>
                    <span className="font-semibold text-foreground">{formData.name}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gold-200/50">
                    <span className="text-muted-foreground font-medium">Contact Phone:</span>
                    <span className="font-mono font-semibold text-foreground">{formData.phone}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Contact Email:</span>
                    <span className="font-mono text-foreground">{formData.email}</span>
                  </div>

                  {formData.challenges && (
                    <div className="pt-2 border-t border-gold-200/50 text-[11px] text-brown-600 italic">
                      Notes: {formData.challenges}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gold-300/60 text-xs font-semibold text-foreground hover:bg-gold-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back / Edit
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleFinalSubmit}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1a2f4a] text-[#f6edd9] font-bold text-sm hover:bg-[#243a58] shadow-lg transition-all disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gold-300 border-t-transparent rounded-full animate-spin" />
                        <span>Reserving Slot...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm &amp; Schedule Demo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: SUCCESS / CONFIRMED */}
            {currentStep === 5 && bookingResult && (
              <div className="text-center py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                    Appointment Confirmed
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1a2f4a] mt-3">
                    Your Demo Has Been Scheduled!
                  </h2>
                  <p className="text-xs sm:text-sm text-brown-600 max-w-md mx-auto mt-2">
                    We look forward to meeting you and presenting {bookingResult.enquiry.product} tailored to your showroom counters.
                  </p>
                </div>

                {/* Reference ID Card */}
                <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#faf8f4] border border-gold-300/60 text-left space-y-3">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-gold-200/50">
                    <span className="text-muted-foreground font-medium">Booking Reference:</span>
                    <span className="font-mono font-bold text-primary text-sm">
                      {bookingResult.referenceId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-2 border-b border-gold-200/50">
                    <span className="text-muted-foreground font-medium">Scheduled Time:</span>
                    <span className="font-semibold text-foreground">
                      {bookingResult.booking.date} at {bookingResult.booking.startTime} ({bookingResult.booking.timezone})
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Customer:</span>
                    <span className="font-semibold text-foreground">
                      {bookingResult.enquiry.name} ({bookingResult.enquiry.showroomName})
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={downloadIcsFile}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400 text-primary font-semibold text-xs transition-all shadow-xs"
                  >
                    <Download className="w-4 h-4 text-gold-700" />
                    <span>Add to Calendar (.ics)</span>
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#1a2f4a] text-[#f6edd9] font-semibold text-xs hover:bg-[#243a58] shadow-sm"
                  >
                    <span>Return to Homepage &rarr;</span>
                  </Link>
                </div>

                <div className="pt-6 border-t border-gold-200/40 text-xs text-muted-foreground max-w-sm mx-auto">
                  Need to make adjustments? Reach our team directly at{' '}
                  <a href="tel:+917396029339" className="font-semibold text-primary underline">
                    +91 7396 029 339
                  </a>{' '}
                  or{' '}
                  <a href="mailto:hello@octis.in" className="font-semibold text-primary underline">
                    hello@octis.in
                  </a>.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}

