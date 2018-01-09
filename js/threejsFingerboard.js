if (!Detector.webgl) Detector.addGetWebGLMessage();

let camera;
let controls;
let scene;
let renderer;

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, 5 / 3, 1, 2000); //5/3 ratio corresponds to the 0.6 width/height canvas container padding 
    scene.add(camera);
    camera.position.set(0, 0, 750);

    //RENDER
    renderer = createRenderer(0xDDDDDD);
    var parent = document.getElementById('canvasContainer');
    parent.appendChild(renderer.domElement);

    //MATERIALS
    //var backgroundMat = createBackgroundMaterial();
    //var fingerboardMat = createFingerBoardMaterial();

    //LIGHTS
    createLights();

    //CREATE BACKGROUND PLANE 
    //createBackgroundPlane(backgroundMat);

    //INVISIBLE CUBE
    //var invisibleCube = createInvisibleBox(622, 154, 64);
    //var cubeAll = createInvisibleBox(540, 150, 60, 0xFFFFFF, 0.1);
    var cube1 = createInvisibleBox(90, 150, 60, 0xFF00FF, 0.5); cube1.position.setX(-180);
    var cube2 = createInvisibleBox(90, 150, 60, 0x00FFFF, 0.5); cube2.position.setX(-90);
    var cube3 = createInvisibleBox(90, 150, 60, 0xFFFF00, 0.5); cube3.position.setX(0)
    var cube4 = createInvisibleBox(90, 150, 60, 0x0000FF, 0.5); cube4.position.setX(90);
    var cube5 = createInvisibleBox(90, 150, 60, 0x00FF00, 0.5); cube5.position.setX(180);

    //LOAD FINGERBOARD
    //loadObject('obj/fingerboard-obj.obj', fingerboardMat);

    //Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //LOADER
    //loadingScreen();
}

//FUNCTIONS

//Materials and Textures

function createInvisibleBox(width, height, depth, colorVal, opacityVal) {
    var geometry = new THREE.CubeGeometry(width, height, depth);
    var material = new THREE.MeshLambertMaterial({ color: colorVal, transparent: true, opacity: opacityVal });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 80, 31);
    //cube.visible = false; //hiding the Cube
    scene.add(cube);

    return cube;
}

//Function LIGHTS
function createLights() {
    var ambLight = new THREE.AmbientLight(0x404040); // soft white light
    ambLight.intensity = 2;
    scene.add(ambLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 100, 600);
    spotLight.rotation.set((45 * Math.PI / 180), 0, 0);
    spotLight.intensity = 0.7;
    scene.add(spotLight);

    var spotLight2 = new THREE.SpotLight(0xffffff);
    spotLight2.position.set(0, 100, -600);
    spotLight2.rotation.set((45 * Math.PI / 180), 0, 0);
    spotLight2.intensity = 0.7;
    scene.add(spotLight2);

    var hemLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.6);
    scene.add(hemLight);
}

function loadObject(objpath, material) {
    createFingerBoardMaterial();
    var loader = new THREE.OBJLoader();
    loader.load(objpath,
        function(object) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });
            object.rotation.set(0, 0, 0);
            object.position.set(0, -90, 0);
            scene.add(object);
            //console.log("fingerboard is ",  object);
        }
    );
}

function createGUI() {
    var gui = new dat.GUI();
    var cam = gui.addFolder('Camera');
    cam.add(camera.position, 'x', -100, 150);
    cam.add(camera.position, 'y', -100, 150);
    cam.add(camera.position, 'z', 0, 1500);
    var sportlightGui = gui.addFolder('spot light');
    sportlightGui.add(spotLight.position, 'x', -500, 500);
    sportlightGui.add(spotLight.position, 'y', 0, 2000);
    sportlightGui.add(spotLight.position, 'z', -500, 500);
    sportlightGui.add(spotLight.rotation, 'x', 0, 2 * Math.PI);
    sportlightGui.add(spotLight.rotation, 'y', 0, 2 * Math.PI);
    sportlightGui.add(spotLight.rotation, 'z', 0, 2 * Math.PI);
}

function loadingScreen() {
    var loaderDiv = document.getElementById("loader");
    THREE.DefaultLoadingManager.onStart = function() {
        loaderDiv.style.display = 'block';
    };
    THREE.DefaultLoadingManager.onLoad = function() {
        loaderDiv.style.display = 'none';
    };
}

//FUNCTION FOR CREATING RENDERER
function createRenderer(clearColour) {
    myRenderer = new THREE.WebGLRenderer({ antialias: true });
    myRenderer.shadowMap.enabled = true; //enabling shadow maps in the renderer
    myRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    myRenderer.setClearColor(clearColour, 1);
    myRenderer.setSize(window.innerWidth, window.innerHeight);

    return myRenderer;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}