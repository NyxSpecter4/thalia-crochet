import React from 'react';

/**
 * A high‑quality SVG filter that simulates the tactile texture of silk
 * using fractal noise and diffuse lighting.
 */
const SilkFilter: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-0 h-0">
      <defs>
        <filter id="silkTexture" x="-20%" y="-20%" width="140%" height="140%">
          {/* Base fractal noise for organic grain */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.5"
            numOctaves="3"
            seed="5"
            result="noise"
          />
          {/* Color adjustment to warm ivory */}
          <feColorMatrix
            in="noise"
            type="matrix"
            values="1.2 0 0 0 0
                    0 1.1 0 0 0
                    0 0 1.0 0 0
                    0 0 0 0.4 0"
            result="coloredNoise"
          />
          {/* Diffuse lighting to create a subtle 3D weave effect */}
          <feDiffuseLighting
            in="coloredNoise"
            surfaceScale="2"
            lightingColor="#ffffff"
            result="lighting"
          >
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
          {/* Blend the lighting with the original graphic */}
          <feBlend in="SourceGraphic" in2="lighting" mode="overlay" />
          {/* Soften the texture */}
          <feGaussianBlur stdDeviation="0.3" />
          {/* Increase contrast slightly */}
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.1" intercept="-0.05" />
            <feFuncG type="linear" slope="1.1" intercept="-0.05" />
            <feFuncB type="linear" slope="1.1" intercept="-0.05" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
};

export default SilkFilter;