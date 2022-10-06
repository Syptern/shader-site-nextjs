import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import fragmentShader from "../shaders/fragmentShader";
import * as THREE from "three";

function Plane(props) {
  const matRef = useRef();
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  const { size, camera } = useThree();

  const uniforms = useMemo(() => {
    return {
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector2(size.width, size.height),
      },
      iMouse: { value: new THREE.Vector2() },
      iScroll: { value: 0 },
    };
  }, []);

  let scroll = useScrollPosition();

  useEffect(() => {
    // 👇️ get global mouse coordinates
    const handleWindowMouseMove = (event) => {
      matRef.current.uniforms.iMouse.value = new THREE.Vector2(
        event.screenX * 2,
        size.height * 2 - event.screenY * 2
      );
    };
    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      matRef.current.uniforms.iScroll.value = window.pageYOffset;
    };
    window.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  useFrame(({ clock }) => {
    matRef.current.uniforms.iTime.value =
      matRef.current.uniforms.iTime.value + 0.01;
  });

  return (
    <mesh {...props} ref={ref}>
      <planeGeometry
        args={[
          ((camera.position.z * camera.getFilmHeight()) /
            camera.getFocalLength()) *
            camera.aspect,

          camera.position.z * Math.tan((camera.fov * Math.PI) / 180 / 2) * 2,
        ]}
      />
      <shaderMaterial
        ref={matRef}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function Home() {
  return (
    <>
      <div className="flex items-center h-[100vh]">
        <div id="canvas">
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Plane />
          </Canvas>
        </div>
        <h1 className="mx-64 text-gray-200 opacity-80">
          Noise shaders,
          <br /> Scroll down!
        </h1>
      </div>
      <div className="flex items-center h-[100vh]">
        <h1 className="mx-64 text-gray-200 opacity-80">So beautiful.</h1>
      </div>
      <div className="flex items-center h-[100vh]">
        <h1 className="mx-64 text-gray-200 opacity-80">Blablabla.</h1>
      </div>
    </>
  );
}

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };
    window.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
};
