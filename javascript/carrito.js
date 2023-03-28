document.addEventListener('DOMContentLoaded', () => {

    // Variables
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Brownie',
            precio: 3000,
            imagen: '../assets/img/brownie.png'
        },
        {
            id: 2,
            nombre: 'Lemonpie',
            precio: 2000,
            imagen: '../assets/img/lemonpie.png'
        },
        {
            id: 3,
            nombre: 'Chocotorta',
            precio: 1000,
            imagen: '../assets/img/chocotorta.png'
        },
        {
            id: 4,
            nombre: 'Torta Sacher',
            precio: 4000,
            imagen: '../assets/img/torta-chocolate.png'
        }
    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;

    // Funciones
    //Mostrar los productos en el Menú
    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            const contenedor = document.createElement('div');
            contenedor.classList.add('contenedor-productos');
            
            const producto = document.createElement('div');
            producto.classList.add('producto');
            
            const productoImagen = document.createElement('img');
            productoImagen.classList.add('producto-imagen');
            productoImagen.setAttribute('src', info.imagen);
            
            const productoInfo = document.createElement('div');
            productoInfo.classList.add('producto-info');
            productoInfo.innerHTML = `${info.nombre}` + '<br />' +  `${divisa} ${info.precio}`;
            
            const botonAgregar = document.createElement('button');
            botonAgregar.classList.add('producto-agregar');
            botonAgregar.textContent = 'Agregar';
            botonAgregar.setAttribute('marcador', info.id);
            botonAgregar.addEventListener('click', sumarProductoAlCarrito);
            botonAgregar.addEventListener('click', () => {
                Toastify({
                    text: "Producto agregado",
                    duration: 2000,
                    close: true,
                    gravity: "top", 
                    position: "right", 
                    stopOnFocus: true, 
                    style: {
                        background: "linear-gradient(to right, #00b09b, rgba(42, 139, 90, 0.589))",
                        fontSize: "x-large",
                        fontWeight: "bold",
                    },
                    onClick: function(){} 
                }).showToast();
            });
            // Insertar
            producto.appendChild(productoImagen);
            producto.appendChild(productoInfo);
            producto.appendChild(botonAgregar);
            contenedor.appendChild(producto);
            DOMitems.appendChild(contenedor);
        });
    }

    //Añadir un producto al carrito de la compra
    function sumarProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'))
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
    }

    //Mostrar los productos guardados en el carrito 
    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
            const contenedor = document.createElement('li');
            contenedor.classList.add('list-group-item', 'text-right', 'mx-2');
            contenedor.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa} ${miItem[0].precio}`;
            // Borrar
            const botonEliminar = document.createElement('button');
            botonEliminar.classList.add('producto-quitar');
            botonEliminar.textContent = 'X';
            botonEliminar.style.marginLeft = '1rem';
            botonEliminar.dataset.item = item;
            botonEliminar.addEventListener('click', borrarItemCarrito);
            botonEliminar.addEventListener('click', () => {
                Toastify({
                    text: "Producto(s) eliminado(s)",
                    duration: 2000,
                    close: true,
                    gravity: "top", 
                    position: "right", 
                    stopOnFocus: true, 
                    style: {
                        background: "linear-gradient(90deg, rgba(176,68,44,0.7651260333234856) 0%, rgba(255,115,0,0.8743697308024773) 100%)",
                        fontSize: "larger",
                        fontWeight: "bold",
                    },
                    onClick: function(){} 
                }).showToast();
            });
            contenedor.appendChild(botonEliminar);
            DOMcarrito.appendChild(contenedor);
        });
        DOMtotal.textContent = calcularTotal();
    }

    // Borrar un elemento del carrito
    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        renderizarCarrito();
        guardarCarritoEnLocalStorage();

    }

    // Calcular el total 
    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    // Modificar el carrito en pantalla cuando se modifica el pedido
    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        localStorage.clear();
    }

    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage () {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    // SweetAlert2 al vaciar el carrito
    DOMbotonVaciar.addEventListener('click', () => {
        Swal.fire({
            icon: 'warning',
            iconColor: 'rgba(42, 139, 90, 0.589)',
            background: 'white',
            title: '¿Estas seguro/a que quieres vaciar el carrito?',
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Volver',
            showDenyButton: true,
            denyButtonText: 'Vaciar'
        }).then((result) => {
            if(result.isDenied){
                vaciarCarrito()
            }else{}
        })
    });

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});