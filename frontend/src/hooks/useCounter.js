import { useState, useEffect } from 'react';

export const useCounter = (target, duration = 1500, decimals = 1) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(parseFloat(current.toFixed(decimals)));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [target]);

  return value;
};

export default useCounter;
