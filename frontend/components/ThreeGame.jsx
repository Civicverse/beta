import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './ThreeGame.css';

const ThreeGame = ({ onShopInteract }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const playerRef = useRef(null);
  const [interactPrompt, setInteractPrompt] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x00ff88, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Neon ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a3f,
      emissive: 0x0033ff,
      emissiveIntensity: 0.3,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Neon buildings
    const createBuilding = (x, z, width, height, color) => {
      const geometry = new THREE.BoxGeometry(width, height, width);
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.4,
      });
      const building = new THREE.Mesh(geometry, material);
      building.position.set(x, height / 2, z);
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);
    };

    createBuilding(-15, -20, 8, 15, 0xff00ff);
    createBuilding(15, -20, 8, 20, 0x00ffff);
    createBuilding(-25, 0, 10, 12, 0xff0088);
    createBuilding(25, 0, 10, 18, 0x00ff88);
    createBuilding(0, 15, 6, 10, 0xffff00);

    // Player capsule
    const playerGeometry = new THREE.CapsuleGeometry(0.5, 2, 4, 8);
    const playerMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0080,
      emissive: 0xff0080,
      emissiveIntensity: 0.5,
    });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 2;
    player.castShadow = true;
    player.receiveShadow = true;
    scene.add(player);
    playerRef.current = player;

    // Shop marker
    const shopGeometry = new THREE.ConeGeometry(1, 3, 32);
    const shopMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.8,
    });
    const shopMarker = new THREE.Mesh(shopGeometry, shopMaterial);
    shopMarker.position.set(0, 2, 0);
    shopMarker.castShadow = true;
    scene.add(shopMarker);

    // Keyboard controls
    const keys = {};
    window.addEventListener('keydown', (e) => {
      keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener('keyup', (e) => {
      keys[e.key.toLowerCase()] = false;
    });

    // Click to interact with shop
    window.addEventListener('click', () => {
      const distance = player.position.distanceTo(shopMarker.position);
      if (distance < 5) {
        setInteractPrompt(null);
        onShopInteract?.();
      }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Player movement
      const speed = 0.1;
      if (keys['w'] || keys['arrowup']) player.position.z -= speed;
      if (keys['s'] || keys['arrowdown']) player.position.z += speed;
      if (keys['a'] || keys['arrowleft']) player.position.x -= speed;
      if (keys['d'] || keys['arrowright']) player.position.x += speed;

      // Camera follow
      camera.position.x = player.position.x + 5;
      camera.position.z = player.position.z + 10;
      camera.lookAt(player.position);

      // Check proximity to shop
      const distance = player.position.distanceTo(shopMarker.position);
      if (distance < 5) {
        setInteractPrompt('Press CLICK to enter shop');
      } else {
        setInteractPrompt(null);
      }

      // Rotate shop marker
      shopMarker.rotation.y += 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [onShopInteract]);

  return (
    <div className="three-game-container" ref={containerRef}>
      {interactPrompt && <div className="interact-prompt">{interactPrompt}</div>}
    </div>
  );
};

export default ThreeGame;
