using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Proyecto_final_BD.Data;
using Proyecto_final_BD.Models;

namespace Proyecto_final_BD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticulosController : ControllerBase
    {
        private readonly InventarioContext _context;

        public ArticulosController(InventarioContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Articulo>>> GetArticulos()
        {
            return await _context.Articulos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Articulo>> GetArticulo(int id)
        {
            var articulo = await _context.Articulos.FindAsync(id);
            if (articulo == null) return NotFound();
            return articulo;
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        public async Task<ActionResult> CrearArticulo(
            [FromForm] string nombre,
            [FromForm] int stock,
            [FromForm] Microsoft.AspNetCore.Http.IFormFile? imagen,
            [FromForm] string? nombreImagenTexto)
        {
            string nombreArchivo = null;

            if (imagen != null && imagen.Length > 0)
            {
                nombreArchivo = System.IO.Path.GetFileName(imagen.FileName);
                var path = System.IO.Path.Combine("wwwroot/Imagenes", nombreArchivo);
                using var stream = new System.IO.FileStream(path, System.IO.FileMode.Create);
                await imagen.CopyToAsync(stream);
            }
            else if (!string.IsNullOrEmpty(nombreImagenTexto))
            {
                nombreArchivo = nombreImagenTexto;
            }

            var articulo = new Articulo
            {
                Nombre = nombre,
                Stock = stock,
                Imagen = (nombreArchivo ?? "default.png")!
            };

            _context.Articulos.Add(articulo);
            await _context.SaveChangesAsync();
            return Ok("Artículo agregado correctamente");
        }

        [HttpPut("{id}")]
        [DisableRequestSizeLimit]
        public async Task<ActionResult> EditarArticulo(
            int id,
            [FromForm] string nombre,
            [FromForm] int stock,
            [FromForm] Microsoft.AspNetCore.Http.IFormFile? imagen,
            [FromForm] string? nombreImagenTexto)
        {
            var a = await _context.Articulos.FindAsync(id);
            if (a == null) return NotFound();

            a.Nombre = nombre;
            a.Stock = stock;

            if (imagen != null && imagen.Length > 0)
            {
                string nombreArchivo = System.IO.Path.GetFileName(imagen.FileName);
                var path = System.IO.Path.Combine("wwwroot/Imagenes", nombreArchivo);
                using var stream = new System.IO.FileStream(path, System.IO.FileMode.Create);
                await imagen.CopyToAsync(stream);
                a.Imagen = nombreArchivo!;
            }
            else if (!string.IsNullOrEmpty(nombreImagenTexto))
            {
                a.Imagen = nombreImagenTexto!;
            }

            await _context.SaveChangesAsync();
            return Ok("Artículo actualizado correctamente");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> BorrarArticulo(int id)
        {
            var a = await _context.Articulos.FindAsync(id);
            if (a == null) return NotFound();

            _context.Articulos.Remove(a);
            await _context.SaveChangesAsync();
            return Ok("Artículo eliminado correctamente");
        }
    }
}