// src/components/icons/AnotherIcon.tsx

import React from 'react';

interface AnotherIconProps {
  height?: number | string;
  width?: number | string;
  color?: string;
  className?: string;
  ariaLabel?: string;
}

const CertificateIcon: React.FC<AnotherIconProps> = ({
  height='24px',
  width = '16px',
  color = 'currentColor',
  className = '',
  ariaLabel,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 2050 2050"
      data-name="Layer 2"
      id="Layer_2"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaLabel ? undefined : 'true'}
      aria-label={ariaLabel}
    >
      <defs>
        <style>
          {`
            .cls-1{fill:#8a87b2;}
            .cls-2{fill:#231f20;opacity:0.2;}
            .cls-3{fill:#c8c2e9;}
            .cls-4{fill:#4d4c78;}
            .cls-5{fill:#f4c23f;}
            .cls-6{fill:#f4a93f;}
            .cls-7{fill:#de3226;}
            .cls-8{fill:#b11a31;}
            .cls-9{fill:#f8881b;}
            .cls-10{fill:#f08000;}
            .cls-11{fill:#fad564;}
            .cls-12{fill:#f44533;}
            .cls-13{fill:#dfdafd;}
          `}
        </style>
      </defs>
      <title>Another Icon</title>
      <rect
        className="cls-1"
        height="1218.03"
        rx="32.4"
        ry="32.4"
        width="1758.3"
        x="100.5"
        y="363.4"
      />
      <path
        className="cls-2"
        d="M492.7,1430.3c-135.9,0-246-110.2-246-246.1V363.4H132.9a32.4,32.4,0,0,0-32.4,32.4V1549a32.4,32.4,0,0,0,32.4,32.4H1826.4a32.5,32.5,0,0,0,32.5-32.4V1430.3Z"
      />
      <path
        className="cls-3"
        d="M200.5,579.5v785.7a116.2,116.2,0,0,1,116.2,116.2h1326a116.2,116.2,0,0,1,116.2-116.2h0V579.5h0a116.1,116.1,0,0,1-116.2-116.1H316.7A116.1,116.1,0,0,1,200.5,579.5Z"
      />
      <path
        className="cls-2"
        d="M257.2,1365.2V579.5A116.1,116.1,0,0,0,373.4,463.4H316.7A116.1,116.1,0,0,1,200.5,579.5v785.7a116.2,116.2,0,0,1,116.2,116.2h56.7A116.2,116.2,0,0,0,257.2,1365.2Z"
      />
      <path
        className="cls-4"
        d="M1235.6,622.7H723.8a20,20,0,0,1,0-40h511.8a20,20,0,0,1,0,40Z"
      />
      <path
        className="cls-4"
        d="M1105.8,711.7H853.6a20,20,0,0,1,0-40h252.2a20,20,0,0,1,0,40Z"
      />
      <path
        className="cls-4"
        d="M1321.6,925.7H430.9a20,20,0,1,1,0-40h890.7a20,20,0,0,1,0,40Z"
      />
      <path
        className="cls-4"
        d="M1094.2,1084.6H430.9a20,20,0,0,1,0-40h663.3a20,20,0,1,1,0,40Z"
      />
      <path
        className="cls-4"
        d="M1003.9,1243.6h-573a20,20,0,0,1,0-40h573a20,20,0,1,1,0,40Z"
      />
      <path
        className="cls-4"
        d="M1407.1,1084.6H1235.6a20,20,0,0,1,0-40h171.5a20,20,0,0,1,0,40Z"
      />
      <path
        className="cls-2"
        d="M1502.8,1581.4h323.6a32.5,32.5,0,0,0,32.5-32.4V1188.8c-2.3-1-4.7-1.9-7.2-2.8a72.5,72.5,0,0,0-21.8-3.4c-20.7,0-38.9,8.6-53.6,15.5-5.5,2.6-13.7,6.5-17.4,7.4-3.8-.9-12-4.8-17.5-7.4-14.7-6.9-32.9-15.5-53.5-15.5a72.7,72.7,0,0,0-21.9,3.4c-30.2,9.9-44.5,36.1-54.9,55.3-2.7,4.8-6.5,11.9-8.9,15-3.7,1.4-11.8,2.9-17.4,3.9-21.3,4-50.5,9.5-69,35s-14.7,54.6-11.9,76c.7,5.7,1.8,14.1,1.6,18.1-2.2,3.1-7.6,8.8-11.3,12.7-15.1,15.9-35.8,37.7-35.8,69.8s20.7,53.9,35.8,69.9c3.7,3.9,9.1,9.6,11.3,12.7.2,4-.9,12.3-1.6,18C1503.5,1575.3,1503.1,1578.3,1502.8,1581.4Z"
      />
      <path
        className="cls-5"
        d="M2015.3,1471.8c0,25.8-37.5,45.4-45,68.7s10.6,62-4,82.1-56.5,14.3-76.8,29-27.3,56.3-51.4,64.1-53.4-21.7-79.2-21.7-56,29.3-79.3,21.7-31.3-49.4-51.4-64.1-62-8.8-76.8-29,3.9-57.9-4-82.1-45-42.9-45-68.7,37.5-45.4,45-68.7-10.6-61.9,4-82,56.5-14.3,76.8-29.1,27.3-56.3,51.4-64.1,53.4,21.7,79.3,21.7,55.9-29.3,79.2-21.7,31.3,49.5,51.4,64.1,62,8.8,76.8,29.1-3.9,57.9,4,82S2015.3,1446,2015.3,1471.8Z"
      />
      <path
        className="cls-6"
        d="M1752.9,1655.5a167.5,167.5,0,0,1-118.6-49.1,167.4,167.4,0,0,1,0-237.2,167.7,167.7,0,1,1,118.6,286.3Z"
      />
      <path
        className="cls-6"
        d="M1859.2,1524.3a13.9,13.9,0,0,0-18.4-7l-103,46.3a15.6,15.6,0,0,0-3.9,2.6,15.6,15.6,0,0,0-3.9-2.6l-102.9-46.3a14,14,0,0,0-18.5,7l-47.8,106.4c18.6,10.7,50.5,8.6,67.4,20.9,19.5,14.2,26.8,53.6,49.1,63.3l56.6-125.9,50.2,111.7c18.8,8.1,38,20.2,54,15,24.1-7.8,31.3-49.4,51.4-64.1,6.1-4.4,14.2-7,22.9-9Z"
      />
      <path
        className="cls-7"
        d="M1651.7,1773l-24.3-43.1a14,14,0,0,0-15.1-6.8l-48.5,10.4a13.9,13.9,0,0,1-15.6-19.3l85.4-189.9a13.9,13.9,0,0,1,18.4-7l103,46.3a14,14,0,0,1,7,18.4l-85.4,189.9A14,14,0,0,1,1651.7,1773Z"
      />
      <path
        className="cls-8"
        d="M1663.4,1559.1a28.7,28.7,0,0,0-14.1-38.2l-8.2-3.8a13.9,13.9,0,0,0-7.5,7.2l-85.4,189.9a13.9,13.9,0,0,0,15.6,19.3l21-4.5Z"
      />
      <path
        className="cls-7"
        d="M1866,1773l24.3-43.1a14,14,0,0,1,15.1-6.8l48.5,10.4a13.9,13.9,0,0,0,15.6-19.3l-85.4-189.9a13.9,13.9,0,0,0-18.4-7l-103,46.3a14,14,0,0,0-7,18.4l85.4,189.9A14,14,0,0,0,1866,1773Z"
      />
      <path
        className="cls-8"
        d="M1789.5,1573.7l-31.3,13.9,82.9,184.3a14,14,0,0,0,24.9,1.1l6.9-12.2Z"
      />
      <path
        className="cls-8"
        d="M1755,1563.6l-103-46.3a13.9,13.9,0,0,0-18.4,7l-23.3,51.8a167.8,167.8,0,0,0,77.3,66.2,162.5,162.5,0,0,0,42.1,11.6L1762,1582A14,14,0,0,0,1755,1563.6Z"
      />
      <path
        className="cls-8"
        d="M1902.2,1564.4l-18.1-40.1a13.9,13.9,0,0,0-18.4-7l-103,46.3a14,14,0,0,0-7,18.4l31.5,70a163.7,163.7,0,0,0,31-9.7,167,167,0,0,0,53.3-35.9A170.5,170.5,0,0,0,1902.2,1564.4Z"
      />
      <circle className="cls-9" cx="1758.9" cy="1467.7" r="157" />
      <circle className="cls-10" cx="1758.9" cy="1467.7" r="138.7" />
      <circle className="cls-5" cx="1758.9" cy="1467.7" r="123.1" />
      <path
        className="cls-11"
        d="M1868.5,1286.3h0a29.4,29.4,0,0,0,8.8-8c-12.1-18.4-20.6-44.4-39.2-50.4-6.4-2.1-13.3-1.4-20.5.7a28.6,28.6,0,0,0,.6,27.1l11.8,20.2A28.2,28.2,0,0,0,1868.5,1286.3Z"
      />
      <path
        className="cls-11"
        d="M1759.5,1258.8a29.2,29.2,0,0,0,4-9.5l-4.6.3c-22.7,0-48.7-22.6-70.5-22.9a27.8,27.8,0,0,0,12.5,27.4l19.6,12.9a28.2,28.2,0,0,0,39-8.2Z"
      />
      <path
        className="cls-11"
        d="M1970.3,1403.1c-7.9-24.1,10.6-61.9-4-82-9.2-12.7-29-15.1-47.5-18.8a46.2,46.2,0,0,0-6.2,27.8l3.6,37.8a45.8,45.8,0,0,0,49.9,41.1h0a61.7,61.7,0,0,0,6.2-1A29.6,29.6,0,0,1,1970.3,1403.1Z"
      />
      <rect
        className="cls-12"
        height="79.49"
        rx="20.9"
        ry="20.9"
        transform="translate(869.9 -549.7) rotate(24.8)"
        width="41.7"
        x="1663.3"
        y="1662.4"
      />
      <rect
        className="cls-12"
        height="79.49"
        rx="20.9"
        ry="20.9"
        transform="translate(-505.2 923.2) rotate(-24)"
        width="41.7"
        x="1896.8"
        y="1609.4"
      />
      <rect
        className="cls-13"
        height="58.98"
        rx="29.5"
        ry="29.5"
        width="723"
        x="825"
        y="463.4"
      />
      <rect
        className="cls-13"
        height="316.55"
        rx="35.4"
        ry="35.4"
        width="70.7"
        x="1688.1"
        y="668.5"
      />
    </svg>
  );
};

export default CertificateIcon;
