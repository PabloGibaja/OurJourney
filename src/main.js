let scene, camera, renderer;
let earth, pointLight,cloudMesh
angle=0
radiusEarth=1
var focusedItem
var originalColor
var travelColor = 0x00ff00
var cityColor = 0xffffff
var focusedColor = 0xff0000
var rotation = 0.0005
var clicked = new Object
clicked.value = 0 
drawCount = 0;
maxDrawCount = 1000 //almacena el maximo valor al que puede llegar un drawCount de tipo travel 
var control
let firstLoad=true
let colorsArray = [
  "63b598", "ce7d78", "ea9e70", "a48a9e", "c6e1e8", "648177", "0d5ac1",
  "f205e6", "1c0365", "14a9ad", "4ca2f9", "a4e43f", "d298e2", "6119d0",
  "d2737d", "c0a43c", "f2510e", "651be6", "79806e", "61da5e", "cd2f00",
  "9348af", "01ac53", "c5a4fb", "996635", "b11573", "4bb473", "75d89e",
  "2f3f94", "2f7b99", "da967d", "34891f", "b0d87b", "ca4751", "7e50a8",
  "c4d647", "e0eeb8", "11dec1", "289812", "566ca0", "ffdbe1", "2f1179",
  "935b6d", "916988", "513d98", "aead3a", "9e6d71", "4b5bdc", "0cd36d",
  "250662", "cb5bea", "228916", "ac3e1b", "df514a", "539397", "880977",
  "f697c1", "ba96ce", "679c9d", "c6c42c", "5d2c52", "48b41b", "e1cf3b",
  "5be4f0", "57c4d8", "a4d17a", "225b8", "be608b", "96b00c", "088baf",
  "f158bf", "e145ba", "ee91e3", "05d371", "5426e0", "4834d0", "802234",
  "6749e8", "0971f0", "8fb413", "b2b4f0", "c3c89d", "c9a941", "41d158",
  "fb21a3", "51aed9", "5bb32d", "807fb", "21538e", "89d534", "d36647",
  "7fb411", "0023b8", "3b8c2a", "986b53", "f50422", "983f7a", "ea24a3",
  "79352c", "521250", "c79ed2", "d6dd92", "e33e52", "b2be57", "fa06ec",
  "1bb699", "6b2e5f", "64820f", "1c271", "21538e", "89d534", "d36647",
  "7fb411", "0023b8", "3b8c2a", "986b53", "f50422", "983f7a", "ea24a3",
  "79352c", "521250", "c79ed2", "d6dd92", "e33e52", "b2be57", "fa06ec",
  "1bb699", "6b2e5f", "64820f", "1c271", "9cb64a", "996c48", "9ab9b7",
  "06e052", "e3a481", "0eb621", "fc458e", "b2db15", "aa226d", "792ed8",
  "73872a", "520d3a", "cefcb8", "a5b3d9", "7d1d85", "c4fd57", "f1ae16",
  "8fe22a", "ef6e3c", "243eeb", "1dc18", "dd93fd", "3f8473", "e7dbce",
  "421f79", "7a3d93", "635f6d", "93f2d7", "9b5c2a", "15b9ee", "0f5997",
  "409188", "911e20", "1350ce", "10e5b1", "fff4d7", "cb2582", "ce00be",
  "32d5d6", "17232", "608572", "c79bc2", "00f87c", "77772a", "6995ba",
  "fc6b57", "f07815", "8fd883", "060e27", "96e591", "21d52e", "d00043",
  "b47162", "1ec227", "4f0f6f", "1d1d58", "947002", "bde052", "e08c56",
  "28fcfd", "bb09b", "36486a", "d02e29", "1ae6db", "3e464c", "a84a8f",
  "911e7e", "3f16d9", "0f525f", "ac7c0a", "b4c086", "c9d730", "30cc49",
  "3d6751", "fb4c03", "640fc1", "62c03e", "d3493a", "88aa0b", "406df9",
  "615af0", "4be47", "2a3434", "4a543f", "79bca0", "a8b8d4", "00efd4",
  "7ad236", "7260d8", "1deaa7", "06f43a", "823c59", "e3d94c", "dc1c06",
  "f53b2a", "b46238", "2dfff6", "a82b89", "1a8011", "436a9f", "1a806a",
  "4cf09d", "c188a2", "67eb4b", "b308d3", "fc7e41", "af3101", "ff065",
  "71b1f4", "a2f8a5", "e23dd0", "d3486d", "00f7f9", "474893", "3cec35",
  "1c65cb", "5d1d0c", "2d7d2a", "ff3420", "5cdd87", "a259a4", "e4ac44",
  "1bede6", "8798a4", "d7790f", "b2c24f", "de73c2", "d70a9c", "25b67",
  "88e9b8", "c2b0e2", "86e98f", "ae90e2", "1a806b", "436a9e", "0ec0ff",
  "f812b3", "b17fc9", "8d6c2f", "d3277a", "2ca1ae", "9685eb", "8a96c6",
  "dba2e6", "76fc1b", "608fa4", "20f6ba", "07d7f6", "dce77a", "77ecca"]

//drawRange = 1

let cities_json = loadJSON('./src/files/cities.json');
let people_json =  loadJSON('./src/files/people.json');
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
    scene.background = new THREE.Color( 0x000000 );
    
    /* CAMERA */
    camera = new THREE.PerspectiveCamera(  
        90, //angle of camera 
        window.innerWidth / window.innerHeight, //aspect ratio
        0.1,  //near plane distance
        1000, //far clipping distance
    );
    
    camera.position.x = 1.8; // over europe
    camera.position.y = 1.2;

    camera.lookAt(0,0,0) // look at origin

    /* LIGHT */
     const ambientlight = new THREE.AmbientLight(0xffffff, 0.8);
       scene.add(ambientlight);
     pointLight = new THREE.PointLight(0xf0f0f0, 0.5);
     pointLight.castShadow = true;
     pointLight.shadowCameraVisible = true;
     pointLight.shadowBias = 0.00001;
     pointLight.shadowDarkness = 0.2;
     pointLight.shadowMapWidth = 2048;
     pointLight.shadowMapHeight = 2048;
     pointLight.position.set(18, 20, 0);
    scene.add(pointLight);
  

    /* RENDER */ 
    renderer = new THREE.WebGLRenderer({antialias:true});   
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor(0x303030);
    document.body.appendChild(renderer.domElement);

    /* CONTROLS */ 
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 1.15;
    controls.maxDistance = 4;
    
    /* AXES */ 
    const axesHelper = new THREE.AxesHelper( 5 );
    axesHelper.setColors ( 0xff0000, 0x00ff00, 0x0000ff )
    scene.add( axesHelper );

    /* RAYCASTER */
    raycaster = new THREE.Raycaster();
	  mouse = new THREE.Vector2(1,1);

    /* DAT GUI */
    control = new function() {
      this.autoRotate = true
      this.rotationSpeed = 0.001;
      this.enableTravelAnimation = true
      this.showCityNames = true
    };



    
     /* MAIN FLOW */ 
     addControls(control);
     generateEarth();
     generateAtmosphere()
    //  createMoon();
     stars()
     generateCitiesFromFile()
     generateTravelsFromFile()
     console.log(scene.children)
     
     //setTextOverFocusedItem()

}

function stars(){
   r = 0.1 
   starsGeometry = [ new THREE.BufferGeometry(), new THREE.BufferGeometry() ];

				const vertices1 = [];
				const vertices2 = [];

				const vertex = new THREE.Vector3();

				for ( let i = 0; i < 250; i ++ ) {

					vertex.x = Math.random() * 2 - 1;
					vertex.y = Math.random() * 2 - 1;
					vertex.z = Math.random() * 2 - 1;
					vertex.multiplyScalar( r );

					vertices1.push( vertex.x, vertex.y, vertex.z );

				}

				for ( let i = 0; i < 1500; i ++ ) {

					vertex.x = Math.random() * 2 - 1;
					vertex.y = Math.random() * 2 - 1;
					vertex.z = Math.random() * 2 - 1;
					vertex.multiplyScalar( r );

					vertices2.push( vertex.x, vertex.y, vertex.z );

				}

				starsGeometry[ 0 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices1, 3 ) );
				starsGeometry[ 1 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );

				const starsMaterials = [
					new THREE.PointsMaterial( { color: 0x575757, size: 2, sizeAttenuation: false } ),
					new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
					new THREE.PointsMaterial( { color: 0xf3f3f3, size: 2, sizeAttenuation: false } ),
					new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
					new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
					new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
				];

				for ( let i = 10; i < 30; i ++ ) {

					const stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

					stars.rotation.x = Math.random() * 6;
					stars.rotation.y = Math.random() * 6;
					stars.rotation.z = Math.random() * 6;
					stars.scale.setScalar( i * 10 );

					stars.matrixAutoUpdate = false;
					stars.updateMatrix();

					scene.add( stars );

				}
}

function createMoon(){
      //var material = new THREE.MeshBasicMaterial({color:0x0000ff,wireframe:true});
      const loader = new THREE.TextureLoader();
      const material = new THREE.MeshPhongMaterial({
          map: loader.load('./assets/luna.jpg'),
        });    
      geometry = new THREE.SphereGeometry(0.2*radiusEarth, 128, 128); //size
      sphere = new THREE.Mesh (geometry, material);
      sphere.position.x = -2
      sphere.position.y = 2
      sphere.name = "moon"
      scene.add(sphere); 
      // console.log('Moon globe generated at x: '+ sphere.position.x+' y: '+sphere.position.y+' z: '+sphere.position.z)
}

function addControls(controlObject) {
  var gui = new dat.GUI();
  gui.add(controlObject, 'autoRotate',true,false)
  gui.add(controlObject, 'rotationSpeed', 0, 0.02);
  gui.add(controlObject, 'enableTravelAnimation',true,false)
  gui.add(controlObject, 'showCityNames',true,false)
  
  
}

/* Restore default colors for meshes not on focus*/
function restoreColors(){
  for (let i =0 ; i<scene.children.length;i++){
    if(scene.children[i].type === "city"){
      scene.children[i].material.color.set(cityColor)
    }
    if(scene.children[i].parent_type === "travel"){
      scene.children[i].material.color.set(travelColor)
    }
  }
}


function animateLine(){

  for (let i=0; i < scene.children.length ; i++){
    if (scene.children[i].parent_type === "travel"){
      scene.children[i].material.transparent = true
      scene.children[i].material.uniforms.dashOffset.value -= 0.005;
      }
    }
}

function inanimateLine(){
  for (let i=0; i < scene.children.length ; i++){
    if (scene.children[i].parent_type === "travel"){
      scene.children[i].material.transparent = false
    }
}}

function showCityNames(){
  for (let i=0; i < scene.children.length ; i++){
    //console.log(scene.children[i])
    if (scene.children[i].type === "city_name"){
      scene.children[i].visible=true
    }
  }
}

function hideCityNames(){
  for (let i=0; i < scene.children.length ; i++){
    //console.log(scene.children[i])
    if (scene.children[i].type === "city_name"){
      scene.children[i].visible=false
    }
  }
}


/*TODO rotate everything when user is not in control*/
function animate() {
    requestAnimationFrame(animate); 
    cloudMesh.rotation.y += 0.0002*Math.random()
   // FALTA ROTAR LA POINTLIGHT ALREDEDOR DEL EJE Y 
    
    /*Rotation*/
    if (control.autoRotate){
      scene.rotation.y+= control.rotationSpeed; 
      
      //cloudMesh.rotation.x += 0.01*Math.random()
      camera.lookAt(0,0,0) // look at origin
    }else{
      scene.rotation.y=0
    }
       
    /*Travel animations*/
    if(!control.enableTravelAnimation){
      inanimateLine()
    }else{
      animateLine()
    }

    /*Show city names*/
    if(control.showCityNames){
      showCityNames()
    }else{hideCityNames()}

    /* +++--- CONTROLS ---+++ */
    render();
}

function render() 
{
	renderer.render(scene, camera);
}

function generateAtmosphere(){
  /*ATMOSPHERE*/
  const loader = new THREE.TextureLoader();
  atm_geometry   = new THREE.SphereGeometry(1.005*radiusEarth, 128, 128)
  atm_material  = new THREE.MeshPhongMaterial({
    map     : loader.load('./assets/clouds.png'),
    side        : THREE.DoubleSide,
    opacity     : 0.6,
    transparent : true,
    depthWrite  : false,
  })
  cloudMesh = new THREE.Mesh(atm_geometry, atm_material)
  scene.add(cloudMesh)
}


/* Generate Earth globe in origin*/
function generateEarth(){
    //var material = new THREE.MeshBasicMaterial({color:0x0000ff,wireframe:true});
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshPhongMaterial({
        map: loader.load('./assets/8081_earthmap10k.jpg'),
        bumpMap: loader.load('./assets/8081_earthbump10k.jpg'),
        bumpScale:0.08,
        specularMap : loader.load('./assets/8081_earthspec10k.jpg'),
        specular: new THREE.Color(0x323232)
      });    
    geometry = new THREE.SphereGeometry(radiusEarth, 128, 128); //size
    earth = new THREE.Mesh (geometry, material);
    earth.position.x = 0
    earth.position.y = 0
    earth.name = "earth"
    scene.add(earth); 

    


    //console.log('Earth globe generated at x: '+ sphere.position.x+' y: '+sphere.position.y+' z: '+sphere.position.z)
}


// to use the new travelsCollection model
function generateJump(jumpFromFile,colour){
  fromCoordinates = getCoordinatesFromCityName(jumpFromFile.from) 
  toCoordinates =  getCoordinatesFromCityName(jumpFromFile.to)
  from = getCoordinatesFromLatLng(fromCoordinates.lat,fromCoordinates.long,radiusEarth)
  to = getCoordinatesFromLatLng(toCoordinates.lat,toCoordinates.long,radiusEarth)
  v1 = new THREE.Vector3(from.x,from.y,from.z)
  v2 = new THREE.Vector3(to.x,to.y,to.z)
  //calcular distancia entre puntos, si es muy grande, generar 20 puntos, si es pequeña generar menos puntos. Que el arco que se genera
  //dependa de la distancia entre los puntos, a mas distancia, mas alto el arco
  arc = jumpFromFile.arc
  points = []
    for (let i=0; i<=20 ; i++){
        let p = new THREE.Vector3().lerpVectors(v1,v2,i/20)
        p.normalize()
        p.multiplyScalar(1 + 2*arc*Math.sin(Math.PI*i/20))
        points.push(p)
    }
    let path = new THREE.CatmullRomCurve3(points) //all points that form the arc curve
        
    material = new MeshLineMaterial( { color: colour, lineWidth:0.0015,transparent: true, dashArray:2, dashRatio:0.6, dashOffset: 0 + Math.random()} );
    line = new MeshLine()
    line.setPoints(path.points);
    material.needsUpdate =  true
    jump = new THREE.Mesh(line,material)
    jump.name = jumpFromFile.from+' -> '+jumpFromFile.to
    jump.parent_type = "travel"
    jump.type = jumpFromFile.type //flight | car ...
    

    //earth.add(jump)
    scene.add(jump)

}


function generateCityName(city,name, x, y, z){
  var loader = new THREE.FontLoader();
  var font = loader.load( './src/fonts/helvetiker.typeface.json', function(font) 
  {
	var geometry = new THREE.TextGeometry(name, {font: font, size: 0.005, height: 0.0001}); 
  geometry.center();
	var material = new THREE.MeshPhongMaterial({color:0xffffff});
	var cityText = new THREE.Mesh(geometry, material);
  cityText.name="text of: "+name
  cityText.type = "city_name"
	cityText.position.x = 1.005*x;
  cityText.position.y = 1.005*y;
  cityText.position.z = 1.005*z;
  cityText.lookAt(1.5*x,1.5*y,1.5*z);
	scene.add(cityText);
  });
}


/* Receives lat, long of city and generate the city in the globe */
function generateCity(cityFromFile){
    lat = cityFromFile.lat
    long = cityFromFile.lng
    size = cityFromFile.size
    let city = new THREE.Mesh(
        new THREE.SphereBufferGeometry(size*0.001,20,20),
        new THREE.MeshBasicMaterial({color:0xffffff})
    );
    pos = getCoordinatesFromLatLng(lat,long,radiusEarth) 
    city.position.set(pos.x,pos.y,pos.z)
    city.name = cityFromFile.name
    city.country = cityFromFile.country
    city.continent = cityFromFile.continent
    city.type = "city"
    scene.add(city)
    // scene.add(city)
    generateCityName(city,cityFromFile.name, pos.x, pos.y, pos.z)
    // console.log('x: '+ city.position.x+' y: '+city.position.y+' z: '+city.position.z)
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
      //  console.log(cities_array[i].name+" generated at :")
       generateCity(cities_array[i])
      // generateCityNames(cities_array[i])
   }
}

function generateTravelsFromFile(){
    for (let i=0; i<travels_json.travels.length;i++){
      // console.log("Travel found: "+travels_json.travels[i].travel_name)
      colour = new THREE.Color();
      colour.setHex(`0x${colorsArray[Math.floor(Math.random() * colorsArray.length)]}`);
      for(let j=0;j<travels_json.travels[i].jumps.length;j++){
        // console.log("Jump found: "+travels_json.travels[i].jumps[j].from+" -> "+travels_json.travels[i].jumps[j].to+" ("+travels_json.travels[i].jumps[j].type+")")
        generateJump(travels_json.travels[i].jumps[j],colour)
      }
    }
}

function getCoordinatesFromCityName(name){
  for (let i=0; i<cities_json.cities.length;i++){
    if (cities_json.cities[i].name === name){
      return {lat: cities_json.cities[i].lat , long: cities_json.cities[i].lng}
    }
  }
    // console.log("City not found in cities list: "+name)
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
    if (clicked.value!=1 && (intersects[i].object.parent_type === "travel" || intersects[i].object.type === "city")){  //if focus is on travel or city 
      intersects[i].object.material.color.set( focusedColor );
      break
    }
    else{ //focus is somewhere else
      if (clicked.value===0 ){
        //restoreColors()
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
    if (intersects[i].object.parent_type === "travel" || intersects[i].object.type === "city"){  // Some mesh is clicked
      clicked.value=1
      clicked.x=mouse.x
      clicked.y=mouse.y
      intersects[i].object.material.color.set( focusedColor );
      rotation = 0
      break
    }
    else{ //something else is clicked, not city not travel
      clicked.value=0
      clicked.x=mouse.x
      clicked.y=mouse.y
      rotation = 0.0007
      //restoreColors()
    }
  }
  
}


//document.addEventListener('mousedown', onDocumentMouseDown, false);
//document.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('resize', onWindowResize,false);
init();
animate();

