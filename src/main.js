let scene, camera, renderer;
radiusEarth=1
var focusedItem
var originalColor
var travelColor = 0x00ff00
var cityColor = 0xffffff
var focusedColor = 0xff0000
var rotation = 0.0002
var clicked = new Object
clicked.value = 0 

//drawRange = 1

let cities_json = loadJSON('./src/files/cities.json');
let people_json =  loadJSON('./src/files/people.json');
//let travels_json = loadJSON('./src/files/travels.json');
let travels_json = loadJSON('./src/files/travelsCollection.json');

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
    camera.position.x = 1.25; // over europe
    camera.position.y = 0.8;
    camera.lookAt(0,0,0) // look at origin

    /* LIGHT */
    const light = new THREE.AmbientLight( 0xfffff0 ); // soft white light
    scene.add( light );

    /* RENDER */ 
    renderer = new THREE.WebGLRenderer({antialias:true});   
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x303030);
    document.body.appendChild(renderer.domElement);

    /* CONTROLS */ 
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 1.8;
    
    /* AXES */ 
    const axesHelper = new THREE.AxesHelper( 5 );
    axesHelper.setColors ( 0xff0000, 0x00ff00, 0x0000ff )
    scene.add( axesHelper );

    /* RAYCASTER */
    raycaster = new THREE.Raycaster();
	  mouse = new THREE.Vector2(1,1);

     /* MAIN FLOW */ 
     generateEarth();
     generateCitiesFromFile()
     generateTravelsFromFile()
}

/* Restore default colors for meshes not on focus*/
function restoreColors(){
  for (let i =0 ; i<scene.children.length;i++){
    if(scene.children[i].type === "city"){
      scene.children[i].material.color.set(cityColor)
    }
    if(scene.children[i].type === "travel"){
      scene.children[i].material.color.set(travelColor)
    }
  }
}

/*TODO rotate everything when user is not in control*/
function animate() {
    requestAnimationFrame(animate);
    scene.rotation.x += 0.000;
    scene.rotation.y += rotation;
    //drawRange+=1
    //mesh.geometry.setDrawRange( drawRange-20, drawRange );
    render();
}

function render() 
{
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
    sphere.name = "earth"
    scene.add(sphere); 
    console.log('Earth globe generated at x: '+ sphere.position.x+' y: '+sphere.position.y+' z: '+sphere.position.z)
    
}



// to use the new travelsCollection model
function generateJump(jumpFromFile){
  fromCoordinates = getCoordinatesFromCityName(jumpFromFile.from) 
  toCoordinates =  getCoordinatesFromCityName(jumpFromFile.to)
  from = getCoordinatesFromLatLng(fromCoordinates.lat,fromCoordinates.long,radiusEarth)
  to = getCoordinatesFromLatLng(toCoordinates.lat,toCoordinates.long,radiusEarth)
  v1 = new THREE.Vector3(from.x,from.y,from.z)
  v2 = new THREE.Vector3(to.x,to.y,to.z)
  arc = jumpFromFile.arc
  points = []
    for (let i=0; i<=20 ; i++){
        let p = new THREE.Vector3().lerpVectors(v1,v2,i/20)
        p.normalize()
        p.multiplyScalar(1 + arc*Math.sin(Math.PI*i/20))
        points.push(p)
    }
    console.log(points)
    let path = new THREE.CatmullRomCurve3(points) //all points that form the arc curve
    geometry = new THREE.TubeGeometry( path, 20, 0.001, 8, false );
    //geometry.setDrawRange(drawRange,drawRange+10)
    material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    jump = new THREE.Mesh( geometry, material );
    jump.type = jumpFromFile.type //flight | car ...
    scene.add(jump)

}

/* Receives point1 and point2 in latitude,longitude format, and the arc of the curve*/ 
function generateTravel(travelFromFile){
    p1 = travelFromFile.from //origin 
    p2 = travelFromFile.to //destination
    arc = travelFromFile.arc
    travelType = travelFromFile.type  //flight | car | ship | train
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
    let path = new THREE.CatmullRomCurve3(points) //all points that form the arc curve
    geometry = new THREE.TubeGeometry( path, 20, 0.001, 8, false );
    //geometry.setDrawRange(drawRange,drawRange+10)
    material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    travel = new THREE.Mesh( geometry, material );
    travel.name = travelType+": "+p1.city+"-"+p2.city
    travel.type = "travel"
    scene.add( travel ); 
}

/* Receives lat, long of city and generate the city in the globe */
function generateCity(cityFromFile){
    lat = cityFromFile.lat
    long = cityFromFile.lng
    size = cityFromFile.size
    let city = new THREE.Mesh(
        new THREE.SphereBufferGeometry(size*0.002,20,20),
        new THREE.MeshBasicMaterial({color:0xffffff})
    );
    pos = getCoordinatesFromLatLng(lat,long,radiusEarth) 
    city.position.set(pos.x,pos.y,pos.z)
    city.name = cityFromFile.name
    city.country = cityFromFile.country
    city.continent = cityFromFile.continent
    city.type = "city"
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
    
function generateCitiesFromFile (){
   cities_array = cities_json.cities
   for (var i=0; i<cities_array.length; i++){
       console.log(cities_array[i].name+" generated at :")
       generateCity(cities_array[i])
   }
}

function generateTravelsFromFile(){
   /* travels_array = travels_json.travels
    for (var i=0; i<travels_array.length; i++){
        console.log("Travels generated for : "+travels_array[i].person_name)
        generateTravel(travels_array[i])
    } */
    for (let i=0; i<travels_json.travels.length;i++){
      console.log("Travel found: "+travels_json.travels[i].travel_name)
      for(let j=0;travels_json.travels[i].jumps.length;j++){
        console.log("Jump found: "+travels_json.travels[i].jumps[j].from+"<->"+travels_json.travels[i].jumps[j].to)
        generateJump(travels_json.travels[i].jumps[j])
      }
    }
}

function getCoordinatesFromCityName(name){
  for (let i=0; i<cities_json.cities.length;i++){
    if (cities_json.cities[i].name === name){
      return {lat: cities_json.cities[i].lat , long: cities_json.cities[i].lng}
    }
  }
    console.log("City not found in cities list: "+name)
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event)
{
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );

  for(let i = 0; i<intersects.length ; i++){
    if (clicked.value!=1 && (intersects[i].object.type === "travel" || intersects[i].object.type === "city")){  //if focus is on travel
      intersects[i].object.material.color.set( focusedColor );
      break
    }
    else{
      if (clicked.value===0 ){
        restoreColors()
      }
      
    }
  }
}

//TODO sacar el nombre del mesh al clickar 
function onDocumentMouseDown(event)
{
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );
  for(let i = 0; i<intersects.length ; i++){
    if (intersects[i].object.type === "travel" || intersects[i].object.type === "city"){ 
      clicked.value=1
      clicked.x=mouse.x
      clicked.y=mouse.y
      intersects[i].object.material.color.set( focusedColor );
      rotation = 0
      break
    }
    else{
      clicked.value=0
      clicked.x=mouse.x
      clicked.y=mouse.y
      rotation = 0.0002
      restoreColors()
    }
  }
  
}

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('resize', onWindowResize,false);
init();
animate();

