import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface AsciiSceneConfig {
  modelUrl: string;
  charset?: string;
  resolution?: number;
  color?: string;
  autoRotate?: boolean;
  animationSpeed?: number;
}

export interface AsciiSceneInstance {
  mount: (container: HTMLDivElement) => void;
  unmount: () => void;
  resize: (width: number, height: number) => void;
  pause: () => void;
  resume: () => void;
}

const MODEL_BASE_URL = 'https://threejs.org/examples/models/gltf/';

export function createAsciiScene(config: AsciiSceneConfig): AsciiSceneInstance {
  const {
    modelUrl,
    charset = ' .:-+*=%@#',
    resolution = 0.15,
    color = '#00ffff',
    autoRotate = true,
    animationSpeed = 1,
  } = config;

  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let effect: AsciiEffect;
  let mixer: THREE.AnimationMixer | null = null;
  let clock: THREE.Clock;
  let animationId: number | null = null;
  let paused = false;
  let mounted = false;
  let currentContainer: HTMLDivElement | null = null;
  let model: THREE.Object3D | null = null;

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 3;

    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(1);

    effect = new AsciiEffect(renderer, charset, {
      invert: true,
      resolution: resolution,
    });

    effect.domElement.style.color = color;
    effect.domElement.style.backgroundColor = '#000000';
    effect.domElement.style.overflow = 'hidden';

    // Lighting
    const light1 = new THREE.PointLight(0xffffff, 3);
    light1.position.set(500, 500, 500);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 1);
    light2.position.set(-500, -500, -500);
    scene.add(light2);

    const ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    clock = new THREE.Clock();

    loadModel();
  }

  function loadModel() {
    const fullUrl = MODEL_BASE_URL + modelUrl;
    const loader = new GLTFLoader();

    loader.load(
      fullUrl,
      (gltf) => {
        model = gltf.scene;

        // Override materials for maximum ASCII contrast
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = new THREE.MeshPhongMaterial({
              color: 0xffffff,
              flatShading: false,
            });
          }
        });

        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        scene.add(model);

        // Setup animations if available
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        // Fade in
        if (currentContainer) {
          currentContainer.style.opacity = '1';
        }
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );
  }

  let lastRenderTime = 0;
  const FRAME_INTERVAL = 1000 / 30; // 30fps cap

  function animate(time: number) {
    if (paused || !mounted) return;
    animationId = requestAnimationFrame(animate);

    // Throttle to ~30fps
    if (time - lastRenderTime < FRAME_INTERVAL) return;
    lastRenderTime = time;

    const delta = clock.getDelta();

    if (mixer) {
      mixer.update(delta * animationSpeed);
    }

    if (autoRotate && model) {
      model.rotation.y += 0.005;
    }

    effect.render(scene, camera);
  }

  function startAnimation() {
    if (animationId !== null) return;
    paused = false;
    animationId = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  init();

  return {
    mount(container: HTMLDivElement) {
      currentContainer = container;
      container.appendChild(effect.domElement);
      mounted = true;

      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        effect.setSize(w, h);
      }

      startAnimation();
    },

    unmount() {
      mounted = false;
      stopAnimation();
      if (currentContainer && effect.domElement.parentNode === currentContainer) {
        currentContainer.removeChild(effect.domElement);
      }
      renderer.dispose();
      currentContainer = null;
    },

    resize(width: number, height: number) {
      if (width <= 0 || height <= 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      effect.setSize(width, height);
    },

    pause() {
      paused = true;
      stopAnimation();
    },

    resume() {
      if (!paused) return;
      paused = false;
      lastRenderTime = 0;
      startAnimation();
    },
  };
}
