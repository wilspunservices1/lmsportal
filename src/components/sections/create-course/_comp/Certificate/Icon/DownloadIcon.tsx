import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const DownloadIcon: React.FC<Props> = ({
  fill = 'currentColor',
  width = '1em',
  height = '1em',
  className,
  ...props
}) => {
  return (
    <svg
      className={className}
      fill={fill}
      width={width}
      height={height}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M512 666.5L367.2 521.7l36.2-36.2 83 83V256h51.2v312.5l83-83 36.2 36.2L512 666.5zm-204.8 50.3V768h409.6v-51.2H307.2z"/>
    </svg>
  );
};

export default DownloadIcon;
