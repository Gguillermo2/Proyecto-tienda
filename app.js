    //Esto importa el módulo colors de NPM para darle color al texto en la consola
        const colors = require('colors');
    //Importa el módulo fs de Node.js y específicamente las promesas para hacer operaciones asíncronas más fáciles
        const fs = require('fs').promises;
    //Crea una interfaz readline para leer entrada del usuario desde la consola
        const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout, 
    });
    //Importa el módulo cli-table para imprimir tablas bonitas en la consola
        const Table = require('cli-table');
    //Declara la clase Producto para representar productos en la tienda
    //Usa propiedades privadas con el # para encapsular los datos
        class Producto {
            #codigoproducto;
            #nombreproducto;
            #inventarioproducto;
            #precioproducto;

        constructor() {
            this.#codigoproducto = '';
            this.#nombreproducto = '';
            this.#inventarioproducto = 0;
            this.#precioproducto = 0;
        }

        get codigoproducto() {
            return this.#codigoproducto;
        }

        set codigoproducto(codigo) {
            this.#codigoproducto = codigo;
        }

        get nombreproducto() {
            return this.#nombreproducto;
        }

        set nombreproducto(nombre) {
            this.#nombreproducto = nombre;
        }

        get inventarioproducto() {
            return this.#inventarioproducto;
        }

        set inventarioproducto(inventario) {
            this.#inventarioproducto = inventario;
        }

        get precioproducto() {
            return this.#precioproducto;
        }

        set precioproducto(precio) {
            this.#precioproducto = precio;
        }
        //es una función asincrónica que muestra los detalles de un producto en una tabla. 
        async mostrarEnTabla() {
                // Utiliza la librería Table para crear una tabla con encabezados (código, nombre, inventario y precio) y una fila de datos 
                const table = new Table({
                    head: ['Código', 'Nombre', 'Inventario', 'Precio'],
                    colWidths: [15, 25, 15, 15],
                });
                //Inserta una fila en la tabla con los datos del producto actual, que se acceden a través de las propiedades codigoproducto, nombreproducto, inventarioproducto y precioproducto del objeto en el que se encuentra esta función.
                table.push([this.codigoproducto, this.nombreproducto, this.inventarioproducto, this.precioproducto]);
                //: Muestra la representación en forma de cadena de la tabla en la consola.
                console.log(table.toString());
            }
        }
    //Declara la clase carritoCompras con el fin de representar un carrito de compras
        class carritoCompras {
            listaComprasCarrito;
                constructor() {
            this.listaComprasCarrito = [];
            }

            get getListaComprasCarrito() {
                return this.listaComprasCarrito;
            }

            set setListaComprasCarrito(lista) {
                this.listaComprasCarrito = lista;
            }
            obtenerListaCompras() {
                return this.listaComprasCarrito;
            }
        }

//Clase principal ProductosTienda para gestionar los productos y compras
        class ProductosTienda {
        #listaproductos;
        #carritoCompras;

        constructor() {
            this.#listaproductos = [];
            this.#carritoCompras = new carritoCompras();
        }

        get listaproductos() {
            return this.#listaproductos;
        }
        set listaproductos(lista) {
            this.#listaproductos = lista; 
        }
        //Esta es una función asincrónica que guarda los productos en un archivo.
        async grabararchivoproductos() {
        //Se utiliza un bloque try catch para manejar cualquier error que pueda ocurrir durante el proceso de escritura en el archivo.
            try {
            //Utiliza el módulo fs  que significa (File System) para escribir en el archivo datos.json.
            //Se utiliza  el método stringify para convertir un objeto JavaScript (en este caso, this.#listaproductos) a una cadena de texto JSON. null y 2, controlan la forma en que se formatea la cadena JSON resultante.
                await fs.writeFile('./datos.json', JSON.stringify(this.#listaproductos, null, 2));
                console.log('Productos guardados en datos.json'.bgGreen);
            } catch (error) {
                console.error(`Error al guardar los productos: ${error.message}`.bgRed);
            }
        }
        //Este método se encarga de mostrar los productos almacenados en la lista.
        mostrarProductos() {
            //if:Comprueba si la lista de productos está vacía. Si no hay productos en la lista, muestra un mensaje en la consola 
            if (this.listaproductos.length === 0) {
                console.log('No hay productos para mostrar'.bgYellow);
                return;
            }
            // Crea una nueva tabla utilizando la librería Table. Define los encabezados de la tabla
            const table = new Table({
                head: ['Código', 'Nombre', 'Inventario', 'Precio'],
                colWidths: [15, 25, 15, 15],
            });
            // Itera sobre cada producto en la lista de productos usando forEach().
            this.listaproductos.forEach((producto) => {
                //Obtiene el código del producto. Si el campo codigoproducto del producto actual no se encuntra  lo mostrara como N/a
                const codigo = producto.codigoproducto || 'N/A';
                const nombre = producto.nombreproducto || 'N/A';
                const inventario = producto.inventarioproducto || 'N/A';
                const precio = producto.precioproducto || 'N/A';
                //Agrega una fila a la tabla con los detalles del producto actual.
                table.push([codigo, nombre, inventario, precio]);
            });
            //Muestra la representación en forma de cadena de la tabla en la consola. table.toString() convierte la tabla en una cadena para mostrarla en la consola.
            console.log(table.toString());
        }
        // Este es un método asincrónico que administra el proceso de compra de productos.
        async comprarProducto() {
            //Comprueba si el carrito de compras (#carritoCompras) está vacío o no existe. Si no existe, crea una nueva instancia de carritoCompras
            if (!this.#carritoCompras) {
                this.#carritoCompras = new carritoCompras();
            }
            //Se Inicializa un array productosComprados y una variable comprarMas que controla si el cliente desea seguir comprando
            const productosComprados = [];
            let comprarMas = true;
            //Se Inicializa variables para almacenar la información del cliente.
            let nombreCliente = '';
            let identificacionCliente = '';
            let edadCliente = '';
            // Inicia un bucle que permite al cliente comprar productos mientras la variable comprarMas sea verdadera
            while (comprarMas) {
                //Comprueba si se han ingresado los detalles del cliente. Si no se han ingresado, solicita al usuario ingresar el nombre, identificación y edad
                if (!nombreCliente || !identificacionCliente || !edadCliente) {
                    nombreCliente = await pausaYObtenerEntrada('Ingrese su nombre: ');
                    identificacionCliente = await pausaYObtenerEntrada('Ingrese su identificación: ');
                    edadCliente = await pausaYObtenerEntrada('Ingrese su edad: ');
                }
                    console.log(`Productos disponibles:`.bgBlue);
                    // Muestra los productos disponibles llamando al método mostrarProductos
                    this.mostrarProductos();
                    //Solicita al usuario que ingrese el código del producto que desea comprar
                    const codigo = await pausaYObtenerEntrada('Ingrese el código del producto que desea comprar: ');
                    // Busca el producto en la lista de productos utilizando el código proporcionado por el cliente.
                    const productoComprado = this.listaproductos.find(producto => producto.codigoproducto === codigo);
                    //Se ejecuta un if para confirmar si la compra del producto es posible. Si el producto existe y está disponible en inventario, procede con la compra
                if (productoComprado && productoComprado.inventarioproducto > 0) {
                    productoComprado.inventarioproducto--;
                    productoComprado.cliente = {
                        nombre: nombreCliente,
                        identificacion: identificacionCliente,
                        edad: edadCliente
                    };
                    //Se utiliza el método push para agregar el productoComprado a la lista de compras del carrito Esta líneatiene el fin de actualizar el carrito con el nuevo producto comprado.  
                        this.#carritoCompras.getListaComprasCarrito.push(productoComprado); 
                        console.log(`¡Producto comprado con éxito!`.bgGreen);
                    } else {
                        //Si el producto no se encuentra o no está disponible en inventario, muestra mensajes de error
                        if (!productoComprado) {
                            console.log(`Producto no encontrado. Por favor, ingrese un código válido.`.bgRed);
                    } else {
                        console.log(`Producto sin inventario. Por favor, elija otro producto.`.bgRed);
                    }
                }
                //Pregunta al cliente si desea seguir comprando. Si la respuesta es 'si', se continúa el bucle; de lo contrario, el proceso de compra termina
                const respuesta = await pausaYObtenerEntrada('¿Desea comprar otro producto? (si/no): ');
                comprarMas = respuesta.toLowerCase() === 'si';
            }
        }
        //método es asincrónico y se encarga de cargar los datos desde el archivo.
        async cargarDatos() {
            //Se utiliza un bloque try catch para manejar cualquier posible error que pueda ocurrir durante el proceso de lectura del archivo.
            try {
                //se utiliza readfile para leer el contenido del archivo datos.json y se espera la finalización para obtener los datos
                const data = await fs.readFile('./datos.json', 'utf-8');
                //Se utiliza jhon.parse función que convierte una cadena de texto JSON en un objeto JavaScrip con el fin de trabajar con esos datos de una manera más eficiente
                this.listaproductos = JSON.parse(data);
                console.log(`Productos cargados desde datos.json`.bgBlue);
            } catch (error) {
                console.error(`Error al cargar el archivo: ${error.message}`.bgRed);
            }
        }
        //método que es asincrónico y se encarga de realizar copias de respaldo.
        async copiaDeRespaldo() {
            ////Se utiliza un bloque try catch para manejar cualquier posible error que pueda ocurrir durante el proceso deobtener la fecha 
            try {
                //Se utiliuza la funcion obtenerFechaActualFormateada para obtener la fecha actual . Esta fecha se utilizará para construir el nombre del archivo de respaldo
                const fechaActual = obtenerFechaActualFormateada();
                //Crea el nombre del archivo de respaldo utilizando la fecha actual formatead
                const nombreCopiaRespaldo = `respaldo_${fechaActual}.json`;
                //Se utiliza fs.readFile para leer el contenido del archivo datos.json de forma asíncrona y obtiene los datos en formato de cadena
                const data = await fs.readFile('./datos.json', 'utf-8');
                //Se Utiliza fs.copyFile para realizar una copia del archivo original (datos.json) a la carpeta de copias de respaldo, utilizando el nombre construido anteriormente
                await fs.copyFile('./datos.json', `./copias_respaldo/${nombreCopiaRespaldo}`);
                //mensaj qeu confirma el exito de la accion 
                console.log(`Copia de respaldo creada: ${nombreCopiaRespaldo}`.bgGreen);
            } catch (error) {
                console.error(`Error al crear la copia de respaldo: ${error.message}`.bgRed);
            }
        }
        //método que es asincrónico y se encarga de realizar una restauracion de copias por si se estropea el archivo principal
        async restaurarDesdeCopia() {
            // Función restaurarDesdeCopia
            try {
                //Se Utiliza fs.readdir para obtener la lista de archivos de la carpeta copias_respaldo de forma asíncrona que se almacena en listaCopias.
                const listaCopias = await fs.readdir('./copias_respaldo');
                //En este if Si no hay copias de respaldo disponibles, muestra un mensaje y sale de la función
                if (listaCopias.length === 0) {
                    console.log('No hay copias de respaldo disponibles'.bgYellow);
                    return;
            }
            //Muestra las copias de respaldo disponibles enumeradas en la consola
                console.log('Copias de respaldo disponibles:'.bgBlue);
                //Se utiliza una función de flecha que toma dos parámetros. copia
                listaCopias.forEach((copia, index) => {
                // Dentro de la función de flecha, se utiliza console.log para imprimir en la consola una cadena que combina el índice más uno index+1 osea el nombre de la copia y suma de 1 al índice se realiza porque los índices de arrays comienzan desde 0, pero para presentar al usuario de manera más natural, se suma 1
                console.log(`${index + 1}. ${copia}`);
            });
            //En esta parte donde se pausa se Pide al usuario que seleccione una copia de respaldo ingresando un número. Convierte la opción a un índice de array restando 1.
                const opcion = await pausaYObtenerEntrada('Seleccione una copia de respaldo (1, 2, etc.): ');
                const indiceCopia = parseInt(opcion) - 1;
                //Se utiliza un if por Si la opción seleccionada es válida, utiliza fs.copyFile para restaurar el archivo original (datos.json) desde la copia seleccionada. 
                if (!isNaN(indiceCopia) && indiceCopia >= 0 && indiceCopia < listaCopias.length) {
                    const nombreCopiaSeleccionada = listaCopias[indiceCopia];
                    await fs.copyFile(`./copias_respaldo/${nombreCopiaSeleccionada}`, './datos.json');
                    //Muestra mensajes de éxito y cómo aplicar los cambios reiniciando la aplicación. 
                    console.log(`Restauración exitosa desde la copia: ${nombreCopiaSeleccionada}`.green);
                    console.log('Reinicie la aplicacion con controlc para aplicar correctamente los cambios'.bgGreen);
                } else {//En caso contrario muestra un mensaje de opción no válida.
                    console.log('Opción no válida'.bgRed);
                }
            } catch (error) {//Captura cualquier error que pueda ocurrir durante el proceso e imprime un mensaje de error en la consola
                console.error(`Error al restaurar desde copia de respaldo: ${error.message}`.bgRed);
            }
        }
        //método que es asincrónico y se encarga de realizar la agregacion de un nuevo produnfo 
        async agregarNuevoProducto() {
            //se crea un bloque try, donde se manejarán posibles errores Si ocurre algún error dentro de este bloque, el control se trasladará al bloque catch
            try {
                //Se Declara una constante nuevoProducto y espera a que la función obtenerDetallesProducto() se complete antes de asignar el resultado a esta constante
                const nuevoProducto = await obtenerDetallesProducto();
                //Agrega el nuevo producto a la lista de productos (this.listaproductos).
                this.listaproductos.push(nuevoProducto);
                //Llama a la función asincrónica grabararchivoproductos y espera a que se complete 
                await grabararchivoproductos(this.listaproductos);
                //imprime un mensaje de exito en la consola 
                console.log('Producto agregado con éxito'.bgGreen);
                } catch (error) {//Captura cualquier error que pueda ocurrir durante el proceso e imprime un mensaje de error en la consola
                console.error(`Error al agregar el nuevo producto: ${error.message}`.bgRed);
                }
            }
        //método que es asincrónico y se encarga de realizar la elminiacion de un producto en el archivo datos.Json
        async eliminarProductoInteractivo() {
            //Solicita al usuario ingresar el código del producto mediante la función pausaYObtenerEntrada y espera a que la entrada sea proporcionada antes de continuar
            const codigo = await pausaYObtenerEntrada('Código del producto: ');
            //Utiliza el método findIndex para buscar en la lista de productos el índice del producto que tiene el código proporcionado por el usuario
            const index = this.listaproductos.findIndex(producto => producto.codigoproducto === codigo);
            // El if  se Comienza como  estructura condicional que verifica si se encontró el producto en la lista
            if (index !== -1) {
                // Elimina el producto del array utilizando el método splice. El segundo argumento
                this.listaproductos.splice(index, 1); // Elimina el producto del array
                //Guarda la lista actualizada de productos en el archivo utilizando la función asincrónica grabararchivoproductos
                await grabararchivoproductos(this.listaproductos);
                //imprime en la consola un mensaje 
                console.log(`Producto con código ${codigo} eliminado con éxito`.bgGreen);
            } else {//Inicia el bloque que se ejecutará si el producto no se encuentra en la lista.
                console.log(`Producto con código ${codigo} no encontrado`.bgRed);
            }
        }
        //
        imprimirFactura() {
            //Obtiene la lista de productos comprados del carrito de compras (this.#carritoCompras) mediante el método obtenerListaCompras().
            const productosComprados = this.#carritoCompras.obtenerListaCompras();
            //Comienza una estructura if para verificar si la lista de productos comprados está vacía.
            if (productosComprados.length === 0) {
            //Si la lista está vacía, imprime un mensaje en la consola indicando que no hay productos en la factura.
                console.log('No hay productos en la factura');
                return;
            }
    
            console.log('*******************************'.bgYellow);
            console.log('        FACTURA DE COMPRA       '.bgYellow);
            console.log('*******************************'.bgYellow);
            //Se Inicializa una variable totalCompra para acumular el total de la compra.
            let totalCompra = 0;
            //Inicia un bucle forEach que itera sobre cada producto en la lista de productos comprados.
            productosComprados.forEach((producto) => {
                console.log(`Producto: ${producto.nombreproducto}`);
                console.log(`Precio: ${producto.precioproducto}`);
                console.log(`Cliente: ${producto.cliente.nombre}`);
                console.log('------------------------');
                totalCompra += producto.precioproducto;
            });
            console.log(`Total de la compra: ${totalCompra}`.bgYellow);
            console.log('*******************************'.bgYellow);
        }
    }   //variable que se usa para rastrear si los productos se han cargado.
        let cargarproductos = false;
        //Se crea una instancia de la clase ProductosTienda.
        const tienda = new ProductosTienda();
        (async () => {
        //: Se crea otra instancia de ProductosTienda.
        const tienda = new ProductosTienda();
            // se llama a cargarDatos para cargar los datos del archivo (si existe) en la instancia de ProductosTienda.
            await tienda.cargarDatos();
            //bucle que se ejecuta indefinidamente hasta que el usuario elige salir con la opción 
            //Dentro del bucle, se muestra un menú con opciones numeradas del 1 al 7, y el usuario puede seleccionar una opción ingresando el número correspondiente
            while (true) {
                console.log(`//////////////////////////////`.yellow);
                console.log(`//   Seleccione una opción  //`.blue);
                console.log(`//////////////////////////////\n`.red);
                console.log(`_______________________________`.yellow)
                console.log(`${'1'.yellow} Cargar Datos`);
                console.log(`_______________________________`.yellow)
                console.log(`_______________________________`.blue)
                console.log(`${'2'.blue} Copia de Respaldo`);
                console.log(`_______________________________`.blue)
                console.log(`_______________________________`.red)
                console.log(`${'3'.red} Reparación Datos`);
                console.log(`_______________________________`.red)
                console.log(`_______________________________`.green)
                console.log(`${'4'.green} Grabar Nuevos Productos`);
                console.log(`_______________________________`.green)
                console.log(`_______________________________`.cyan)
                console.log(`${'5'.cyan} Borrar Producto`);
                console.log(`_______________________________`.cyan)
                console.log(`_______________________________`.america)
                console.log(`${'6'.america} Comprar productos`);
                console.log(`_______________________________`.america)
                console.log(`_______________________________`.rainbow)
                console.log(`${'7'} Imprimir Factura`);
                console.log(`_______________________________`.rainbow)
                console.log(`${'0'} Cerrar App`);
                console.log(`_______________________________`.random)

                const opcion = await pausaYObtenerEntrada('Seleccione una opción (1-7): ');
                //Se utiliza un switch para manejar las diferentes opciones seleccionadas por el usuario.
                //Cada case ejecuta diferentes métodos de la instancia de ProductosTienda según la opción seleccionada.
                switch (opcion) {
                    case '1':
                        tienda.mostrarProductos();
                        cargarproductos = true;
                        break;

                    case '2':
                        if(cargarproductos){
                        await tienda.copiaDeRespaldo();
                    }else{
                        console.log("debe cargar los productos primero OPCION 1 ".rainbow)
                    }
                        break;

                    case '3':
                        await tienda.restaurarDesdeCopia();
                        break;

                    case '4':
                        if(cargarproductos){
                        await tienda.agregarNuevoProducto();
                    }else{
                        console.log("debe cargar los productos primero OPCION 1 ".rainbow)
                    }
                        break;

                    case '5':
                        if(cargarproductos){
                        await tienda.eliminarProductoInteractivo();
                    }else{
                        console.log("debe cargar los productos primero OPCION 1 ".rainbow)
                    }
                        break;
            
                    case '6':
                        if(cargarproductos){
                        await tienda.comprarProducto();
                    }else{
                        console.log("debe cargar los productos primero OPCION 1 ".rainbow)
                    }
                        break;

                    case '7':
                        tienda.imprimirFactura();
                        break;
                    default:
                        console.log('Opción no válida'.bgRed);
                        break;

                        case '0':
                            console.log('$$$ PROGRAMA FINALIZADO $$$ '.rainbow);
                            return;
            }
        }
    
    })();

        async function grabararchivoproductos(listaProductos) {
            try {
                const data = listaProductos.map(producto => ({
                codigoproducto: producto.codigoproducto,
                nombreproducto: producto.nombreproducto,
                inventarioproducto: producto.inventarioproducto,
                precioproducto: producto.precioproducto,
        }));
            await fs.writeFile('./datos.json', JSON.stringify(data, null, 2));
                console.log('Productos guardados en datos.json'.bgGreen);
            } catch (error) {
            console.error(`Error al guardar los productos: ${error.message}`.bgRed);
        }
    }
        
        //Define una función asíncrona llamada "pausaYObtenerEntrada" que recibe un parámetro llamado "pregunta"
        async function pausaYObtenerEntrada(pregunta) {
            //La función retorna una nueva Promesa
            return new Promise((resolve) => {
            //Utiliza el módulo readline para hacer una pregunta al usuario pasando el parámetro "pregunta"
            //El segundo parámetro es una función callback que se ejecutará cuando el usuario ingrese algo y presione Enter
            //Esa función callback recibe el valor ingresado en el parámetro "respuesta"
        readline.question(pregunta, (respuesta) => {
        //Dentro del callback, resuelve la Promesa retornando el valor "respuesta" ingresado por el usuario
            resolve(respuesta);
        });
    });
    }

        async function obtenerDetallesProducto() {
            return new Promise(async (resolve) => {
                const nuevoProducto = new Producto();
                    nuevoProducto.codigoproducto = await pausaYObtenerEntrada('Código del producto: ');
                    nuevoProducto.nombreproducto = await pausaYObtenerEntrada('Nombre del producto: ');
                    nuevoProducto.inventarioproducto = parseInt(await pausaYObtenerEntrada('Inventario del producto: '));
                    nuevoProducto.precioproducto = parseFloat(await pausaYObtenerEntrada('Precio del producto: '));
                resolve(nuevoProducto);
            });
        }

        const obtenerFechaActualFormateada = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
        };
