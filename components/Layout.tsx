
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import InstitutionalInfrastructure from './InstitutionalInfrastructure';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <InstitutionalInfrastructure />
      <Footer />
    </div>
  );
};

export default Layout;
