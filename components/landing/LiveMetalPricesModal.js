import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, RefreshCw, Coins, Info } from 'lucide-react';

const UNAVAILABLE_MESSAGE = 'Live prices are currently unavailable.';
const FRESH_MS = 60 * 1000;

function isDisplayable(data) {
  if (!data || !['live', 'cached', 'stale'].includes(data.dataStatus)) return false;
  const gold = data.metals?.gold24k;
  const karat = data.metals?.gold22k;
  const silver = data.metals?.silver;
  const kilo = data.metals?.silverPerKg;
  const priceOk = (metal, unit, derived) => Boolean(
    metal
    && metal.currency === 'INR'
    && metal.unit === unit
    && metal.derived === derived
    && Number.isFinite(Number(metal.price))
    && Number(metal.price) > 0
  );
  return priceOk(gold, 'g', false)
    && priceOk(karat, 'g', true)
    && priceOk(silver, 'g', false)
    && priceOk(kilo, 'kg', true);
}

function formatInr(value) {
  return `₹${Number(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatIst(iso) {
  const parsed = Date.parse(iso);
  if (!Number.isFinite(parsed)) return '';
  return `${new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(parsed))} IST`;
}

/**
 * LiveMetalPricesModal
 * Rates come only from /api/metal-rates. Nothing is filled in when that
 * response has no verified quote.
 */
export default function LiveMetalPricesModal({ isOpen, onClose, triggerRef }) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const rateRef = useRef(null);
  const nextRefreshAtRef = useRef(0);
  const [rateData, setRateData] = useState(null);
  const [requestState, setRequestState] = useState('idle');
  const [lockUntil, setLockUntil] = useState(0);

  const applyPayload = useCallback((data) => {
    const seconds = Number(data?.nextRefreshSeconds);
    if (Number.isFinite(seconds) && seconds > 0) {
      const until = Date.now() + seconds * 1000;
      nextRefreshAtRef.current = until;
      setLockUntil(until);
    }
    if (data?.dataStatus === 'unavailable') {
      rateRef.current = null;
      setRateData(null);
      setRequestState('unavailable');
      return;
    }
    if (isDisplayable(data)) {
      rateRef.current = data;
      setRateData(data);
      setRequestState('ready');
      return;
    }
    if (rateRef.current && isDisplayable(rateRef.current)) {
      const previous = {
        ...rateRef.current,
        dataStatus: 'stale',
        label: 'Stale spot quote',
      };
      rateRef.current = previous;
      setRateData(previous);
      setRequestState('ready');
      return;
    }
    rateRef.current = null;
    setRateData(null);
    setRequestState('unavailable');
  }, []);

  const load = useCallback(async (refresh, signal) => {
    if (refresh && Date.now() < nextRefreshAtRef.current) return;
    setRequestState('loading');
    try {
      const response = await fetch(`/api/metal-rates${refresh ? '?refresh=1' : ''}`, {
        signal,
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }
      if (signal?.aborted) return;
      applyPayload(data);
    } catch (err) {
      if (err?.name === 'AbortError' || signal?.aborted) return;
      applyPayload(null);
    }
  }, [applyPayload]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);
    const current = rateRef.current;
    const fetchedAt = current?.fetchedAt ? Date.parse(current.fetchedAt) : NaN;
    const age = Number.isFinite(fetchedAt) ? Date.now() - fetchedAt : Infinity;
    let controller = null;
    if (!(current && isDisplayable(current) && age >= 0 && age < FRESH_MS)) {
      controller = new AbortController();
      load(false, controller.signal);
    } else {
      setRequestState('ready');
    }
    return () => {
      clearTimeout(focusTimer);
      controller?.abort();
    };
  }, [isOpen, load]);

  useEffect(() => {
    if (!lockUntil) return undefined;
    const left = lockUntil - Date.now();
    if (left <= 0) return undefined;
    const timer = setTimeout(() => setLockUntil(0), left);
    return () => clearTimeout(timer);
  }, [lockUntil]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        triggerRef?.current?.focus();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const showPrices = isDisplayable(rateData) && (requestState === 'ready' || requestState === 'loading');
  const showLoading = requestState === 'loading' && !showPrices;
  const showUnavailable = requestState === 'unavailable' && !showPrices;
  const status = showPrices ? rateData.dataStatus : showUnavailable ? 'unavailable' : 'loading';
  const refreshLocked = lockUntil > Date.now();
  const sourceUpdated = showPrices ? formatIst(rateData.sourceUpdatedAt) : '';
  const fetched = showPrices ? formatIst(rateData.fetchedAt) : '';

  let description = 'Checking the spot feed.';
  if (showUnavailable) description = UNAVAILABLE_MESSAGE;
  if (showPrices) description = 'International spot in INR per gram. Not a showroom board rate.';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1726]/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-busy={requestState === 'loading'}
        aria-labelledby="metal-rates-heading"
        aria-describedby="metal-rates-description"
        className="relative w-full max-w-lg bg-[#fcfaf7] border border-gold-300/80 rounded-2xl shadow-2xl shadow-[#152a45]/25 overflow-hidden text-[#1a2f4a] p-6 sm:p-7 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-gold-200/60 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 text-white flex items-center justify-center shadow-md shadow-gold-600/20">
              <Coins className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="metal-rates-heading"
                className="text-lg sm:text-xl font-bold font-display text-[#1a2f4a] tracking-tight"
              >
                Precious Metal Rates
              </h2>
              <p id="metal-rates-description" className="text-xs text-brown-600 font-medium">
                {description}
              </p>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => {
              onClose();
              triggerRef?.current?.focus();
            }}
            aria-label="Close metal prices dialog"
            className="rounded-lg p-1.5 text-brown-600 hover:text-[#1a2f4a] hover:bg-gold-100/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {showLoading && (
          <p className="mb-4 text-xs font-medium text-brown-600" role="status">
            Checking the spot feed…
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="p-3.5 rounded-xl bg-white border border-gold-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700">Gold 24K</span>
                <span className="text-[10px] text-muted-foreground font-mono">Fine</span>
              </div>
              <p className="text-xl font-bold font-mono text-[#1a2f4a] tabular-nums">
                {showPrices ? formatInr(rateData.metals.gold24k.price) : '—'}
              </p>
            </div>
            <p className="text-[11px] text-brown-500 mt-2 font-medium">per gram</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-gold-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700">Gold 22K</span>
                <span className="text-[10px] text-muted-foreground font-mono">Indicative</span>
              </div>
              <p className="text-xl font-bold font-mono text-[#1a2f4a] tabular-nums">
                {showPrices ? formatInr(rateData.metals.gold22k.price) : '—'}
              </p>
            </div>
            <p className="text-[11px] text-brown-500 mt-2 font-medium">per gram · calculated</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-gold-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Silver</span>
                <span className="text-[10px] text-muted-foreground font-mono">Fine</span>
              </div>
              <p className="text-xl font-bold font-mono text-[#1a2f4a] tabular-nums">
                {showPrices ? formatInr(rateData.metals.silver.price) : '—'}
              </p>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2 text-[11px] text-brown-500 font-medium">
              <span>per gram</span>
              <span className="text-[10px] text-slate-600 font-mono text-right">
                {showPrices ? `${formatInr(rateData.metals.silverPerKg.price)}/kg` : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-3.5 mb-4 bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs" role="status">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-amber-950">
                  {status === 'live' && 'International spot quote'}
                  {status === 'cached' && 'Cached spot quote'}
                  {status === 'stale' && 'Stale spot quote'}
                  {status === 'loading' && 'Checking the spot feed'}
                  {status === 'unavailable' && UNAVAILABLE_MESSAGE}
                </span>
                {status === 'live' && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-200/80 text-amber-900">Live</span>
                )}
                {status === 'cached' && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-200/80 text-amber-900">Cached</span>
                )}
                {status === 'stale' && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-200/80 text-amber-900">Stale</span>
                )}
              </div>
              {showPrices && (
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  {status === 'live' && 'Gold API spot price. 22K is calculated from 24K × 22/24. GST is not included. This is not a showroom or city retail price.'}
                  {status === 'cached' && 'Shown from the last verified fetch. The source time below is unchanged.'}
                  {status === 'stale' && 'The price feed did not return a new quote. These figures are an earlier verified quote, not a live price.'}
                </p>
              )}
              {showPrices && (
                <p className="text-[11px] text-amber-900/90 leading-relaxed font-mono">
                  {`Source: ${rateData.source} (${rateData.sourceDetail}).`}
                  {sourceUpdated ? ` Updated ${sourceUpdated}.` : ''}
                  {fetched ? ` Fetched ${fetched}.` : ''}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brown-600 border-t border-gold-200/60 pt-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                status === 'live' ? 'bg-emerald-500' : status === 'cached' ? 'bg-amber-500' : 'bg-stone-400'
              }`}
              aria-hidden="true"
            />
            <span className="font-mono text-[11px]">
              {showLoading && 'Checking…'}
              {showUnavailable && 'Unavailable'}
              {showPrices && status === 'live' && 'Live'}
              {showPrices && status === 'cached' && 'Cached'}
              {showPrices && status === 'stale' && 'Stale'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => load(true)}
            disabled={requestState === 'loading' || refreshLocked}
            aria-busy={requestState === 'loading'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary bg-gold-100/70 hover:bg-gold-200/80 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${requestState === 'loading' ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>{requestState === 'loading' ? 'Refreshing…' : 'Refresh'}</span>
          </button>
        </div>

        {showPrices && (
          <p className="mt-3 text-[10px] text-brown-500 leading-normal border-t border-gold-100 pt-2">
            Spot value only. The per-kilogram silver figure is the same quote times 1,000. Showroom bills use the store board rate in Octis ERP.
          </p>
        )}
      </div>
    </div>
  );
}
