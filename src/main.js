let scene, camera, renderer;

aspectRatio = window.innerWidth / window.innerHeight

function generateEarth(){
    //var material = new THREE.MeshBasicMaterial({color:0x0000ff,wireframe:true});
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshBasicMaterial({
        map: loader.load('../assets/1_earth_8k.jpg'),

      });
    
    geometry = new THREE.SphereGeometry(50, 512, 512); //size

    sphere = new THREE.Mesh (geometry, material);
    sphere.position.x = 0
    sphere.position.y = 0
    scene.add(sphere); 
    console.log('Esfera generada en x: '+ sphere.position.x+' y: '+sphere.position.y)
    
}

function init(){
    scene = new THREE.Scene();      //ESCENA
    camera = new THREE.PerspectiveCamera(  //CAMARA
        75, //angle of camera 
        window.innerWidth / window.innerHeight, //aspect ratio
        0.1,  //near plane distance
        1000, //far clipping distance
    );
    renderer = new THREE.WebGLRenderer({antialias:true});  //RENDER 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x404040);
    document.body.appendChild(renderer.domElement);
    var controls = new THREE.OrbitControls(camera, renderer.domElement);  //CONTROLES DE USUARIO

    camera.position.z = 60; // ALEJO LA CAMARA DEL CENTRO DE LA ESCENA

    //generateCubes(5);
    //generateSpheres(5)
    generateEarth();

}

function animate() {
    requestAnimationFrame(animate);
    scene.traverse(function (object){
        if (object.isMesh === true){
            object.rotation.x += 0;
            object.rotation.y += 0;
        }
    });
    renderer.render(scene, camera);
}

function generateCities(){
    //TODO
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    cube.updateProjectionMatrix();
}

window.addEventListener('resize', onWindowResize,false);

init();
animate();

