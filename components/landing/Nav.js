import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';

export default function Nav({ currentPath = '/' }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      wasOpenRef.current = true;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const focusTimeout = setTimeout(() => {
        if (drawerRef.current) {
          const focusable = drawerRef.current.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            focusable[0].focus();
          }
        }
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
          e.preventDefault();
          setMobileMenuOpen(false);
          return;
        }

        if (e.key === 'Tab' && drawerRef.current) {
          const focusable = drawerRef.current.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;

          const firstElement = focusable[0];
          const lastElement = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(focusTimeout);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      toggleButtonRef.current?.focus();
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const standardNavLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
  ];

  const isCurrentActive = (href) => {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  };

  const linkClass = (href, mobile = false) => {
    const active = isCurrentActive(href);
    if (mobile) {
      return `text-base font-medium py-2.5 border-b border-gold-300/20 transition-colors ${
        active ? 'text-primary font-semibold' : 'text-foreground/85 hover:text-primary'
      }`;
    }
    return `text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1 ${
      active ? 'text-primary font-semibold' : 'text-foreground/80 hover:text-primary'
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 landing-nav transition-all duration-300 py-2.5 bg-[#faf8f4]/95 backdrop-blur-md border-b border-gold-300/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link href="/" className="group flex shrink-0 items-center" aria-label="Octis Home">
          <span className="inline-flex items-center flex-shrink-0 leading-none group-hover:scale-[1.02] transition-transform origin-left">
            <Image
              src="/logo.png"
              alt="Octis"
              width={3660}
              height={1428}
              priority
              className="!h-14 sm:!h-16 !w-auto object-contain object-left max-w-[min(100vw-8rem,22rem)]"
            />
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {standardNavLinks.map((link) => (
            <Link key={link.name} href={link.href} className={linkClass(link.href)}>
              {link.name}
            </Link>
          ))}

          <Link
            href="https://app.octis.in/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] h-9 px-3.5 text-foreground hover:text-primary hover:bg-primary/10"
          >
            Sign In
          </Link>

          <Link
            href="/request-demo"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md h-9 px-4 shadow-sm shadow-primary/20"
          >
            Request Demo
          </Link>
        </div>

        <button
          ref={toggleButtonRef}
          id="mobile-nav-toggle"
          type="button"
          className="lg:hidden text-foreground p-2 rounded-lg hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          ref={drawerRef}
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 bg-[#faf8f4]/98 backdrop-blur-xl border-t border-gold-300/30 z-40 p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col gap-2">
            {standardNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={linkClass(link.href, true)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-6 pb-6 border-t border-gold-300/30">
            <Link
              href="https://app.octis.in/login"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold border border-border/80 bg-white/80 hover:bg-white text-foreground h-11 shadow-sm"
            >
              Sign In
            </Link>
            <Link
              href="/request-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-11 shadow-sm shadow-primary/25"
            >
              Request Demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
