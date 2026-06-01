import React, { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

export function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (value === null || value === undefined || value === '') {
      setDisplayValue('0');
      return;
    }

    // Handle fraction like "X / Y" (e.g. Workouts: "2 / 6")
    if (typeof value === 'string' && value.includes('/')) {
      const parts = value.split('/').map(p => p.trim());
      const num1Match = parts[0].match(/[0-9.,]+/);
      const num2Match = parts[1].match(/[0-9.,]+/);
      
      const target1 = num1Match ? parseFloat(num1Match[0].replace(/,/g, '')) : 0;
      const target2 = num2Match ? parseFloat(num2Match[0].replace(/,/g, '')) : 0;
      
      if (!isNaN(target1) && !isNaN(target2)) {
        const obj = { val1: 0, val2: 0 };
        const controls = animate(obj, { val1: target1, val2: target2 }, {
          duration: 1.2,
          ease: 'easeOut',
          onUpdate: () => {
            const formatted1 = Math.round(obj.val1).toLocaleString();
            const formatted2 = Math.round(obj.val2).toLocaleString();
            // Preserve non-numeric characters if any existed around the numbers
            const prefix1 = parts[0].substring(0, parts[0].indexOf(num1Match[0]));
            const suffix1 = parts[0].substring(parts[0].indexOf(num1Match[0]) + num1Match[0].length);
            const prefix2 = parts[1].substring(0, parts[1].indexOf(num2Match[0]));
            const suffix2 = parts[1].substring(parts[1].indexOf(num2Match[0]) + num2Match[0].length);
            setDisplayValue(`${prefix1}${formatted1}${suffix1} / ${prefix2}${formatted2}${suffix2}`);
          }
        });
        return () => controls.stop();
      }
    }

    const stringVal = String(value);
    const numericMatch = stringVal.match(/[0-9.,]+/);
    if (!numericMatch) {
      setDisplayValue(stringVal);
      return;
    }

    const numericStr = numericMatch[0];
    const cleanNumericStr = numericStr.replace(/,/g, '');
    const target = parseFloat(cleanNumericStr);
    
    if (isNaN(target)) {
      setDisplayValue(stringVal);
      return;
    }
    
    const isDecimal = cleanNumericStr.includes('.');
    const decimalPlaces = isDecimal ? cleanNumericStr.split('.')[1].length : 0;

    const controls = animate(0, target, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest) => {
        const formatted = isDecimal 
          ? latest.toFixed(decimalPlaces) 
          : Math.round(latest).toLocaleString();
        
        setDisplayValue(stringVal.replace(numericStr, formatted));
      }
    });

    return () => controls.stop();
  }, [value]);

  return <span>{displayValue}</span>;
}

export default AnimatedNumber;
