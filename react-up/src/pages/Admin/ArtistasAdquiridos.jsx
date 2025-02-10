//Modulo de Artistas Adquiridos
// Importación de dependencias
import { useState } from "react";
import Swal from "sweetalert2"; // Para alertas estilizadas
import { motion } from "framer-motion"; // Para animaciones
import { Bar } from "react-chartjs-2"; // Componente de gráfico de barras
import {
  FiEye,
  FiEdit,
  FiDownload,
  FiFileText,
  FiPlus,
  FiDollarSign,
} from "react-icons/fi"; // Íconos de Feather
import PropTypes from "prop-types"; // Validación de props
import * as XLSX from "xlsx"; // Para exportar a Excel
import { Chart as ChartJS } from "chart.js/auto"; // Configuración de Chart.js

const ArtistAcquisition = () => {
  // Estado principal que almacena todas las transacciones
  const [transacciones, setTransacciones] = useState([
    {
      nombre: "Bad Bunny",
      tipo: "compra", // Tipo de transacción (compra/venta)
      fechaInicio: "2023-01-01",
      fechaFin: "2024-01-01",
      monto: 100000,
      exclusividad: "exclusivo",
      contrato: null, // Archivo PDF del contrato
      estado: "adquirido", // Estado de la transacción
      terminos: "Términos del contrato...",
      articulos: [ // Artículos asociados a la transacción
        {
          id: 1,
          nombre: "Camiseta",
          precio: 25,
          stock: 100,
          vendidos: 45,
          foto: null, // Imagen del producto
        },
        // ... más artículos
      ],
    },
  ]);

  // Estados para controlar la visualización de modales
  const [modalCrear, setModalCrear] = useState(false); // Modal de creación
  const [modalEditar, setModalEditar] = useState(false); // Modal de edición
  const [modalVer, setModalVer] = useState(false); // Modal de visualización
  const [isCompra, setIsCompra] = useState(false); // Determina el tipo de operación (compra/venta)
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda para filtrar
  const [currentIndex, setCurrentIndex] = useState(null); // Índice de la transacción actual
  const [selectedArtist, setSelectedArtist] = useState(null); // Artista seleccionado (actualmente no usado)
  // Estado para nuevo artículo en formulario
  const [nuevoArticulo, setNuevoArticulo] = useState({
    nombre: "",
    precio: 0,
    stock: 0,
    foto: null,
  });

  // Estado para datos del formulario de transacción
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "compra",
    fechaInicio: "",
    fechaFin: "",
    monto: 0,
    contrato: null,
    estado: "adquirido",
    terminos: "",
    articulos: [],
  });

  // Manejo de apertura/cierre de modales
  const openModalCrear = () => setModalCrear(true);
  const closeModalCrear = () => setModalCrear(false);

  const openModalEditar = (index) => {
    setCurrentIndex(index);
    setFormData(transacciones[index]);
    setIsCompra(transacciones[index].tipo === "compra"); // Configura el tipo de modal
    setModalEditar(true);
  };
  const closeModalEditar = () => setModalEditar(false);

  const openModalVer = (index) => {
    setCurrentIndex(index);
    setModalVer(true);
  };
  const closeModalVer = () => setModalVer(false);

  // Maneja cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    // Actualiza el estado, manejando archivos y valores normales
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Validación de formulario
  const validateForm = () => {
    return (
      formData.nombre &&
      formData.fechaInicio &&
      (isCompra ? formData.fechaFin : true) && // en venta no se requiere fechaFin (se asigna "finalizo")
      formData.monto > 0
    );
  };

  // Acciones CRUD
  const handleAddTransaccion = () => {
    if (!validateForm()) {
      Swal.fire(
        "Error",
        "Todos los campos requeridos deben estar completos",
        "error"
      );
      return;
    }

    // Se agregan los campos automáticos según el modo
    const newTransaction = {
      ...formData,
      tipo: isCompra ? "compra" : "venta",
      estado: isCompra ? "adquirido" : "vendido",
      // En modo venta se fuerza el valor "finalizo" en fechaFin
      fechaFin: isCompra ? formData.fechaFin : "finalizo",
    };

    setTransacciones([...transacciones, newTransaction]);
    Swal.fire("Éxito", "Transacción registrada correctamente", "success");
    closeModalCrear();
    // Reiniciamos el formData si lo deseas:
    setFormData({
      nombre: "",
      tipo: isCompra ? "compra" : "venta",
      fechaInicio: "",
      fechaFin: "",
      monto: 0,
      exclusividad: "exclusivo",
      contrato: null,
      estado: isCompra ? "adquirido" : "vendido",
      terminos: "",
      articulos: [],
    });
  };

  // Función para actualizar una transacción existente
  const handleUpdateTransaccion = () => {
    // Validar formulario antes de actualizar
    if (!validateForm()) {
      Swal.fire("Error", "Todos los campos requeridos deben estar completos", "error");
      return;
    }

    // Crear objeto de transacción actualizado
    const updatedTransaction = {
      ...formData,
      tipo: isCompra ? "compra" : "venta", // Asignar tipo según modo
      estado: isCompra ? "adquirido" : "vendido", // Determinar estado
      fechaFin: isCompra ? formData.fechaFin : "finalizo", // Ajustar fecha final para ventas
    };

    // Actualizar lista de transacciones
    const updated = [...transacciones];
    updated[currentIndex] = updatedTransaction;
    setTransacciones(updated);

    // Mostrar confirmación y cerrar modal
    Swal.fire("Éxito", "Transacción actualizada correctamente", "success");
    closeModalEditar();
  };

  // Sección de Búsqueda y Exportación
  const handleSearchChange = (e) => setSearchTerm(e.target.value); // Actualizar término de búsqueda

  const handleExportExcel = () => {
    // Crear archivo Excel con la librería XLSX
    const worksheet = XLSX.utils.json_to_sheet(transacciones);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transacciones");
    XLSX.writeFile(workbook, "transacciones_artistas.xlsx"); // Descargar archivo
  };

  // Filtrar datos basado en el término de búsqueda
  const filteredData = transacciones.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para calcular estadísticas de ventas
  const calcularEstadisticas = (articulos) => {
    return {
      totalVendido: articulos.reduce((sum, art) => sum + art.vendidos, 0), // Sumar unidades vendidas
      ingresosTotales: articulos.reduce( // Calcular ingresos totales
        (sum, art) => sum + art.vendidos * art.precio,
        0
      ),
      articuloMasVendido: articulos.reduce( // Encontrar artículo más popular
        (max, art) => (art.vendidos > max.vendidos ? art : max),
        { vendidos: -1 }
      ),
    };
  };

  // Función para agregar nuevo artículo con validación
  const agregarArticulo = () => {
    // Validar campos requeridos
    if (!nuevoArticulo.nombre || nuevoArticulo.precio <= 0 || nuevoArticulo.stock <= 0) {
      Swal.fire("Error", "Todos los campos del artículo son requeridos", "error");
      return;
    }

    // Buscar artista seleccionado y agregar artículo
    const updated = [...transacciones];
    const artista = updated.find((a) => a.nombre === selectedArtist);

    if (artista) {
      artista.articulos.push({
        ...nuevoArticulo,
        id: Date.now(), // ID único basado en timestamp
        vendidos: 0, // Inicializar vendidos en 0
      });
      setTransacciones(updated);
      // Resetear formulario y mostrar confirmación
      setNuevoArticulo({ nombre: "", precio: 0, stock: 0, foto: null });
      Swal.fire("Éxito", "Artículo agregado correctamente", "success");
    }
  };

  // JSX - Interfaz de usuario principal
  return (
    <div className="p-8 min-h-screen bg-cover bg-center bg-[url('/fondo.gif')]">
      {/* Encabezado con título y botón de acción */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between p-4 md:ml-72 text-white rounded-lg bg-[url('/img/dc.jpg')] bg-cover bg-center"
        style={{ borderRadius: "20px" }}
      >
        {/* Título responsive con tamaño dinámico */}
        <p
          className="text-center sm:text-left text-2xl sm:text-4xl"
          style={{ fontSize: "clamp(25px, 8vw, 60px)" }}
        >
          Gestión de Artistas
        </p>

        {/* Botón animado para nueva transacción */}
        <div className="mt-4 sm:mt-0">
          <motion.button
            onClick={() => {
              setIsCompra(true); // Establecer modo compra
              openModalCrear(); // Abrir modal de creación
            }}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg hover:bg-[#067b80] hover:scale-105 transition-all"
          >
            Comprar Artista
          </motion.button>
        </div>
      </div>

      {/* Sección de Controles: Búsqueda y Exportación */}
      <div className="md:ml-72 p-4 mx-auto bg-gray-100 rounded-lg shadow-lg mt-4 flex justify-center" style={{ backgroundColor: "#f1f8f9", borderRadius: "20px" }}>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Input de búsqueda con manejo de estado */}
          <input
            type="text"
            placeholder="Buscar artista..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2 rounded-lg w-64"
          />

          {/* Botón animado para exportar a Excel */}
          <motion.button
            onClick={handleExportExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiDownload /> Exportar
          </motion.button>
        </div>
      </div>


      {/* Tabla principal de datos */}
      <div className="md:ml-72 p-4 mt-4 rounded-lg overflow-auto" style={{ backgroundColor: "rgba(241, 248, 249, 0.6)", borderRadius: "20px" }}>
        <div className="overflow-x-auto">
          {/* Tabla responsive con fondo semitransparente */}
          <table className="min-w-full table-auto rounded-lg shadow-md bg-white bg-opacity-80">
            <thead className="bg-gray-200">
              <tr>
                {/* Encabezados de la tabla */}
                <th className="p-3">Artista</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Vigencia</th>
                <th className="p-3">Monto</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapeo de datos filtrados a filas de la tabla */}
              {filteredData.map((item, index) => (
                <motion.tr
                  key={index}
                  className={`border-t ${item.estado === "inactivo" ? "bg-gray-200" : "hover:bg-gray-50"}`}
                  // Animaciones de entrada/salida
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Celda de nombre del artista */}
                  <td className="p-3">{item.nombre}</td>

                  {/* Celda de tipo de transacción (capitalizada) */}
                  <td className="p-3 capitalize">{item.tipo}</td>

                  {/* Rango de fechas del contrato */}
                  <td className="p-3">{item.fechaInicio} - {item.fechaFin}</td>

                  {/* Monto formateado con separadores de miles */}
                  <td className="p-3">${item.monto.toLocaleString()}</td>

                  {/* Estado con indicador visual de color */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${item.estado === "activo" || item.estado === "adquirido"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                      }`}>
                      {item.estado}
                    </span>
                  </td>

                  {/* Botones de acciones con animación hover */}
                  <td className="p-3 flex gap-2">
                    {/* Botón para gestión de ventas (solo en estado adquirido) 
                    {item.estado === "adquirido" && (
                      <motion.button
                        onClick={() => setSelectedArtist(item.nombre)}
                        className="p-2 bg-purple-500 rounded-lg"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FiDollarSign className="text-white" />
                      </motion.button>
                    )}*/}

                    {/* Botón para ver detalles */} 
                    <motion.button
                      onClick={() => openModalVer(index)}
                      className="p-2 bg-blue-500 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FiEye className="text-white" />
                    </motion.button>

                    {/* Botón para editar registro */}
                    <motion.button
                      onClick={() => openModalEditar(index)}
                      className="p-2 bg-yellow-500 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FiEdit className="text-white" />
                    </motion.button>
                    {/* Botón para editar vender */}
                    {item.estado === "adquirido" && (
                      <motion.button
                      onClick={() => {
                        setIsCompra(false); // Establece el estado de compra a true
                        openModalEditar(index); // Abre el modal en el modo de compra
                      }}
                        className="p-2 bg-green-500 text-white rounded-lg"
                        whileHover={{ scale: 1.1 }}
                      >
                        Vender
                      </motion.button>
                    )}
                  
                    {/* Botón para comprar */}
                    {item.estado === "vendido" && (
                      <motion.button
                        onClick={() => {
                          setIsCompra(true); // Establece el estado de compra a true
                          openModalEditar(index); // Abre el modal en el modo de compra
                        }}
                        className="p-2 bg-green-500 text-white rounded-lg"
                        whileHover={{ scale: 1.1 }}
                      >
                        Comprar
                      </motion.button>
                    )}


                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales de Transacción */}
      {(modalCrear || modalEditar) && (
        <ModalTransaccion
          isOpen={modalCrear || modalEditar}
          onClose={modalCrear ? closeModalCrear : closeModalEditar}
          formData={formData}
          onChange={handleInputChange}
          onSave={modalCrear ? handleAddTransaccion : handleUpdateTransaccion}
          isCompra={isCompra}
          setIsCompra={setIsCompra}
        />
      )}

      {modalVer && currentIndex !== null && (
        <ModalVer data={transacciones[currentIndex]} onClose={closeModalVer} />
      )}

      {/* Panel de Merchandising como Sidebar */}
      {selectedArtist &&
        transacciones.find((a) => a.nombre === selectedArtist)?.estado ===
        "adquirido" && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 overflow-y-auto"
          >
            <PanelMerchandising
              artista={transacciones.find((a) => a.nombre === selectedArtist)}
              onClose={() => setSelectedArtist(null)}
              nuevoArticulo={nuevoArticulo}
              setNuevoArticulo={setNuevoArticulo}
              agregarArticulo={agregarArticulo}
              calcularEstadisticas={calcularEstadisticas}
            />
          </motion.div>
        )}
    </div>
  );
};

const PanelMerchandising = ({
  artista,
  onClose,
  nuevoArticulo,
  setNuevoArticulo,
  agregarArticulo,
  calcularEstadisticas,
}) => {
  const stats = calcularEstadisticas(artista.articulos);

  const dataChart = {
    labels: artista.articulos.map((a) => a.nombre),
    datasets: [
      {
        label: "Ventas",
        data: artista.articulos.map((a) => a.vendidos),
        backgroundColor: "#0aa5a9",
      },
    ],
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-full">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold">Gestión de {artista.nombre}</h3>
        <button onClick={onClose} className="text-red-500 hover:text-red-700 text-2xl">
          &times;
        </button>
      </div>

      {/* Formulario para artículo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-lg shadow w-full">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Nombre artículo</label>
          <input
            type="text"
            placeholder="Nombre artículo"
            value={nuevoArticulo.nombre}
            onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, nombre: e.target.value })}
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Precio</label>
          <input
            type="number"
            placeholder="Precio"
            value={nuevoArticulo.precio}
            onChange={(e) =>
              setNuevoArticulo({ ...nuevoArticulo, precio: parseFloat(e.target.value) })
            }
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Stock</label>
          <input
            type="number"
            placeholder="Stock"
            value={nuevoArticulo.stock}
            onChange={(e) =>
              setNuevoArticulo({ ...nuevoArticulo, stock: parseInt(e.target.value, 10) })
            }
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Foto del Producto</label>

          <label
            htmlFor="fotoProducto"
            className="inline-block bg-[#067b80] text-white text-sm font-semibold px-4 py-2 rounded-md cursor-pointer hover:bg-[#056b6e] focus:ring-2 focus:ring-[#056b6e] focus:outline-none transition-all duration-300 text-center"
          >
            Seleccionar Imagen
          </label>

          <input
            id="fotoProducto"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNuevoArticulo({ ...nuevoArticulo, foto: e.target.files[0] })
            }
            className="hidden"
          />

          {nuevoArticulo.foto && (
            <img
              src={URL.createObjectURL(nuevoArticulo.foto)}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded shadow"
            />
          )}
        </div>
        <button
          onClick={agregarArticulo}
          className="col-span-1 sm:col-span-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center gap-2 w-full max-w-xs mx-auto"
        >
          <FiPlus /> Agregar Artículo
        </button>
      </div>

      {/* Estadísticas y gráfico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <h4 className="text-blue-600 font-bold mb-2">Total Vendido</h4>
          <p className="text-2xl md:text-3xl font-bold">{stats.totalVendido}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <h4 className="text-green-600 font-bold mb-2">Ingresos Totales</h4>
          <p className="text-2xl md:text-3xl font-bold">${stats.ingresosTotales.toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <h4 className="text-purple-600 font-bold mb-2">Artículo Más Popular</h4>
          <p className="text-lg md:text-xl">{stats.articuloMasVendido?.nombre || "N/A"}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 overflow-x-auto">
        <Bar data={dataChart} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artista.articulos.map((articulo) => (
          <div key={articulo.id} className="flex flex-wrap items-center p-4 bg-gray-50 rounded shadow w-full">
            {articulo.foto && (
              <img
                src={URL.createObjectURL(articulo.foto)}
                alt={articulo.nombre}
                className="w-16 h-16 object-cover rounded mr-4"
              />
            )}
            <div className="flex-1">
              <h4 className="font-bold">{articulo.nombre}</h4>
              <p className="text-sm text-gray-700">Stock: {articulo.stock} | Vendidos: {articulo.vendidos}</p>
            </div>
            <span className="text-xl font-bold text-green-600">${articulo.precio}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ModalTransaccion = ({ isOpen, onClose, formData, onChange, onSave, isCompra, setIsCompra }) => {
  if (!isOpen) return null;

  const handleToggleMode = () => {
    const nuevoModo = !isCompra;
    setIsCompra(nuevoModo);
    setTimeout(() => {
      onChange({ target: { name: "tipo", value: nuevoModo ? "compra" : "venta" } });
      onChange({ target: { name: "estado", value: nuevoModo ? "adquirido" : "vendido" } });
    }, 0);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg w-full max-w-lg sm:max-w-2xl md:max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
            {isCompra ? "Compra de Artista" : "Venta de Artista"}
          </h2>
          
          {/*<button
            onClick={handleToggleMode}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 w-full sm:w-auto"
          >
            Cambiar a {isCompra ? "Venta" : "Compra"}
          </button> */}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Tipo</label>
          <input
            type="text"
            value={isCompra ? "compra" : "venta"}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Nombre del Artista</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Monto ({isCompra ? "Costo" : "Precio"})</label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Fecha Inicio Contrato</label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Fecha Fin Contrato</label>
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-2">
              {isCompra ? "Contrato PDF" : "Acuerdo de Compra-Venta"}
            </label>
            <label className="w-full p-3 border rounded-md bg-[#067b80] text-white cursor-pointer flex items-center justify-center font-semibold hover:bg-[#056b6e] focus:ring-2 focus:ring-[#056b6e] transition-all duration-300">
              <FiFileText className="mr-2 text-lg" />
              {isCompra
                ? formData.contrato
                  ? formData.contrato.name
                  : "Contrato"
                : formData.acuerdo
                  ? formData.acuerdo.name
                  : "Acuerdo"}
              <input
                type="file"
                name={isCompra ? "contrato" : "acuerdo"}
                onChange={onChange}
                className="hidden"
                accept=".pdf"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
          <motion.button
            onClick={onSave}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            disabled={!formData.nombre || !formData.monto || !formData.fechaInicio || !formData.fechaFin}
          >
            Guardar
          </motion.button>
          <motion.button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
          >
            Cancelar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};


// Componente Modal para Ver Detalles
const ModalVer = ({ data, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg w-full max-w-2xl"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-4">Detalles de Transacción</h2>
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Artista:</label>
            <p>{data.nombre}</p>
          </div>
          <div>
            <label className="font-semibold">Tipo:</label>
            <p className="capitalize">{data.tipo}</p>
          </div>
          <div>
            <label className="font-semibold">Periodo de Contrato:</label>
            <p>
              {data.fechaInicio} - {data.fechaFin}
            </p>
          </div>
          <div>
            <label className="font-semibold">Monto:</label>
            <p>${data.monto.toLocaleString()}</p>
          </div>
          <div>
            <label className="font-semibold">Documentación:</label>
            {data.contrato && (
              <a
                href={URL.createObjectURL(data.contrato)}
                download
                className="text-blue-500 hover:underline flex items-center"
              >
                <FiFileText className="mr-2" /> Descargar Contrato
              </a>
            )}
          </div>
          <div>
            <label className="font-semibold">Términos:</label>
            <p className="whitespace-pre-wrap">{data.terminos}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-gray-500 text-white px-6 py-2 rounded-lg float-right"
        >
          Cerrar
        </button>
      </motion.div>
    </motion.div>
  );
};

ModalTransaccion.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isCompra: PropTypes.bool.isRequired,
  setIsCompra: PropTypes.func.isRequired,
};

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

// Definición de PropTypes
PanelMerchandising.propTypes = {
  artista: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    articulos: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nombre: PropTypes.string.isRequired,
        precio: PropTypes.number.isRequired,
        stock: PropTypes.number.isRequired,
        vendidos: PropTypes.number.isRequired,
        foto: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Puede ser una URL o un archivo
      })
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  nuevoArticulo: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    stock: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    foto: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Puede ser una URL o un archivo
  }).isRequired,
  setNuevoArticulo: PropTypes.func.isRequired,
  agregarArticulo: PropTypes.func.isRequired,
  calcularEstadisticas: PropTypes.func.isRequired,
};
export default ArtistAcquisition;
