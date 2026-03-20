using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Proyecto_final_BD.Models
{
    [Table("articulos")]
    public class Articulo
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("nombre")]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [Column("stock")]
        public int Stock { get; set; }

        [Required]
        [Column("imagen")]
        [StringLength(255)]
        public string Imagen { get; set; } = string.Empty;
    }
}