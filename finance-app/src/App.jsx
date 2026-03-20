import React, { useState, useEffect } from 'react';
import DesktopDashboard from './components/dashboard/DesktopDashboard';
import MobileWallet from './components/dashboard/MobileWallet';
import { FinanceProvider } from './context/FinanceContext';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <FinanceProvider>
      {isMobile ? <MobileWallet /> : <DesktopDashboard />}
    </FinanceProvider>
  );
}
