import SeoHead from '../SeoHead';
import Nav from './Nav';
import Footer from './Footer';

export default function LandingLayout({
  children,
  seo = {},
  path = '/',
}) {
  const isHome = path === '/';

  return (
    <>
      <SeoHead path={path} {...seo} />
      <div className="min-h-screen font-sans text-foreground landing-page selection:bg-gold-300 selection:text-[#1a0c08] flex flex-col">
        <Nav currentPath={path} />
        <main className={`flex-1 ${isHome ? '' : 'pt-20 md:pt-24'}`}>
          {children}
        </main>
        <Footer showDemoBand={path !== '/request-demo'} />
      </div>
    </>
  );
}
