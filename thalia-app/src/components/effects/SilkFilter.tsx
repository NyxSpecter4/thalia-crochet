import React from 'react';

/**
 * A high‑quality SVG filter that simulates the tactile texture of silk
 * using fractal noise, diffuse lighting, and Fresnel edge lighting.
 * Fresnel effect: brighter at edges to simulate silk catching rim light.
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
          
          {/* Fresnel Edge Lighting - Create edge detection for rim light */}
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="alphaMask"
          />
          <feGaussianBlur
            in="alphaMask"
            stdDeviation="4"
            result="blurredAlpha"
          />
          <feComposite
            in="blurredAlpha"
            in2="alphaMask"
            operator="out"
            result="edges"
          />
          <feColorMatrix
            in="edges"
            type="matrix"
            values="0 0 0 0 0.8
                    0 0 0 0 0.6
                    0 0 0 0 0.4
                    0 0 0 1 0"
            result="fresnelEdges"
          />
          
          {/* Combine Fresnel edges with lighting */}
          <feBlend in="lighting" in2="fresnelEdges" mode="screen" result="combinedLighting" />
          
          {/* Blend the combined lighting with the original graphic */}
          <feBlend in="SourceGraphic" in2="combinedLighting" mode="overlay" result="texturedGraphic" />
          
          {/* Soften the texture */}
          <feGaussianBlur stdDeviation="0.3" />
          
          {/* Increase contrast slightly */}
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.1" intercept="-0.05" />
            <feFuncG type="linear" slope="1.1" intercept="-0.05" />
            <feFuncB type="linear" slope="1.1" intercept="-0.05" />
          </feComponentTransfer>
          
          {/* Final saturation boost for vibrant silk appearance */}
          <feColorMatrix
            type="saturate"
            values="1.2"
          />
        </filter>
        
        {/* Additional filter for high-contrast Fresnel effect */}
        <filter id="fresnelSilk" x="-30%" y="-30%" width="160%" height="160%">
          {/* Create edge glow */}
          <feMorphology operator="dilate" radius="1" in="SourceAlpha" result="dilated" />
          <feGaussianBlur in="dilated" stdDeviation="3" result="glowBlur" />
          <feFlood floodColor="#fff8e1" floodOpacity="0.4" result="glowColor" />
          <feComposite in="glowColor" in2="glowBlur" operator="in" result="softGlow" />
          
          {/* Original silk texture */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03 0.4"
            numOctaves="2"
            seed="3"
            result="silkNoise"
          />
          <feColorMatrix
            in="silkNoise"
            type="matrix"
            values="1.3 0 0 0 0.1
                    0 1.2 0 0 0.05
                    0 0 1.1 0 0
                    0 0 0 0.5 0"
            result="warmSilk"
          />
          
          {/* Combine glow with silk texture */}
          <feBlend in="softGlow" in2="warmSilk" mode="screen" result="glowingSilk" />
          
          {/* Apply to source graphic with overlay */}
          <feBlend in="SourceGraphic" in2="glowingSilk" mode="overlay" />
        </filter>
      </defs>
    </svg>
  );
};

export default SilkFilter;