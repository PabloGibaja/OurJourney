let scene, camera, renderer;

aspectRatio = window.innerWidth / window.innerHeight

function generateEarth(){
    //var material = new THREE.MeshBasicMaterial({color:0x0000ff,wireframe:true});
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshBasicMaterial({
        map: loader.load('../assets/1_earth_8k.jpg'),
        //map: loader.load('../assets/earthmap1k.jpg'),
        

      });
    
    geometry = new THREE.SphereGeometry(1, 30, 30); //size

    sphere = new THREE.Mesh (geometry, material);
    sphere.position.x = 0
    sphere.position.y = 0
    scene.add(sphere); 
    console.log('Esfera generada en x: '+ sphere.position.x+' y: '+sphere.position.y+' z: '+sphere.position.z)
    
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

    camera.position.z = 2; // ALEJO LA CAMARA DEL CENTRO DE LA ESCENA

    //generateCubes(5);
    //generateSpheres(5)
    generateEarth();
    generateCities();

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
    let city = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.005,20,20),
        new THREE.MeshBasicMaterial({color:0xff0000})
    );

    material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
   
        //madrid example 
    lon =  40.5 * Math.PI/180;
    lat =  87 * Math.PI/180;

    let x = 1.21 * Math.cos(lon)*Math.sin(lat);
    let y = 1.21 * Math.sin(lon)*Math.sin(lat);
    let z = 1.21 * Math.cos(lat)

    const points = [];
    points.push( new THREE.Vector3( 0, 0, 0 ) );
    points.push( new THREE.Vector3( x, y, z ) );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( geometry, material );
    scene.add( line );
    
    city.position.set(x/1.21,y/1.21,z/1.21)
    scene.add(city)
    console.log('ciudad generada en'+x+','+y+','+z)
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

