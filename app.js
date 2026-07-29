// ===== Página: Inicio de sesión (login.html) =====
if (document.getElementById('loginForm')) {
    // Credenciales válidas de la demo
    const emailValido = 'usuario@wallet.com';
    const passwordValida = '123456';

    // Capturar el envío del formulario con jQuery
    $('#loginForm').submit(function (evento) {
        // Evitar que la página se recargue
        evento.preventDefault();

        const email = $('#email').val();
        const password = $('#password').val();

        if (email === emailValido && password === passwordValida) {
            // Credenciales correctas: mostrar éxito y redirigir
            $('#mensaje').html('<div class="alert alert-success">Inicio de sesión exitoso. Redirigiendo...</div>');

            setTimeout(() => {
                window.location.href = 'menu.html';
            }, 1500);
        } else {
            // Credenciales incorrectas: mostrar error
            $('#mensaje').html('<div class="alert alert-danger">Email o contraseña incorrectos.</div>');
        }
    });
}

// ===== Página: Menú Principal (menu.html) =====
if (document.getElementById('saldo')) {
    // Leer el saldo guardado; si es la primera vez, usar el saldo inicial
    let saldo = localStorage.getItem('saldo');

    if (saldo === null) {
        saldo = 1000000;
        localStorage.setItem('saldo', saldo);
    }

    // Mostrar el saldo en pantalla (siempre actualizado con lo último guardado en Local Storage)
    $('#saldo').text('$' + saldo);

    // Animación de entrada: la tarjeta del menú aparece con un efecto fadeIn
    $('.app-card').hide().fadeIn(500);

    // Función que muestra la leyenda y luego redirige a la pantalla
    function redirigir(nombre, pagina) {
        // La leyenda aparece con un efecto slideDown en vez de mostrarse de golpe
        $('#leyenda').empty().append(
            $('<div class="alert alert-info"></div>')
                .text('Redirigiendo a ' + nombre + '...')
                .hide()
                .slideDown(300)
        );

        // Esperar un momento para que se vea la leyenda y luego desvanecer la tarjeta antes de cambiar de pantalla
        setTimeout(() => {
            $('.app-card').fadeOut(300, function () {
                window.location.href = pagina;
            });
        }, 1200);
    }

    // Evento del botón "Depositar"
    $('#btnDepositar').on('click', function (evento) {
        // Evitar que el enlace redirija de inmediato
        evento.preventDefault();
        redirigir('depositar', 'deposit.html');
    });

    // Evento del botón "Enviar Dinero"
    $('#btnEnviar').on('click', function (evento) {
        evento.preventDefault();
        redirigir('enviar dinero', 'sendmoney.html');
    });

    // Evento del botón "Últimos movimientos"
    $('#btnMovimientos').on('click', function (evento) {
        evento.preventDefault();
        redirigir('últimos movimientos', 'transactions.html');
    });
}

// ===== Página: Depositar (deposit.html) =====
if (document.getElementById('formDeposito')) {
    // Mostrar el saldo actual al cargar la página (leído con jQuery/Local Storage)
    let saldoInicial = localStorage.getItem('saldo');

    if (saldoInicial === null) {
        saldoInicial = 1000000;
    }

    $('#saldoActual').text('$' + saldoInicial);

    // Evento del botón "Realizar depósito"
    $('#formDeposito').submit(function (evento) {
        // Evitar que el formulario recargue la página
        evento.preventDefault();

        const monto = parseFloat($('#monto').val());

        // Validar el monto ingresado
        if (isNaN(monto) || monto <= 0) {
            $('#alert-container').html('<div class="alert alert-danger">Ingrese un monto válido.</div>');
            return;
        }

        // Leer el saldo actual guardado (si es la primera vez, usar el saldo inicial)
        let saldo = localStorage.getItem('saldo');

        if (saldo === null) {
            saldo = 1000000;
        }

        // Sumar el depósito y guardar el nuevo saldo
        const nuevoSaldo = parseFloat(saldo) + monto;
        localStorage.setItem('saldo', nuevoSaldo);

        // Actualizar el saldo mostrado en pantalla
        $('#saldoActual').text('$' + nuevoSaldo);

        // Leer la lista de movimientos guardada (si no existe, empezar con una lista vacía)
        let movimientos = localStorage.getItem('movimientos');

        if (movimientos === null) {
            movimientos = [];
        } else {
            // JSON.parse convierte el texto guardado nuevamente en una lista
            movimientos = JSON.parse(movimientos);
        }

        // Agregar el movimiento a la lista y guardarla
        movimientos.push({ tipo: 'Depósito', detalle: 'Depósito a la cuenta', monto: monto });
        // JSON.stringify convierte la lista en texto para poder guardarla
        localStorage.setItem('movimientos', JSON.stringify(movimientos));

        // Mostrar la leyenda con el monto depositado
        $('#montoDepositado').html('<p class="text-center text-muted mb-2">Monto depositado: $' + monto + '</p>');

        // Crear dinámicamente la alerta de Bootstrap con jQuery y agregarla al contenedor
        const alertaExito = $('<div class="alert alert-success"></div>')
            .text('Depósito realizado con éxito. Nuevo saldo: $' + nuevoSaldo + '. Redirigiendo a menú principal...');
        $('#alert-container').html(alertaExito);

        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 2000);
    });

    // Evento del botón "Ir al Menú Principal"
    $('#btnMenu').on('click', function (evento) {
        // Evitar que el enlace redirija de inmediato
        evento.preventDefault();

        // Mostrar la leyenda y redirigir
        $('#alert-container').html('<div class="alert alert-info">Redirigiendo a menú principal...</div>');

        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 1500);
    });
}

// ===== Página: Enviar Dinero (sendmoney.html) =====
if (document.getElementById('btnAgregar')) {
    // Modal de Bootstrap para el formulario emergente (mostrar/ocultar el formulario)
    const modalContacto = new bootstrap.Modal(document.getElementById('modalContacto'));

    // Fila del contacto seleccionado y su nombre
    let contactoSeleccionado = null;
    let nombreSeleccionado = '';

    // Función que marca una fila como seleccionada
    function seleccionarContacto(fila, nombre) {
        // Quitar la selección anterior
        if (contactoSeleccionado !== null) {
            contactoSeleccionado.removeClass('table-primary');
        }

        // Marcar la fila seleccionada y guardar el nombre del contacto
        contactoSeleccionado = fila;
        contactoSeleccionado.addClass('table-primary');
        nombreSeleccionado = nombre;

        // Mostrar el botón "Enviar dinero" solo cuando hay un contacto seleccionado
        $('#btnEnviar').removeClass('d-none');
    }

    // Agregar el evento de selección a las filas que ya existen en la tabla
    $('#listaContactos tr').on('click', function () {
        const fila = $(this);
        // El nombre es la primera parte del texto de la fila, antes de " CBU:"
        const nombre = fila.text().split(' CBU:')[0];
        seleccionarContacto(fila, nombre);
    });

    // Evento del botón "Agregar nuevo contacto": muestra el formulario emergente
    $('#btnAgregar').on('click', function () {
        $('#errorContacto').html('');
        modalContacto.show();
    });

    // Evento del botón "Cancelar": oculta el formulario sin guardar
    $('#btnCancelarContacto').on('click', function () {
        $('#errorContacto').html('');
        $('#formContacto')[0].reset();
        modalContacto.hide();
    });

    // Evento del formulario emergente: validar y guardar el nuevo contacto
    $('#formContacto').submit(function (evento) {
        // Evitar que la página se recargue
        evento.preventDefault();

        const nombre = $('#nombre').val().trim();
        const cbu = $('#cbu').val().trim();
        const alias = $('#alias').val().trim();
        const banco = $('#banco').val().trim();

        // Validar que ningún campo obligatorio esté vacío
        if (nombre === '' || cbu === '' || alias === '' || banco === '') {
            $('#errorContacto').html('<div class="alert alert-danger">Complete todos los campos.</div>');
            return;
        }

        // Validar que el CBU tenga el formato correcto: 22 dígitos numéricos
        if (!/^\d{22}$/.test(cbu)) {
            $('#errorContacto').html('<div class="alert alert-danger">El CBU debe tener 22 dígitos numéricos.</div>');
            return;
        }

        $('#errorContacto').html('');

        // Crear la nueva fila y agregarla a la tabla
        const fila = $('<tr></tr>').html('<td>' + nombre + ' CBU: ' + cbu + ', Alias: ' + alias + ',<br>Banco: ' + banco + '</td>');
        $('#listaContactos').append(fila);

        // La nueva fila también se puede seleccionar al hacer clic
        fila.on('click', function () {
            seleccionarContacto(fila, nombre);
        });

        // Limpiar el formulario y cerrar el modal
        $('#formContacto')[0].reset();
        modalContacto.hide();
    });

    // Devuelve el nombre de un contacto a partir del texto de su fila
    function obtenerNombreFila(fila) {
        return fila.text().split(' CBU:')[0].trim();
    }

    // Muestra u oculta las filas de la tabla según el término buscado
    function filtrarContactos(termino) {
        $('#listaContactos tr').each(function () {
            const texto = $(this).text().toLowerCase();
            $(this).toggle(termino === '' || texto.includes(termino));
        });
    }

    // Autocompletar: arma la lista de sugerencias mientras se escribe en el buscador
    function mostrarSugerencias(termino) {
        const sugerencias = $('#sugerencias');

        if (termino === '') {
            sugerencias.addClass('d-none').empty();
            return;
        }

        const coincidencias = $('#listaContactos tr:visible');

        if (coincidencias.length === 0) {
            sugerencias.addClass('d-none').empty();
            return;
        }

        sugerencias.empty();

        // Crear una sugerencia por cada contacto que coincide con el término
        coincidencias.each(function () {
            const fila = $(this);
            const nombre = obtenerNombreFila(fila);

            const item = $('<li></li>')
                .addClass('list-group-item list-group-item-action')
                .text(nombre);

            // Al hacer clic en una sugerencia, se completa el buscador y se selecciona el contacto
            item.on('click', function () {
                $('#buscar').val(nombre);
                sugerencias.addClass('d-none').empty();
                filtrarContactos('');
                seleccionarContacto(fila, nombre);
                fila[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            sugerencias.append(item);
        });

        sugerencias.removeClass('d-none');
    }

    // Evento: cada tecla presionada filtra la tabla y actualiza las sugerencias (autocompletar en vivo)
    $('#buscar').on('input', function () {
        const termino = $(this).val().trim().toLowerCase();
        filtrarContactos(termino);
        mostrarSugerencias(termino);
    });

    // Ocultar las sugerencias al hacer clic fuera del buscador
    $(document).on('click', function (evento) {
        if ($(evento.target).closest('#formBuscar').length === 0) {
            $('#sugerencias').addClass('d-none').empty();
        }
    });

    // Evento del formulario de búsqueda: al enviar (Enter o botón "Buscar") solo se ocultan las sugerencias
    $('#formBuscar').submit(function (evento) {
        evento.preventDefault();
        $('#sugerencias').addClass('d-none').empty();
    });

    // Evento del botón "Enviar dinero"
    $('#btnEnviar').on('click', function () {
        // Validar que haya un contacto seleccionado
        if (contactoSeleccionado === null) {
            $('#mensaje').html('<div class="alert alert-danger">Seleccione un contacto de la lista.</div>');
            return;
        }

        const monto = parseFloat($('#monto').val());

        // Validar el monto ingresado
        if (isNaN(monto) || monto <= 0) {
            $('#mensaje').html('<div class="alert alert-danger">Ingrese un monto válido.</div>');
            return;
        }

        // Leer el saldo actual guardado (si es la primera vez, usar el saldo inicial)
        let saldo = localStorage.getItem('saldo');

        if (saldo === null) {
            saldo = 1000000;
        }

        saldo = parseFloat(saldo);

        // Validar que el saldo alcance
        if (monto > saldo) {
            $('#mensaje').html('<div class="alert alert-danger">Saldo insuficiente.</div>');
            return;
        }

        // Descontar el monto y guardar el nuevo saldo
        const nuevoSaldo = saldo - monto;
        localStorage.setItem('saldo', nuevoSaldo);

        // Leer la lista de movimientos guardada (si no existe, empezar con una lista vacía)
        let movimientos = localStorage.getItem('movimientos');

        if (movimientos === null) {
            movimientos = [];
        } else {
            // JSON.parse convierte el texto guardado nuevamente en una lista
            movimientos = JSON.parse(movimientos);
        }

        // Agregar el movimiento a la lista y guardarla
        movimientos.push({ tipo: 'Envío', detalle: 'Envío a ' + nombreSeleccionado, monto: monto });
        // JSON.stringify convierte la lista en texto para poder guardarla
        localStorage.setItem('movimientos', JSON.stringify(movimientos));

        // Mostrar mensaje de confirmación y volver al menú principal
        $('#mensaje').html('<div class="alert alert-success">Envío exitoso a ' + nombreSeleccionado + '. Redirigiendo a menú principal...</div>');

        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 1500);
    });
}

// ===== Página: Últimos Movimientos (transactions.html) =====
if (document.getElementById('listaMovimientos')) {
    // Lista real de transacciones, leída del Local Storage (si no existe, empezar vacía)
    let listaTransacciones = localStorage.getItem('movimientos');

    if (listaTransacciones === null) {
        listaTransacciones = [];
    } else {
        // JSON.parse convierte el texto guardado nuevamente en una lista
        listaTransacciones = JSON.parse(listaTransacciones);
    }

    // Devuelve el tipo de transacción en un formato legible para mostrarlo en la lista
    function getTipoTransaccion(tipo) {
        const tiposLegibles = {
            'Depósito': 'Depósito',
            'Envío': 'Transferencia enviada'
        };

        return tiposLegibles[tipo] || tipo;
    }

    // Muestra los últimos movimientos según el tipo elegido en el filtro ('todos' los muestra todos)
    function mostrarUltimosMovimientos(filtro) {
        const movimientosFiltrados = listaTransacciones.filter((movimiento) => {
            return filtro === 'todos' || movimiento.tipo === filtro;
        });

        // Si no hay movimientos para ese filtro, mostrar un aviso
        if (movimientosFiltrados.length === 0) {
            $('#listaMovimientos').html('<tr><td class="text-center" colspan="2">No hay movimientos registrados.</td></tr>');
            return;
        }

        $('#listaMovimientos').empty();

        // Recorrer la lista desde el último movimiento hasta el primero (del más reciente al más antiguo)
        for (let i = movimientosFiltrados.length - 1; i >= 0; i--) {
            const movimiento = movimientosFiltrados[i];

            // Los depósitos suman y los envíos restan
            let signo = '+';
            let clase = 'text-success';

            if (movimiento.tipo === 'Envío') {
                signo = '-';
                clase = 'text-danger';
            }

            // Crear la fila con los detalles de la operación
            const fila = $('<tr></tr>').html(
                '<td><strong>' + getTipoTransaccion(movimiento.tipo) + '</strong> - ' + movimiento.detalle + '</td>' +
                '<td class="text-end ' + clase + '">' + signo + '$' + movimiento.monto + '</td>'
            );

            $('#listaMovimientos').append(fila);
        }
    }

    // Mostrar todos los movimientos al cargar la página
    mostrarUltimosMovimientos('todos');

    // Cada vez que se selecciona un tipo de transacción en el filtro, actualizar la lista
    $('#filtroTipo').on('change', function () {
        mostrarUltimosMovimientos($(this).val());
    });
}
