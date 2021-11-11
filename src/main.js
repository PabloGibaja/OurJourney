let scene, camera, renderer;
radiusEarth=1

let cities_json = loadJSON('./src/files/cities.json');
let people_json =  loadJSON('./src/files/people.json');
let travels_json = loadJSON('./src/files/travels.json');
console.log(cities_json)

// Load JSON text from server hosted file and return JSON parsed object
function loadJSON(filePath) {
    // Load json file;
    var json = loadTextFileAjaxSync(filePath, "application/json");
    // Parse json
    return JSON.parse(json);
}   
  
  // Load text with Ajax synchronously: takes path to file and optional MIME type
function loadTextFileAjaxSync(filePath, mimeType)
  {
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",filePath,false);
    if (mimeType != null) {
      if (xmlhttp.overrideMimeType) {
        xmlhttp.overrideMimeType(mimeType);
      }
    }
    xmlhttp.send();
    if (xmlhttp.status==200 && xmlhttp.readyState == 4 )
    {
      return xmlhttp.responseText;
    }
    else {
      // TODO Throw exception
      return null;
    }
}

function init(){
    /* SCENE */
    scene = new THREE.Scene();  
    
    /* CAMERA */
    camera = new THREE.PerspectiveCamera(  
        90, //angle of camera 
        window.innerWidth / window.innerHeight, //aspect ratio
        0.1,  //near plane distance
        1000, //far clipping distance
    );
    camera.position.x = 1.1; // over europe
    camera.position.y = 1.1;
    camera.lookAt(0,0,0) // look at origin

    /* LIGHT */
    const light = new THREE.AmbientLight( 0xfffff0 ); // soft white light
    scene.add( light );

    /* RENDER */ 
    renderer = new THREE.WebGLRenderer({antialias:true});   
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x404040);
    document.body.appendChild(renderer.domElement);

    /* CONTROLS */ 
    var controls = new THREE.OrbitControls(camera, renderer.domElement);  
    
    /* AXES */ 
    const axesHelper = new THREE.AxesHelper( 5 );
    axesHelper.setColors ( 0xff0000, 0x00ff00, 0x0000ff )
    scene.add( axesHelper );

     /* MAIN FLOW */ 
     generateEarth();
     generateCitiesFromFile("./src/files/cities.json")
     generateTravelsFromFile("./src/files/travels.json")

}

/*TODO rotate everything when user is not in control*/
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

/* Generate Earth globe in origin*/
function generateEarth(){
    //var material = new THREE.MeshBasicMaterial({color:0x0000ff,wireframe:true});
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshPhongMaterial({
        map: loader.load('./assets/1_earth_8k.jpg'),
      });    
    geometry = new THREE.SphereGeometry(radiusEarth, 128, 128); //size
    sphere = new THREE.Mesh (geometry, material);
    sphere.position.x = 0
    sphere.position.y = 0
    scene.add(sphere); 
    console.log('Earth globe generated at x: '+ sphere.position.x+' y: '+sphere.position.y+' z: '+sphere.position.z)
    
}

/* Receives point1 and point2 in latitude,longitude format, and the arc of the curve*/ 
function generateTravel(p1,p2,arc){
    from = getCoordinatesFromLatLng(p1.lat,p1.lng,radiusEarth)
    to = getCoordinatesFromLatLng(p2.lat,p2.lng,radiusEarth)
    v1 = new THREE.Vector3(from.x,from.y,from.z)
    v2 = new THREE.Vector3(to.x,to.y,to.z)
    points = []
    for (let i=0; i<=20 ; i++){
        let p = new THREE.Vector3().lerpVectors(v1,v2,i/20)
        p.normalize()
        p.multiplyScalar(1 + arc*Math.sin(Math.PI*i/20))
        points.push(p)
    }
    let path = new THREE.CatmullRomCurve3(points)
    const geometry = new THREE.TubeGeometry( path, 20, 0.001, 8, false );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh ); 
}

/* Receives lat, long of city and generate the city in the globe */
function generateCity(lat,long,radiusEarth){
    let city = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.003,20,20),
        new THREE.MeshBasicMaterial({color:0xff0000})
    );
    pos = getCoordinatesFromLatLng(lat,long,radiusEarth) 
    city.position.set(pos.x,pos.y,pos.z)
    scene.add(city)
    console.log('x: '+ city.position.x+' y: '+city.position.y+' z: '+city.position.z)
}

/* Converts lat, long coordinates to spherical coordinates */
function getCoordinatesFromLatLng(latitude, longitude, radiusEarth)
{
   let latitude_rad = latitude * Math.PI / 180;
   let longitude_rad = -(longitude * Math.PI / 180);

   let xPos= radiusEarth * Math.cos(latitude_rad) * Math.cos(longitude_rad);
   let zPos = radiusEarth * Math.cos(latitude_rad) * Math.sin(longitude_rad);
   let yPos = radiusEarth * Math.sin(latitude_rad);
   
   return {x: xPos, y: yPos, z: zPos};
}
    
/* Receives a json file with the cities to generate*/
function generateCitiesFromFile (path){
   cities_array = cities_json.cities
   for (var i=0; i<cities_array.length; i++){
       console.log(cities_array[i].name+" generated at :")
       generateCity(cities_array[i].lat,cities_array[i].lng,radiusEarth)
   }
}

/* Receives a json file with the travels to generate*/
function generateTravelsFromFile(path){
    travels_array = travels_json.travels
    for (var i=0; i<travels_array.length; i++){
        console.log("Travel generated for "+travels_array[i].person_name)
        generateTravel(travels_array[i].from,travels_array[i].to,travels_array[i].arc)
    } 
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize,false);
init();
animate();

