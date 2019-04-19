import React from 'react';

const NavIcon = ({
  style = {},
  fill = 'rgb(170,56,30)',
  width = '100%',
  className = '',
  viewBox = '0 0 512 512',
}) => (
  <svg
    width={width}
    style={style}
    height={width}
    viewBox={viewBox}
    className={`svg-icon ${className || ''}`}
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
  >
    <path
      fill={fill}
      d='M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z'
    />
  </svg>
);

export default NavIcon;
