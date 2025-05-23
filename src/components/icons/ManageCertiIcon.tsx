// src/components/icons/ManageCertiIcon.tsx

import React from 'react';

interface ManageCertiIconProps {
  size?: number | string;
  color?: string;
  className?: string;
  ariaLabel?: string;
}

const  ManageCertiIcon: React.FC<ManageCertiIconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ariaLabel,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden={ariaLabel ? undefined : 'true'}
      aria-label={ariaLabel}
    >
      <defs>
        <style>
          {`
            .cls-1 { fill: none; }
            .cls-2 { fill: #4285f4; }
            .cls-3 { fill: #669df6; }
          `}
        </style>
      </defs>
      <title>Manage Certificate Icon</title>
      <g fill="#4285f4">
        <path
          className="cls-1"
          clipRule="evenodd"
          fillRule="evenodd"
          d="m20.625 8.34876v10.28814c0 1.1034-.8847 1.9881-1.988 1.9881h-10.28823c-1.09343 0-1.98805-.8847-1.98805-1.9881h12.27628v-12.2762c1.1033 0 1.988 .89463 1.988 1.98806z"
        />
        <path
          className="cls-2"
          clipRule="evenodd"
          fillRule="evenodd"
          d="m15.6512 3.375h-10.28814c-1.09344 0-1.98806.89462-1.98806 1.98806v10.28814c0 1.1034.89462 1.9881 1.98806 1.9881h10.28814c1.1034 0 1.9881-.8847 1.9881-1.9881v-10.28814c0-1.09344-.8847-1.98806-1.9881-1.98806zm0 12.2762h-10.28814v-10.28814h10.28814z"
        />
        <path
          className="cls-3"
          d="m13.075 8.48262c-.0657-.34763-.2067-.65769-.3946-.93956-.2724-.4134-.6576-.74225-1.1086-.93956-.3288-.14093-.6858-.22549-1.071-.22549-.3758 0-.73286.08456-1.06169.22549-.45097.19731-.83617.52616-1.10863.93956-.29125.41341-.45096.92077-.45096 1.46572 0 .17851.01879.35703.05637.52615 0 .0094 0 .01879.00939.03758.01879.08456.03758.17852.06577.26308.07516.22551.17851.43221.31004.62011.12213.1785.26306.3476.43217.498v3.3072l1.74754-1.6442 1.7568 1.6442v-3.3072c.3383-.3007.5919-.6859.7423-1.11811.0281-.08456.0469-.17852.0657-.26308.0094-.01879.0094-.02818.0094-.03758.0376-.16912.0564-.34764.0564-.52615 0-.17852-.0188-.35704-.0564-.52616zm-1.3529.52616c0 .66708-.5449 1.21202-1.2213 1.21202-.6671 0-1.21201-.54494-1.21201-1.21202 0-.18792.03758-.36643.12213-.52616.1879-.4134.61068-.69527 1.08988-.69527.4885 0 .9113.28187 1.0992.69527.0845.15973.1221.33824.1221.52616z"
        />
      </g>
    </svg>
  );
};

export default ManageCertiIcon;
