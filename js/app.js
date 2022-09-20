//VARIABLES Y SELECTORES
const formulario = document.querySelector('#agregar-gasto');
const gastoSemanal = document.querySelector('#gastos ul');

//EVENTOS
eventListeners();

function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', añadirGastos)
}
//CLASES
class Presupuesto {
    constructor (presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];

    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado;
    }
    elmiminarGasto(id){
        
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        //vuleve a realizar el calculo ya con el valor eliminado
        this.calcularRestante();
    }
}
class UI  {

    insertarPresupuesto(cantidad){
        const { presupuesto, restante } = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent  = restante;
    }
    validacion(mensaje, tipo){

        const div = document.createElement('div');
        div.classList.add('text-center','alert', 'mt-5');
       
        if(tipo === 'error'){
            div.classList.add('alert-danger');         
        }else{
            div.classList.add('alert-success');
        }

        div.textContent = mensaje;
        const mostrar = document.querySelector('#agregar-gasto');
        mostrar.appendChild(div);

        setTimeout( () => {
            div.remove();
        },3000)

    }
    listarGastos(gastos){

        limpiarHTML();

        gastos.forEach(gasto => {

            //aplicamos destroction
            const { annombre, ctidad, id } = gasto;
            //crear li
            const nuevoGasto = document.createElement('li');

            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';          
            //añadir el id al li 
            nuevoGasto.dataset.id = id;
            //Agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;
            
            //Boton borrar
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
          
            btnBorrar.onclick = () => {
                elmiminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);       
            //agregar al html
            gastoSemanal.appendChild(nuevoGasto);
    
        });
    }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent  = restante; 
    } 
    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        //Comprobar 25%
        if ( (presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');     
        }else if ( (presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');   

        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');   
        }

        //si el total es menor a 0
        if (restante <= 0) {
            ui.validacion('El presupuesto se ha agostado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }    
    }   
}

//isntancia de la clase UI
const ui =  new UI();

//declaramos la variable presupuesto de la instacia para poder utilizarlo en otras funciones
let presupuesto;

//FUNCIONES
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?')

    if (presupuestoUsuario === '' || presupuestoUsuario === null || presupuestoUsuario <= 0 || isNaN(presupuestoUsuario) ) {
         window.location.reload();
         
        }
        presupuesto = new Presupuesto(presupuestoUsuario);
        ui.insertarPresupuesto(presupuesto)
}

function añadirGastos(e) {
    
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;   
    const cantidad = Number(document.querySelector('#cantidad').value);   

   
    if (nombre === '' || cantidad === '') {
           ui.validacion('Todos los campos son obligatorios', 'error');
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.validacion('Cantidad no valida', 'error');
    }else{

        const gasto = { nombre, cantidad, id: Date.now() }
        
        //pasamos el objeto gasto a la clase
        presupuesto.nuevoGasto(gasto);
        
        ui.validacion('Añadiento gasto');
        //imprimir los gastos
        const { gastos, restante } = presupuesto
        ui.listarGastos(gastos);
        ui.actualizarRestante(restante);
        ui.comprobarPresupuesto(presupuesto);
        formulario.reset();
    } 
}

function limpiarHTML(){
    while(gastoSemanal.firstChild){
        gastoSemanal.removeChild(gastoSemanal.firstChild);
  }
}

function  elmiminarGasto(id){

    //elimina el gasto del objeto
    presupuesto.elmiminarGasto(id);

    //elimina los gastos del aHTML
    const { gastos, restante } = presupuesto;
    ui.listarGastos(gastos);

    //acutlizamos los datos del restante en el html al elimuinat 
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}



