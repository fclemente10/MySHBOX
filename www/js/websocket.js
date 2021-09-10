    var addr = '2.139.215.161'; //localStorage.getItem("ip");
    var serialN = localStorage.getItem("serialNumber");
    var ws = new WebSocket('ws://'+ addr +':3300');
    var actuar1 = 0;
    var nombreEquipo = document.getElementById('nombreEquipo');
    var accion = document.getElementById('accion');
    var horaInicio = document.getElementById('horaInicio');
    var horaFin = document.getElementById('horaFin');

//    alert('Config WebSocket ip = ' + addr);

    ws.onmessage = function (event) {
      var infoEquipo = JSON.parse(event.data);
//      alert('a message ='+ infoEquipo.serial ); // mensagem do servidor devera ser =   "serial": "bd1c029f2874ea91"
      if (infoEquipo.serial == serialN )
      {
        processData();
      }
    };

    ws.onopen = function () {
      ws.send('I just cconnected! Serial= ' + serialN );
    };

    function processData(){
        alert('Comando recibido - Actualizando datos');
        const options = {
          method: 'get',
          data: { },
          headers: {}
        };
        cordova.plugin.http.sendRequest('http://' + addr + ':3000/api/v1/equipo/' + serialN , options, function(response) {

        var infoEquipo = JSON.parse(response.data)

        infoEquipo.forEach(info=> {
          actuar1 = info.onoff;
          this.accion.innerText = info.accion;
          this.horaInicio.innerText = info.horaInicio;
          this.horaFin.innerText = info.horaFinal;
        });

        //    alert("actuar1= " + actuar1);
        if (actuar1 == 0 ){
            if (open) serial.write('0');
            document.getElementById("on").style.display = "none";  //hide
            document.getElementById("off").style.display = "block"; //show
            document.getElementById("enchufado").style.display = "none";  //hide
            document.getElementById("quitado").style.display = "block"; //show
            document.getElementById("enchufado2").style.display = "none";  //hide
            document.getElementById("quitado2").style.display = "block"; //show
         }
        if (actuar1 == 1 ){
            if (open) serial.write('1');
            document.getElementById("off").style.display = "none";  //hide
            document.getElementById("on").style.display = "block"; //show
            document.getElementById("quitado").style.display = "none";  //hide
            document.getElementById("enchufado").style.display = "block"; //show
            document.getElementById("quitado2").style.display = "none";  //hide
            document.getElementById("enchufado2").style.display = "block"; //show
        }

        }, function(response) {
            if( response.error) {
              alert("Error Busca Datos Base de datos " + response.error);
            }
          }
        ); // Fin GET Request


        cordova.plugin.http.sendRequest('http://' + addr + ':3000/api/v1/infoequipo/' + serialN , options, function(response) {

        var infoEquipo = JSON.parse(response.data)

        infoEquipo.forEach(info=> {
          this.nombreEquipo.innerText = info.nombreEquipo;

        });
        }, function(response) {
            if( response.error) {
              alert("Error Busca Datos Base de datos " + response.error);
            }
          }
        ); // Fin GET Request

    }
