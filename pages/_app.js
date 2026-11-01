import localFont from 'next/font/local';
import '../styles/globals.css';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { X } from 'lucide-react';

const inter = localFont({
  src: '../fonts/Inter-latin.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-inter',
});

const playfair = localFont({
  src: [
    {
      path: '../fonts/PlayfairDisplay-latin.woff2',
      weight: '600 700',
      style: 'normal',
    },
    {
      path: '../fonts/PlayfairDisplay-italic-latin.woff2',
      weight: '600 700',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-playfair',
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} ${playfair.variable} ${inter.className}`}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(16, 49%, 12%)',
            color: 'hsl(37, 70%, 94%)',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '13px',
            borderRadius: '10px',
            padding: '12px 16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255,255,255,0.06)',
          },
          success: {
            style: {
              background: '#14532d',
              color: '#dcfce7',
              border: '1px solid rgba(74, 222, 128, 0.15)',
            },
          },
          error: {
            duration: 10000,
            style: {
              background: '#7f1d1d',
              color: '#fee2e2',
              border: '1px solid rgba(248, 113, 113, 0.15)',
            },
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">{icon}</div>
                <div className="ml-3 flex-1">{message}</div>
                {t.type !== 'loading' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.dismiss(t.id);
                    }}
                    className="ml-4 p-1 rounded-full hover:bg-white/10 transition-colors"
                    title="Close"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
      <Component {...pageProps} />
    </div>
  );
}
