import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MAX_COLORS = 8;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uCanvas;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform float uRotation;
uniform float uSpeed;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;

varying vec2 vUv;

float hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p.x * p.y) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 getColor(float t) {
  if (uColorCount == 0) {
    return vec3(0.0);
  }
  float idx = clamp(t, 0.0, 0.999) * float(uColorCount - 1);
  int i = int(floor(idx));
  int j = min(i + 1, uColorCount - 1);
  float f = fract(idx);
  vec3 c1 = uColors[i];
  vec3 c2 = uColors[j];
  return mix(c1, c2, f);
}

void main() {
  vec2 aspect = vec2(uCanvas.x / uCanvas.y, 1.0);
  vec2 uv = (vUv - 0.5) * aspect;
  float angle = radians(uRotation);
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  uv = rot * uv * uScale;

  vec2 mouseOffset = (uMouse - 0.5) * 2.0;
  uv += mouseOffset * uParallax * uMouseInfluence;

  float t = uTime * uSpeed;
  float n = noise(uv * uFrequency + t);
  float w = noise(uv * uFrequency * 1.7 - t * 0.7);
  float v = mix(n, w, uWarpStrength);
  v = 0.5 + 0.5 * v;

  float grain = noise(uv * 40.0 + t * 2.0) * uNoise;
  v = clamp(v + grain, 0.0, 1.0);

  vec3 color = getColor(v);
  gl_FragColor = vec4(color, 1.0);
}
`;

export default function ColorBends({
  className,
  style,
  rotation = 45,
  speed = 0.2,
  colors,
  transparent = true,
  scale = 1,
  frequency = 1,
  warpStrength = 1,
  mouseInfluence = 1,
  parallax = 0.5,
  noise = 0.08
}) {
  const containerRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: transparent });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uTime: { value: 0 },
      uCanvas: { value: new THREE.Vector2(1, 1) },
      uColors: {
        value: new Array(MAX_COLORS).fill(null).map(() => new THREE.Color(0x000000))
      },
      uColorCount: { value: 0 },
      uRotation: { value: rotation },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uFrequency: { value: frequency },
      uWarpStrength: { value: warpStrength },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseInfluence: { value: mouseInfluence },
      uParallax: { value: parallax },
      uNoise: { value: noise }
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight);
      uniforms.uCanvas.value.set(clientWidth, clientHeight);
    };

    resize();
    window.addEventListener('resize', resize);

    const handlePointerMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      uniforms.uMouse.value.set(x, 1 - y);
    };

    window.addEventListener('pointermove', handlePointerMove);

    const colorList =
      Array.isArray(colors) && colors.length > 0
        ? colors
        : ['#ff5c7a', '#8a5cff', '#00ffd1'];
    const limited = colorList.slice(0, MAX_COLORS);
    limited.forEach((hex, index) => {
      uniforms.uColors.value[index].set(hex);
    });
    uniforms.uColorCount.value = limited.length;

    const start = performance.now();
    const animate = (now) => {
      const elapsed = (now - start) / 1000;
      uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    colors,
    rotation,
    speed,
    scale,
    frequency,
    warpStrength,
    mouseInfluence,
    parallax,
    noise,
    transparent
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
    />
  );
}
