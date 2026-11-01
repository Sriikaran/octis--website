import { useState } from 'react';

export default function ShareBar({ title, url }) {
  const [copied, setCopied] = useState(false);
  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const whatsApp = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (err) {
      setCopied(false);
    }
  }

  const linkClass = 'text-sm font-medium text-[#1a2f4a] underline decoration-[#e2cfa2] underline-offset-4';

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="text-sm text-[#6b3a2a]">Share</span>
      <a className={linkClass} href={linkedIn} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
      <a className={linkClass} href={whatsApp} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
      <button type="button" onClick={copyUrl} className={linkClass}>
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  );
}
