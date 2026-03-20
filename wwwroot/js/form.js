const form = document.getElementById('form-articulo');
const mensaje = document.getElementById('mensaje');
const preview = document.getElementById('preview');
const inputFile = document.getElementById('imagenFile');
const inputTexto = document.getElementById('imagen');

const extensiones = ['jpg', 'png', 'webp'];

function buscarImagen(nombreBase, callback) {
    let index = 0;
    function probar() {
        if (index >= extensiones.length) {
            callback(null);
            return;
        }
        const img = new Image();
        img.src = `Imagenes/${nombreBase}.${extensiones[index]}`;
        img.onload = function () { callback(`${nombreBase}.${extensiones[index]}`); };
        img.onerror = function () { index++; probar(); };
    }
    probar();
}

inputFile.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) {
        preview.style.display = 'none';
        return;
    }
    preview.src = URL.createObjectURL(file);
    preview.style.maxWidth = '200px';
    preview.style.width = '100%';
    preview.style.display = 'block';
    preview.style.margin = '0 auto';
});

inputTexto.addEventListener('input', function () {
    let nombre = this.value.trim();
    if (!nombre) { preview.style.display = 'none'; return; }
    buscarImagen(nombre, function (resultado) {
        if (resultado) {
            preview.src = `Imagenes/${resultado}`;
            preview.style.maxWidth = '200px';
            preview.style.width = '100%';
            preview.style.display = 'block';
            preview.style.margin = '0 auto';
        } else {
            preview.style.display = 'none';
        }
    });
});

if (window.location.href.includes('editar.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    fetch('/api/articulos')
        .then(res => res.json())
        .then(data => {
            const art = data.find(a => a.id == id);
            if (!art) return;
            document.getElementById('id').value = art.id;
            document.getElementById('nombre').value = art.nombre;
            document.getElementById('stock').value = art.stock;
            inputTexto.value = art.imagen.split('.').slice(0, -1).join('.');
            preview.src = `Imagenes/${art.imagen}`;
            preview.style.maxWidth = '200px';
            preview.style.width = '100%';
            preview.style.display = 'block';
            preview.style.margin = '0 auto';
        });
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('id') ? document.getElementById('id').value : null;
    const nombre = document.getElementById('nombre').value;
    const stock = document.getElementById('stock').value;
    const nombreTexto = inputTexto.value.trim();
    const file = inputFile.files[0];

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('stock', stock);

    if (file) {
        formData.append('imagen', file);
    } else if (nombreTexto) {
        formData.append('nombreImagenTexto', nombreTexto);
    }

    if (id) {
        fetch(`/api/articulos/${id}`, {
            method: 'PUT',
            body: formData
        })
            .then(res => res.text())
            .then(text => {
                mensaje.innerText = text;
                setTimeout(() => window.location.href = 'index.html', 1000);
            });
    } else {
        fetch('/api/articulos', {
            method: 'POST',
            body: formData
        })
            .then(res => res.text())
            .then(text => {
                mensaje.innerText = text;
                setTimeout(() => window.location.href = 'index.html', 1000);
            });
    }
});