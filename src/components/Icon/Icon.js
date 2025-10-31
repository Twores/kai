import React from 'react';
import './Icon.css';

const ICONS = {
  'logi-enerance': '/LogiEnerance.svg',
  'circle-plus': '/circle-plus.svg',
  'circle-x': '/circle-x.svg',
  'reply': '/reply.svg',
  'reply-all': '/reply-all.svg',
  'truck': '/truck.svg',
  'settings': '/settings.svg',
  'autovisit': '/autovisit.svg',
  'search': '/search.svg',
};

const Icon = ({ name, width, height, className = '', alt = '' }) => {
  const src = ICONS[name];
  if (!src) return null;
  return (
    <img
      src={ process.env.PUBLIC_URL + src}
      width={width}
      height={height}
      alt={alt || name}
      className={`icon ${className}`.trim()}
      draggable={false}
    />
  );
};

export default Icon;


