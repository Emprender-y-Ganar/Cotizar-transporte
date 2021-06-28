var directionsService = new google.maps.DirectionsService(); // Calcula la ruta de inicio y final 
var directionsRender = new google.maps.DirectionsRenderer();
const geocoder = new google.maps.Geocoder();

latLngMkr = 0,0
//Variables para el Geodecoding Inverso 
const invGcd= () =>{
    
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLngMkr.lat()},${latLngMkr.lng()}&key=AIzaSyBE8RxxJ10jyYCO1ijBn2xN1p19V-NROE8`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        document.getElementById(origen).value = data.results[0].formatted_address
        
    })      
} 

const $map = document.querySelector('#map');
let dirIni  
let marker
let markerA

points = []

let origen = "origen"
let destino = "destino"

let latLngIni = 0
let latLngDes = 0
let tiempo = 0
let distancia = 0

let lblResult = document.querySelector(".result")
    let expreso = document.querySelector(".express")
    let ruta = document.querySelector(".ruta")
    let divExpress = document.getElementById("divExpress")
    let moto = document.querySelector(".moto")
    let observaciones = document.querySelector(".observaciones")

    let positionA = new google.maps.LatLng(3.43722, -76.5225)

const map = new window.google.maps.Map ($map, {
        center: positionA, 
        zoom: 15, 
        disableDefaultUI: true,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#444444"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#c0e4f3"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            }
        ]
    })
    
    marker = new window.google.maps.Marker ({
        position: positionA, 
        map: map,
        //draggable: true

    })
    
    

navigator.geolocation.getCurrentPosition(position => {
    latLngIni = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    }
    marker.setPosition(latLngIni)
    map.setCenter(latLngIni) 
    latLngMkr = marker.position  
    invGcd()    

    marker.addListener('dragend', ()=> {
        latLngMkr = marker.position 
        console.log(marker.position)
        invGcd()
    })

    
    

    //Inicio de Autocomplete 

    var autocomplete = new google.maps.places.Autocomplete((document.getElementById(origen)), {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(3.43722, -76.5225)
        )               
    });



    var autocompleteA = new google.maps.places.Autocomplete((document.getElementById(destino)), {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(3.43722, -76.5225)
        ) 
                     
    });


    autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    latLngIni = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
    }
        points.a = {
            latLng : dirIni
        }

       marker.setPosition(latLngIni)
       map.setCenter(latLngIni)
       map.setZoom(15)
        
        //console.log(marker.getPosition())  
                    
    });
    
    //Autocomplete 2 
    autocompleteA.addListener('place_changed', function() {
    var placeA = autocompleteA.getPlace();
    latLngDes = {
        lat: placeA.geometry.location.lat(),
        lng: placeA.geometry.location.lng()
    } 
    marker.setPosition(latLngDes)
    map.setCenter(latLngDes)
    map.setZoom(15)
    points.b = {
        latLng : dirIni
    }
   
    });  //Autocomplet final 


});

var calculeBtn = document.getElementById("calcule")
    calculeBtn.addEventListener('click', ()=>{
      if(latLngIni == 0 || latLngDes == 0){
        lblResult.textContent = "¡Error! Verifique que los campos ORIGEN / DESTINO de la Ruta NO estén vacios"
        lblResult.style.backgroundColor = 'red';
        lblResult.style.color = 'white'
      } else {    
          
        
        let objSettinsDS = {
            origin: latLngIni, 
            destination: latLngDes, 
            travelMode: google.maps.TravelMode.DRIVING
        }
        
        directionsService.route(objSettinsDS, fnRutear)
        directionsRender.setMap(map)
        function fnRutear (resultados, status, ){        
            if(status=="OK") {
                let result = resultados
                directionsRender.setDirections(result)
                               
         
                distancia = result.routes[0].legs[0].distance.value;
                tiempo = result.routes[0].legs[0].duration.value;  
                dText = result.routes[0].legs[0].distance.text;
                         
                let precioKM = distancia * 1 // 1000 por KM
                let precioMin = (tiempo + 900) * 2.5 // 120 por min (incluye salraio del vehiculo por 1,2 millones)
          
                //let precioRuta = (precioKM + precioMin ) * 0.8 //Basico de todo //tarifa base
                let precioXpress = (precioKM + precioMin) + 3000 //Calculo t y d por un 60% ganancia

                let $ruta = ( (distancia *0.35) + ((tiempo + 900)*1.4) + 2000) 
                
                // 1200 segundos = 20 minutos y 0.1 serian $100 por km
                let precioMoto = (distancia * 0.1) + ((tiempo + 900) * 3.5) + 3100

          //ENVIO MOTO 

                if (precioMoto <= 4961){
                    moto.textContent = "$ 4960"
                }else{
                    moto.textContent = "$ " + Math.round(precioMoto)
                } 

          //ENVIO CARRO 
                if (precioXpress <= 5960){   // Este if es para imprimir costo Express 
                    expreso.textContent = "$ 5960" 
                    lblResult.style.backgroundColor = 'white';
                    lblResult.textContent = "El recorrido es de: " + dText + " y toma un tiempo de " + Math.round(((tiempo + 300)/60)) + " minutos." 
                } else {
                    expreso.textContent = "$ " + Math.round(precioXpress) 
                    lblResult.style.backgroundColor = 'white';
                    lblResult.textContent = "El recorrido es de: " + dText + " y toma un tiempo de " + Math.round(((tiempo + 300)/60)) + " minutos. " 
                } 

          //ENVIO RUTA PAQUETE COLECTIVO
          if ($ruta <= 4960){
              ruta.textContent = "Ruta $ 4960**"
              observaciones.textContent = "[ **Aplican T&C ] <-----LOS VEHÍCULOS CON PARRILLA TIENEN SOBRE-COSTO DE 4 MIL PESOS ---- >" 
             
          }else {
            ruta.textContent = "Ruta $ " + Math.round($ruta) + "**"
            observaciones.textContent = "[ **Aplican T&C ] <-----LOS VEHÍCULOS CON PARRILLA TIENEN COSTO ADICIONAL DE 4 MIL PESOS ---> info 3176670197"
                         
         }                   
         
        } else {
          alert ("Error, no se ha podido crear la Ruta")
        }
      }
    }
  })
