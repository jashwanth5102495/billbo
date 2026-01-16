"use client";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => {
  return (
    <div className={cn("h-full relative bg-white w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
              float animation_speed_factor = ${animationSpeed.toFixed(1)};
              float intro_offset = distance(u_resolution / 2.0 / u_total_size, st);
              float monocolor_pixel_val = smoothstep(intro_offset, intro_offset + 1.0, u_time * animation_speed_factor * 100.0);
              // Output to fragColor (GLSL 3.0)
              // We use a custom output variable 'opacity_multiplier' to affect the dots
              opacity_multiplier = monocolor_pixel_val;
            `}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent dark:from-black" />
      )}
    </div>
  );
};

const DotMatrix = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 4,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}: {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}) => {
  const uniforms = useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }

    return {
      u_colors: {
        value: colorsArray.map((c) => [
          c[0] / 255,
          c[1] / 255,
          c[2] / 255,
        ]),
      },
      u_opacities: {
        value: opacities,
      },
      u_total_size: {
        value: totalSize,
      },
      u_dot_size: {
        value: dotSize,
      },
      u_resolution: {
        value: new THREE.Vector2(),
      },
      u_time: {
        value: 0,
      },
      u_random: {
        value: Math.random(),
      }
    };
  }, [colors, opacities, totalSize, dotSize]);

  return (
    <Canvas
      className="h-full w-full"
      resize={{ scroll: false }}
      dpr={[1, 2]}
    >
      <ShaderMaterial
        source={`
          precision mediump float;
          uniform float u_time;
          uniform float u_opacities[10];
          uniform vec3 u_colors[6];
          uniform float u_total_size;
          uniform float u_dot_size;
          uniform vec2 u_resolution;
          uniform float u_random;

          out vec4 fragColor;

          float random(vec2 st) {
              return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }

          void main() {
              vec2 st = gl_FragCoord.xy / u_resolution;
              
              float opacity_multiplier = 1.0;
              
              ${shader}
              
              vec2 centered = st;
              if (${JSON.stringify(true)} && ${JSON.stringify(true)}) {
                centered = st * 2.0 - 1.0;
              }
              
              vec2 grid_st = fract(st * u_total_size);
              vec2 grid_pos = floor(st * u_total_size);
              
              float d = distance(grid_st, vec2(0.5));
              float radius = (u_dot_size / u_total_size) * 0.5;
              float circle = step(d, radius);
              if (circle < 0.5) {
                discard;
              }
              
              float rand = random(grid_pos + floor(u_time));
              float opacity_index = floor(rand * 10.0);
              float opacity = u_opacities[int(opacity_index)];
              
              opacity *= opacity_multiplier;
              
              float color_index = floor(random(grid_pos) * 6.0);
              vec3 color = u_colors[int(color_index)];
              
              fragColor = vec4(color, opacity);
          }
        `}
        uniforms={uniforms}
        maxFps={60}
      />
    </Canvas>
  );
};

type Uniforms = {
  [key: string]: {
    value: number | number[] | THREE.Vector2 | THREE.Vector3 | number[][];
  };
};

const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    if (timestamp - lastFrameTime < 1 / maxFps) {
      return;
    }
    lastFrameTime = timestamp;

    const material = ref.current.material as THREE.ShaderMaterial;
    if (material.uniforms.u_time) {
      material.uniforms.u_time.value = timestamp;
    }
    if (material.uniforms.u_resolution) {
      material.uniforms.u_resolution.value = new THREE.Vector2(
        size.width * 2,
        size.height * 2
      );
    }
  });

  const getUniforms = () => {
    const preparedUniforms: any = {};

    for (const uniformName in uniforms) {
      const uniform: any = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = { value: new THREE.Vector3().fromArray(uniform.value), type: "3f" };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map((v: number[]) =>
              new THREE.Vector3().fromArray(v)
            ),
            type: "3fv",
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = { value: new THREE.Vector2().fromArray(uniform.value), type: "2f" };
          break;
        default:
          preparedUniforms[uniformName] = { value: uniform.value };
      }
    }

    return preparedUniforms;
  };

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        precision mediump float;
        in vec3 position;
        out vec2 fragCoord;

        void main() {
          gl_Position = vec4(position, 1.0);
          fragCoord = (position.xy + 1.0) * 0.5 * vec2(1.0, 1.0); 
          fragCoord = fragCoord * 2.0; 
        }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};
