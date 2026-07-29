import fs from 'fs';
import path from 'path';

const iconDir = path.resolve('public/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Generate base SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181c24"/>
      <stop offset="100%" stop-color="#0f1117"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bg)"/>
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="#2b313d" stroke-width="16"/>
  <g transform="translate(106, 106) scale(6.25)" fill="none" stroke="url(#accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(iconDir, 'icon.svg'), svgContent);
console.log('SVG icon generated successfully in public/icons/icon.svg');
