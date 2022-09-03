import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class PThreeTemplate {
  sw = window.innerWidth;
  sh = window.innerHeight;
  param = {
    camera: {
      fovy: 60,
      aspect: this.sw / this.sh,
      near: 0.1,
      far: 50.0,
      x: 0.0,
      y: 2.0,
      z: 10.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    },
    render: {
      clearColor: 0xffffff,
      width: this.sw,
      height: this.sh,
    },
    lightDirectional: {
      color: 0xffffff,
      intensity: 1.0,
      x: 1.0,
      y: 1.0,
      z: 1.0,
    },
    lightAmbient: {
      color: 0xffffff,
      intensity: 0.2,
    },
  };

  mouse = {
    x: 0,
    y: 0,
    mapX: 0,
    mapY: 0,
  };

  gltf = null;
  actions = [];
  mixer = null;

  constructor({ wrapper, isFitScreen = false }) {
    this.wrapper = document.querySelector(wrapper);
    this.isFitScreen = isFitScreen;
    if (this.setParam) this.setParam();
    this.onInit();
  }

  onInit() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(
      new THREE.Color(this.param.render.clearColor),
      0.0
    );
    this.renderer.setSize(this.param.render.width, this.param.render.height);
    this.wrapper.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new LCamera({
      param: this.param.camera,
      isFitScreen: this.isFitScreen,
    }).get();
    this.directionalLight = new LLight({
      kind: "directional",
      param: this.param.lightDirectional,
    });
    this.ambientLight = new LLight({
      kind: "ambient",
      param: this.param.lightAmbient,
    });

    this.scene.add(this.directionalLight.get());
    this.scene.add(this.ambientLight.get());

    this.clock = new THREE.Clock();

    if (this.init) this.init();

    // event
    window.addEventListener("resize", this.onParentResize.bind(this), false);
    window.addEventListener(
      "mousemove",
      this.onParentMousemove.bind(this),
      false
    );

    this.parentRender();
  }

  onParentResize() {
    this.sw = window.innerWidth;
    this.sh = window.innerHeight;
    this.renderer.setSize(this.sw, this.sh);
    this.camera.aspect = this.sw / this.sh;
    this.camera.updateProjectionMatrix();
  }

  parentRender() {
    requestAnimationFrame(() => this.parentRender());
    if (this.controls) this.controls.update();

    this.delta = this.clock.getDelta();
    if (this.mixer && this.delta) this.mixer.update(this.delta);

    if (this.render) this.render();

    this.renderer.render(this.scene, this.camera);
  }

  onParentMousemove(e) {
    const x = e.clientX;
    const y = e.clientY;
    this.mouse.x = x - this.sw / 2;
    this.mouse.y = -y + this.sh / 2;
    this.mouse.mapX = this.mouse.x / (this.sw / 2);
    this.mouse.mapY = this.mouse.y / (this.sh / 2);
    if (this.onMousemove) {
      this.onMousemove(this.mouse);
      // console.log(this.mouse);
    }
  }

  addControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
  addHelper(length = 5) {
    this.axesHelper = new THREE.AxesHelper(length);
    this.scene.add(this.axesHelper);
  }
  loadGltf({ path, aniWeight = [] }) {
    return new Promise((resolve) => {
      new GLTFLoader().load(path, (gltf) => {
        this.gltf = gltf;
        this.scene.add(this.gltf.scene);
        if (aniWeight.length) {
          const { scene, animations } = this.gltf;
          this.mixer = new THREE.AnimationMixer(scene);
          this.actions = [];
          animations.forEach((item) => {
            const action = this.mixer.clipAction(item);
            action.setLoop(THREE.LoopRepeat);
            action.play();
            action.weight = 0.0;
            this.actions.push(action);
          });
          aniWeight.forEach((item, i) => {
            this.actions[i].weight = item;
          });
        }
        resolve();
      });
    });
  }
}

class LCamera {
  constructor({ param, isFitScreen = false }) {
    this.param = param;
    if (isFitScreen) {
      this.fitScreen();
    }
    this.init();
  }
  init() {
    const { fovy, aspect, near, far, x, y, z, lookAt } = this.param;
    console.log(fovy, aspect, near, far, x, y, z, lookAt);
    this.camera = new THREE.PerspectiveCamera(fovy, aspect, near, far);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(lookAt);
  }
  fitScreen() {
    console.log("fitScreen");
    this.param.fovy = 60;
    const fovyRad = (this.param.fovy / 2) * (Math.PI / 180);
    const dist = window.innerHeight / 2 / Math.tan(fovyRad);
    this.param.z = dist;
    this.param.far = dist * 2;
  }
  get() {
    return this.camera;
  }
}

class LLight {
  constructor({ kind, param }) {
    this.kind = kind;
    this.param = param;
    this.init();
  }
  init() {
    if (this.kind === "directional") {
      this.initDirectional();
    } else if (this.kind === "ambient") {
      this.initAmbient();
    }
  }
  initDirectional() {
    const { color, intensity, x, y, z } = this.param;
    this.light = new THREE.DirectionalLight(color, intensity);
    this.light.position.set(x, y, z);
  }
  initAmbient() {
    const { color, intensity } = this.param;
    this.light = new THREE.AmbientLight(color, intensity);
  }
  get() {
    return this.light;
  }
}
