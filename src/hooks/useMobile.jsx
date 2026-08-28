import { useState, useEffect } from 'react';

// This hook now returns `true` for any screen width less than 1024px.
// This covers both small (mobile) and medium (tablet) screens.
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkDevice();
    
    // Add listener for window resize
    window.addEventListener('resize', checkDevice);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;