// RENDERIZADOR DE SKINS DE MINECRAFT

class MinecraftSkinAPIRenderer {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas con ID "${canvasId}" no encontrado`);
        }

        this.width = options.width || 300;
        this.height = options.height || 350;
        this.skinFile = options.skinFile || '';

        this.container = this.canvas.parentElement;
        this.imageElement = null;
    }

    async loadSkin(skinFile) {
        this.skinFile = skinFile;
        const skinPath = `assets/skins/${skinFile}`;

        try {
            this.canvas.style.display = 'none';

            if (!this.imageElement) {
                this.imageElement = document.createElement('img');
                this.imageElement.style.width = '100%';
                this.imageElement.style.height = '100%';
                this.imageElement.style.objectFit = 'contain';
                this.imageElement.style.imageRendering = 'pixelated';
                this.container.appendChild(this.imageElement);
            }

            this.imageElement.src = skinPath;
            this.imageElement.alt = 'Minecraft Skin';

        } catch (error) {
            // Error silencioso
        }
    }

    dispose() {
        if (this.imageElement) {
            this.imageElement.remove();
            this.imageElement = null;
        }
        if (this.canvas) {
            this.canvas.style.display = 'block';
        }
    }
}

class ImprovedMinecraftSkinRenderer {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas con ID "${canvasId}" no encontrado`);
        }

        this.width = options.width || 300;
        this.height = options.height || 350;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.playerGroup = null;
        this.controls = null;
        this.animationId = null;
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);

        this.camera = new THREE.PerspectiveCamera(
            45,
            this.width / this.height,
            0.1,
            1000
        );
        this.camera.position.set(0, 16, 50);
        this.camera.lookAt(0, 12, 0);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);

        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.canvas);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.target.set(0, 12, 0);
            this.controls.minDistance = 25;
            this.controls.maxDistance = 70;
        }
    }

    async loadSkin(skinFile) {
        let skinPath;
        if (skinFile.startsWith('data:')) {
            skinPath = skinFile;
        } else {
            skinPath = `assets/skins/${skinFile}`;
        }

        if (this.playerGroup) {
            this.scene.remove(this.playerGroup);
            this.playerGroup = null;
        }

        return new Promise((resolve, reject) => {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
                skinPath,
                (texture) => {
                    texture.magFilter = THREE.NearestFilter;
                    texture.minFilter = THREE.NearestFilter;
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;

                    this.createPlayerModel(texture);
                    this.animate();

                    resolve();
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );
        });
    }

    createPlayerModel(skinTexture) {
        this.playerGroup = new THREE.Group();
        const parts = this.createBodyParts(skinTexture);

        parts.forEach(part => {
            this.playerGroup.add(part);
        });

        this.scene.add(this.playerGroup);
    }

    createBodyParts(skinTexture) {
        const material = new THREE.MeshStandardMaterial({
            map: skinTexture,
            transparent: false
        });

        const parts = [];

        // Cabeza
        const head = this.createCubePart(8, 8, 8, material, [
            [0, 8, 8, 16],    // Right (+x) -> Skin Right
            [16, 8, 24, 16],  // Left (-x) -> Skin Left
            [8, 0, 16, 8],    // Top (+y) -> Skin Top
            [16, 0, 24, 8],   // Bottom (-y) -> Skin Bottom
            [8, 8, 16, 16],   // Front (+z) -> Skin Front
            [24, 8, 32, 16]   // Back (-z) -> Skin Back
        ]);
        head.position.y = 21.96;
        parts.push(head);

        // Cuerpo
        const body = this.createCubePart(8, 12, 4, material, [
            [16, 20, 20, 32],  // Right
            [28, 20, 32, 32],  // Left
            [20, 16, 28, 20],  // Top
            [28, 16, 36, 20],  // Bottom
            [20, 20, 28, 32],  // Front
            [32, 20, 40, 32]   // Back
        ]);
        body.position.y = 12;
        parts.push(body);

        // Brazo derecho
        const rightArm = this.createCubePart(4, 12, 4, material, [
            [40, 20, 44, 32],  // Right
            [48, 20, 52, 32],  // Left
            [44, 16, 48, 20],  // Top
            [48, 16, 52, 20],  // Bottom
            [44, 20, 48, 32],  // Front
            [52, 20, 56, 32]   // Back
        ]);
        rightArm.position.set(-6, 12, 0);
        parts.push(rightArm);

        // Brazo izquierdo
        const leftArm = this.createCubePart(4, 12, 4, material, [
            [32, 52, 36, 64],  // Right
            [40, 52, 44, 64],  // Left
            [36, 48, 40, 52],  // Top
            [40, 48, 44, 52],  // Bottom
            [36, 52, 40, 64],  // Front
            [44, 52, 48, 64]   // Back
        ]);
        leftArm.position.set(6, 12, 0);
        parts.push(leftArm);

        // Pierna derecha
        const rightLeg = this.createCubePart(4, 12, 4, material, [
            [0, 20, 4, 32],    // Right
            [8, 20, 12, 32],   // Left
            [4, 16, 8, 20],    // Top
            [8, 16, 12, 20],   // Bottom
            [4, 20, 8, 32],    // Front
            [12, 20, 16, 32]   // Back
        ]);
        rightLeg.position.set(-2, 0, 0);
        parts.push(rightLeg);

        // Pierna izquierda
        const leftLeg = this.createCubePart(4, 12, 4, material, [
            [16, 52, 20, 64],  // Right
            [24, 52, 28, 64],  // Left
            [20, 48, 24, 52],  // Top
            [24, 48, 28, 52],  // Bottom
            [20, 52, 24, 64],  // Front
            [28, 52, 32, 64]   // Back
        ]);
        leftLeg.position.set(2, 0, 0);
        parts.push(leftLeg);

        return parts;
    }

    createCubePart(width, height, depth, material, uvCoords) {
        const geometry = new THREE.BoxGeometry(width, height, depth);

        const uvAttribute = geometry.attributes.uv;

        for (let i = 0; i < 6; i++) {
            const [x1, y1, x2, y2] = uvCoords[i];
            const u1 = x1 / 64;
            const v1 = 1 - (y2 / 64);
            const u2 = x2 / 64;
            const v2 = 1 - (y1 / 64);

            const faceIndex = i * 4;
            uvAttribute.setXY(faceIndex, u1, v2);
            uvAttribute.setXY(faceIndex + 1, u2, v2);
            uvAttribute.setXY(faceIndex + 2, u1, v1);
            uvAttribute.setXY(faceIndex + 3, u2, v1);
        }

        uvAttribute.needsUpdate = true;

        return new THREE.Mesh(geometry, material);
    }

    animate() {
        if (!this.renderer || !this.scene || !this.camera) return;

        this.animationId = requestAnimationFrame(() => this.animate());

        if (this.controls) {
            this.controls.update();
        }

        if (this.playerGroup) {
            this.playerGroup.rotation.y += 0.003;
        }

        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(m => m.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }

        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

let currentRenderer = null;

function initMinecraftSkinRenderer(skinFile, canvasId = 'player-skin-canvas') {
    if (currentRenderer) {
        currentRenderer.dispose();
        currentRenderer = null;
    }

    try {
        if (typeof THREE !== 'undefined') {
            currentRenderer = new ImprovedMinecraftSkinRenderer(canvasId, {
                width: 300,
                height: 350
            });
            currentRenderer.loadSkin(skinFile);
        } else {
            currentRenderer = new MinecraftSkinAPIRenderer(canvasId, {
                width: 300,
                height: 350
            });
            currentRenderer.loadSkin(skinFile);
        }

        return currentRenderer;
    } catch (error) {
        return null;
    }
}

function disposeMinecraftSkinRenderer() {
    if (currentRenderer) {
        currentRenderer.dispose();
        currentRenderer = null;
    }
}
