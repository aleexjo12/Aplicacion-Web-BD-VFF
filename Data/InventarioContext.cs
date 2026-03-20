using Microsoft.EntityFrameworkCore;
using Proyecto_final_BD.Models;

namespace Proyecto_final_BD.Data
{
    public class InventarioContext : DbContext
    {
        public InventarioContext(DbContextOptions<InventarioContext> options) : base(options)
        {
        }

        public DbSet<Articulo> Articulos { get; set; }
    }
}