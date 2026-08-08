import { ReactNode } from 'react';
import { HomeHeader } from './HomeHeader';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';

interface HomeLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export const HomeLayout = ({ children, showFooter = true }: HomeLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />
      <main className="flex-1 overflow-x-hidden pb-20 sm:pb-0">
        {children}
      </main>
      {showFooter && <Footer />}
      <WhatsAppButton />
    </div>
  );
};
