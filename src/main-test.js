var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var axesHelper = new THREE.AxesHelper(50);
scene.add( axesHelper );
scene.add(new THREE.AmbientLight(0x555555));

var texture = new THREE.TextureLoader().load('https://i.ibb.co/4KGwCLD/earth-atmos-2048.jpg');

var material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );

var geometry = new THREE.PlaneGeometry( 400, 200, 32,32 );
var map = new THREE.Mesh( geometry, material );
//scene.add( map );

var geometry = new THREE.SphereGeometry( 1, 10, 10 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var sphere_marker = new THREE.Mesh( geometry, material );
scene.add(sphere_marker)

//Let's try Sydney Australia
let latitude = -33.8688; //North-South
let longitude = 151.2093; //East-West

//Remember that latitude goes between -90 degrees and +90 degrees
let normalizedLatitude = 2.0 * (((latitude + 90.0) / 180.0) - 0.5);
//Longitude goes between -180 and +180 on the other hand
let normalizedLongitude = 2.0 * (((longitude + 180.0) / 360.0) - 0.5);

//Our bounds along the x-axis are -200, to 200
//and along the x-axis are -100 to 100.
let x_location = normalizedLongitude * 200.0;
let y_location = normalizedLatitude * 100.0;
sphere_marker.position.set(x_location, y_location, 0.0);
scene.add( sphere_marker );

camera.position.z = 200;

var animate = function () {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
};

animate();