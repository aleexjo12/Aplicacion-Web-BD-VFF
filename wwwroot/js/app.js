let articulos = [];

async function cargarArticulos() {
    const res = await fetch('/api/articulos');
    articulos = await res.json();
    mostrarArticulos(articulos);
}

function limpiarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 ]/g, '')
        .trim();
}

function mostrarArticulos(lista) {
    const cont = document.getElementById('lista-articulos');
    cont.innerHTML = '';

    lista.forEach(a => {
        cont.innerHTML += `
            <li class="producto">
                <img src="Imagenes/${a.imagen}" alt="${a.nombre}">
                <div class="producto-info">
                    <h3>${a.nombre}</h3>
                    <p>Stock: <b>${a.stock}</b></p>
                    <div class="acciones">
                        <button class="btn editar" onclick="editar(${a.id})">Editar</button>
                        <button class="btn borrar" onclick="borrar(${a.id})">Borrar</button>
                    </div>
                </div>
            </li>
        `;
    });
}

function ordenar(asc) {
    articulos.sort((a, b) => asc ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre));
    mostrarArticulos(articulos);
}

document.getElementById('buscador').addEventListener('input', e => {
    const filtro = limpiarTexto(e.target.value);

    mostrarArticulos(
        articulos.filter(a => {
            const nombre = limpiarTexto(a.nombre);
            return nombre.includes(filtro);
        })
    );
});

function editar(id) { window.location.href = `editar.html?id=${id}`; }

async function borrar(id) {
    if (confirm('¿Seguro que quieres eliminar?')) {
        await fetch(`/api/articulos/${id}`, { method: 'DELETE' });
        cargarArticulos();
    }
}

cargarArticulos();