const arrayPersonajes = [
    {
        nombre: "abra",
        rutaImagen: "img/abra.png"
    },
    {
        nombre: "bullbasaur",
        rutaImagen: "img/bullbasaur.png"
    },
    {
        nombre: "charmander",
        rutaImagen: "img/charmander.png"
    },
    {
        nombre: "dratini",
        rutaImagen: "img/dratini.png"
    },
    {
        nombre: "eevee",
        rutaImagen: "img/eevee.png"
    },
    {
        nombre: "jigglypuff",
        rutaImagen: "img/jigglypuff.png"
    },
    {
        nombre: "mankey",
        rutaImagen: "img/mankey.png"
    },
    {
        nombre: "meowth",
        rutaImagen: "img/meowth.png"
    },
    {
        nombre: "pidgey",
        rutaImagen: "img/pidgey.png"
    },
    {
        nombre: "pikachu-2",
        rutaImagen: "img/pikachu-2.png"
    },
    {
        nombre: "psyduck",
        rutaImagen: "img/psyduck.png"
    },
    {
        nombre: "squirtle",
        rutaImagen: "img/squirtle.png"
    } 
]

const game = document.getElementById("game");
const rejilla = document.createElement("section");
const ganador = document.getElementById("ganador");
const btnInicio = document.getElementById("inicio");
const reloj = document.getElementById("reloj");
const cartelGameOver = document.getElementById("game-over");
const bounce = document.getElementById("bounce");
const clic = document.getElementById("clic");
const fail = document.getElementById("fail");
const song = document.getElementById("song");
const winner = document.getElementById("winner");

var contador = 0;
var primerSeleccionado = "";
var segundoSeleccionado = "";
var selPrevio = null;
var eliminados = 0;

//creacion de clase y divs para cada personaje A PARTIR DEL ARRAY


rejilla.setAttribute("class","rejilla");
game.appendChild(rejilla);
//creamos una funcion para que cada vez que empiece un nuevo juego se barajen las bolas
function baraja(){
    song.currentTime = 0;
    song.play();
    song.volume = 0.5;
    const doblePersonajes = arrayPersonajes.concat(arrayPersonajes).sort(()=> 0.5 - Math.random());


    doblePersonajes.forEach(personaje => {
    const { nombre, rutaImagen } = personaje;
    tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");
    tarjeta.dataset.name = nombre;

    anverso = document.createElement("div");
    anverso.classList.add("anverso");

    reverso = document.createElement("div");
    reverso.classList.add("reverso");
    reverso.style.backgroundImage = `url(${rutaImagen})`;

    rejilla.appendChild(tarjeta);
    tarjeta.appendChild(anverso);
    tarjeta.appendChild(reverso);
    });
    //con esto hacemos que cuando le demos al boton vuelva la rejilla con el orden cambiado
    rejilla.classList.remove("fuera");
    btnInicio.style.display = "none";
    reloj.style.display="initial";
    cartelGameOver.style.opacity = "0";
    eliminados = 0;
    //cuando ganes se quita la opcion open
    ganador.classList.remove("open");

    
};
//funcion de reloj cuenta atras
var segundos  = 30;
function cuentaAtras(){
    var s = parseInt(segundos % 60); //lo que hace es coger el resto de 60
    var ss = ("0" + s).slice(-2);
    var m = parseInt (segundos/60);
    var mm= ("0" + m).slice(-2);
    reloj.innerHTML= mm + ":" + ss;
    if(eliminados == 2){
        return;
    }
   if(segundos > 0){
    var t = setTimeout(function(){
        cuentaAtras();//recursividad llama a una funcion a si misma desde dentro puede dar problemas de rendimientos
    },1000);
   }else{
       gameOver();
   }
    segundos--;
}

//funcion para ejecutar la logica de gameover
function gameOver(){
    segundos = 30;
    rejilla.classList.add("fuera");
    btnInicio.style.display = "initial";
    reloj.style.display="none";
    //porque en el css esta la opacidad a 0 
    cartelGameOver.style.opacity = "1";
    fail.currentTime = 0;
    fail.play();
    song.pause();
    setTimeout(function(){
        while(rejilla.firstChild){
            rejilla.removeChild(rejilla.firstChild);
        }
    },1000);
    
}


//logica para el evento click de seleccion de cada personaeje
rejilla.addEventListener("click", function(evento){
    var seleccionado = evento.target;

    if (seleccionado.nodeName === "SECTION" || 
        seleccionado.parentNode === selPrevio ||
        seleccionado.parentNode.classList.contains("eliminado")) {
        return;
    }
    clic.currentTime = 0;
    clic.play();

    if (contador < 2) {
        contador++;
        if (contador === 1) {
            primerSeleccionado = seleccionado.parentNode.dataset.name;
            seleccionado.parentNode.classList.add("seleccionado");
            selPrevio = seleccionado.parentNode;
        } else {
            segundoSeleccionado = seleccionado.parentNode.dataset.name;
            seleccionado.parentNode.classList.add("seleccionado");
        }

        if (primerSeleccionado !== "" && segundoSeleccionado !== "") {
            if (primerSeleccionado === segundoSeleccionado) {
                setTimeout(eliminar, 1200);
                setTimeout(resetSelec, 1200);
                contEliminados();
            } else {
                setTimeout(resetSelec, 1200);
                selPrevio = null;
            }
        } 
        // selPrevio = seleccionado.parentNode;
    }
});
//funcion para asignar la clase eliminado cuando existan dos coincidencias
var eliminar = function () {
    var eliminados = document.querySelectorAll(".seleccionado");
    bounce.currentTime=0;
    bounce.play();
    eliminados.forEach(eliminado => {
        eliminado.classList.add("eliminado");
    });
}
//funcion para resetear los selecciondados cuando no coincidan

var resetSelec = function () {
    primerSeleccionado = "";
    segundoSeleccionado = "";
    contador = 0;

    var seleccionados = document.querySelectorAll(".seleccionado");
    seleccionados.forEach(seleccionado => {
        seleccionado.classList.remove("seleccionado");
    });
}
//funcion para contar los eliminados y determinar cuando acaba el juego con exito
var contEliminados = function () {
    eliminados = document.querySelectorAll(".eliminado").length + 2;
    if (eliminados === 2) {
        ganador.classList.add("open");
        segundos = 30;
        rejilla.classList.add("fuera");
        btnInicio.style.display = "initial";
        reloj.style.display="none";
        setTimeout(function(){
            winner.currentTime=0;
            winner.play();
        },1000)
        song.pause();
        
        setTimeout(function(){
            while(rejilla.firstChild){
                rejilla.removeChild(rejilla.firstChild);
            }
    },1000);
    }
}


