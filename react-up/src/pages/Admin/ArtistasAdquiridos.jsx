// ===================== IMPORTACIONES =====================
// React y utilidades necesarias
import { useState, useRef } from "react";
import PropTypes from "prop-types";

// Librerías externas
import Swal from "sweetalert2"; // Para alertas estilizadas
import { motion } from "framer-motion"; // Para animaciones
import { Bar } from "react-chartjs-2"; // Gráfico de barras
import * as XLSX from "xlsx"; // Para importar/exportar archivos Excel

// Íconos de Feather
import { FiUpload, FiEye, FiEdit, FiDownload, FiFileText, FiPlus, FiShoppingBag, FiShoppingCart, FiRefreshCcw } from "react-icons/fi";

// Configuración de Chart.js
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// ===================== COMPONENTE PRINCIPAL =====================
const ArtistAcquisition = () => {
  // ----- Estados Generales y de Vista -----
  // Controla la vista principal o la vista de merchandising
  const [activeView, setActiveView] = useState("main");

  // ----- Estado de las Transacciones (Artistas) -----
  const [transacciones, setTransacciones] = useState([
    {
      nombre: "Bad Bunny",
      tipo: "compra", // "compra" o "venta"
      fechaInicio: "2023-01-01",
      fechaFin: "2024-01-01",
      monto: 100000,
      exclusividad: "exclusivo",
      contrato: null, // Archivo PDF del contrato de compra
      estado: "adquirido", // Estado inicial de la transacción
      terminos: "Términos del contrato...",
      articulos: [
        {
          id: 1,
          nombre: "Camiseta",
          precio: 25,
          stock: 100,
          vendidos: 45,
          foto: null,
        },
      ],
    },
  ]);

  // ----- Estados para control de Modales (Compra, Edición, Visualización, Venta) -----
  const [modalCrear, setModalCrear] = useState(false); // Modal para crear transacción (compra)
  const [modalEditar, setModalEditar] = useState(false); // Modal para editar transacción (compra)
  const [modalVer, setModalVer] = useState(false);       // Modal para visualizar detalles
  const [modalVenta, setModalVenta] = useState(false);   // Modal exclusivo para realizar la venta
  const [isCompra, setIsCompra] = useState(false);         // Determina si se está realizando una compra o venta (para modal de compra/edición)
  const [searchTerm, setSearchTerm] = useState("");        // Término de búsqueda para filtrar artistas
  const [currentIndex, setCurrentIndex] = useState(null);  // Índice de la transacción (artista) seleccionada
  const [selectedArtist, setSelectedArtist] = useState(null); // Para seleccionar un artista en el panel de merchandising

  // ----- Estado para agregar un nuevo Artículo en Merchandising -----
  const [nuevoArticulo, setNuevoArticulo] = useState({
    nombre: "",
    precio: 0,
    stock: 0,
    foto: null,
  });

  // ----- Estado para datos del formulario de Transacción (Compra/Edición) -----
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

  // ===================== FUNCIONES DE MODALES (COMPRA/EDICIÓN) =====================
  // Abre el modal de creación (compra)
  const openModalCrear = () => setModalCrear(true);
  // Cierra el modal de creación
  const closeModalCrear = () => setModalCrear(false);

  // Abre el modal de edición (compra)
  const openModalEditar = (index) => {
    setCurrentIndex(index);
    setFormData(transacciones[index]);
    setIsCompra(transacciones[index].tipo === "compra");
    setModalEditar(true);
  };
  // Cierra el modal de edición
  const closeModalEditar = () => setModalEditar(false);

  // Abre el modal para visualizar detalles
  const openModalVer = (index) => {
    setCurrentIndex(index);
    setModalVer(true);
  };
  // Cierra el modal de visualización
  const closeModalVer = () => setModalVer(false);

  // ===================== FUNCIONES DEL MODAL DE VENTA (INDEPENDIENTE) =====================
  // Abre el modal de venta y carga la transacción (artista) seleccionada
  const openModalVenta = (index) => {
    setCurrentIndex(index);
    // Se carga la transacción seleccionada y se inicializan campos exclusivos para la venta
    setFormData(transacciones[index]);
    setFormData((prev) => ({
      ...prev,
      montoVenta: prev.monto,  // Precio de venta (puede ser modificado)
      fechaVenta: "",          // Fecha de venta (para que el usuario la ingrese)
      acuerdoVenta: null,      // Archivo PDF del acuerdo de venta
    }));
    setModalVenta(true);
  };
  // Cierra el modal de venta
  const closeModalVenta = () => setModalVenta(false);

  // ===================== MANEJO DE INPUTS =====================
  // Función que maneja los cambios en los inputs de los formularios (compra, edición, venta)
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ===================== VALIDACIÓN DEL FORMULARIO (Compra/Edición) =====================
  const validateForm = () => {
    return (
      formData.nombre &&
      formData.fechaInicio &&
      (isCompra ? formData.fechaFin : true) && // En venta no se requiere fechaFin (se asigna "finalizo")
      formData.monto > 0
    );
  };

  // ===================== ACCIONES CRUD (Compra/Edición) =====================
  // Agregar una nueva transacción (compra)
  const handleAddTransaccion = () => {
    if (!validateForm()) {
      Swal.fire("Error", "Todos los campos requeridos deben estar completos", "error");
      return;
    }

    const newTransaction = {
      ...formData,
      tipo: isCompra ? "compra" : "venta",
      estado: isCompra ? "adquirido" : "vendido",
      fechaFin: isCompra ? formData.fechaFin : "finalizo",
    };

    setTransacciones([...transacciones, newTransaction]);
    Swal.fire("Éxito", "Transacción registrada correctamente", "success");
    closeModalCrear();
    // Reinicia el formulario
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

  // Actualizar una transacción existente (compra)
  const handleUpdateTransaccion = () => {
    if (!validateForm()) {
      Swal.fire("Error", "Todos los campos requeridos deben estar completos", "error");
      return;
    }

    const updatedTransaction = {
      ...formData,
      tipo: isCompra ? "compra" : "venta",
      estado: isCompra ? "adquirido" : "vendido",
      fechaFin: isCompra ? formData.fechaFin : "finalizo",
    };

    const updated = [...transacciones];
    updated[currentIndex] = updatedTransaction;
    setTransacciones(updated);
    Swal.fire("Éxito", "Transacción actualizada correctamente", "success");
    closeModalEditar();
  };

  // ===================== CONFIRMAR VENTA =====================
  // Se usa en el ModalVenta para confirmar la operación de venta
  const handleVentaTransaccion = () => {
    const updatedTransaction = {
      ...formData,
      // Si se ingresa un precio de venta, se usa; de lo contrario se mantiene el precio original
      monto: formData.montoVenta || formData.monto,
      // Se almacena la fecha de venta (o se puede sobreescribir fechaInicio si se prefiere)
      fechaVenta: formData.fechaVenta || formData.fechaInicio,
      // Se almacena el acuerdo de venta (si fue cargado)
      acuerdoVenta: formData.acuerdoVenta || null,
      tipo: "venta",
      estado: "vendido",
      fechaFin: "finalizo",
    };

    const updated = [...transacciones];
    updated[currentIndex] = updatedTransaction;
    setTransacciones(updated);
    Swal.fire("Éxito", "Artista vendido correctamente", "success");
    closeModalVenta();
  };

  // ===================== RESTAURAR ARTISTA =====================
  // Función para restaurar un artista (pasar de "vendido" a "adquirido")
  const handleRestore = (index) => {
    const updated = [...transacciones];
    updated[index].estado = "adquirido";
    setTransacciones(updated);
    Swal.fire("Éxito", "Artista restaurado a adquirido", "success");
  };

  // ===================== BUSQUEDA Y EXPORTACIÓN =====================
  // Maneja el cambio en el input de búsqueda
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Exporta la información de transacciones a un archivo Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transacciones);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transacciones");
    XLSX.writeFile(workbook, "transacciones_artistas.xlsx");
  };

  // Filtra las transacciones según el término de búsqueda
  const filteredData = transacciones.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ===================== ESTADÍSTICAS Y AGREGAR ARTÍCULOS (MERCHANDISING) =====================
  // Calcula estadísticas básicas de ventas a partir de los artículos del artista
  const calcularEstadisticas = (articulos) => {
    return {
      totalVendido: articulos.reduce((sum, art) => sum + art.vendidos, 0),
      ingresosTotales: articulos.reduce((sum, art) => sum + art.vendidos * art.precio, 0),
      articuloMasVendido: articulos.reduce(
        (max, art) => (art.vendidos > max.vendidos ? art : max),
        { vendidos: -1 }
      ),
    };
  };

  // Función para agregar un nuevo artículo al merchandising
  const agregarArticulo = () => {
    if (!nuevoArticulo.nombre || nuevoArticulo.precio <= 0 || nuevoArticulo.stock <= 0) {
      Swal.fire("Error", "Todos los campos del artículo son requeridos", "error");
      return;
    }

    const updated = [...transacciones];
    const artista = updated.find((a) => a.nombre === selectedArtist);

    if (artista) {
      artista.articulos.push({
        ...nuevoArticulo,
        id: Date.now(),
        vendidos: 0,
      });
      setTransacciones(updated);
      setNuevoArticulo({ nombre: "", precio: 0, stock: 0, foto: null });
      Swal.fire("Éxito", "Artículo agregado correctamente", "success");
    }
  };

  // ===================== VISTA: PANEL DE MERCHANDISING =====================
  // Si la vista activa es "merchandising", se muestra el panel correspondiente
  if (activeView === "merchandising") {
    const currentArtist = transacciones.find((a) => a.nombre === selectedArtist);
    if (!currentArtist) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="mb-4 text-xl">No se ha seleccionado un artista para Merchandising.</p>
          <button
            onClick={() => setActiveView("main")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Volver
          </button>
        </div>
      );
    }
    return (
      // ===================== PANTALLA DE MERCHANDISING =====================
      // Se eliminó cualquier referencia a "fecha de regreso" ya que se repetía.
      // El encabezado muestra el título y una "X" que, al hacer clic, cierra el panel y regresa a la pantalla principal.
      <div className="min-h-screen bg-cover bg-center bg-[url('/fondo.gif')] p-4 md:ml-72">
        <div className="flex justify-between items-center p-4">
          
        </div>
        <PanelMerchandising
          artista={currentArtist}
          onClose={() => {
            setActiveView("main");
            setSelectedArtist(null);
          }}
          nuevoArticulo={nuevoArticulo}
          setNuevoArticulo={setNuevoArticulo}
          agregarArticulo={agregarArticulo}
          calcularEstadisticas={calcularEstadisticas}
        />
      </div>
    );
  }

  // ===================== VISTA PRINCIPAL =====================
  return (
    <div className="p-8 min-h-screen bg-cover bg-center bg-[url('/fondo.gif')] md:ml-72">
      {/* -------- Encabezado Principal -------- */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between p-4 text-white rounded-lg bg-[url('/img/dc.jpg')] bg-cover bg-center"
        style={{ borderRadius: "20px" }}
      >
        <p className="text-center sm:text-left text-2xl sm:text-4xl" style={{ fontSize: "clamp(25px, 8vw, 60px)" }}>
          Gestión de Artistas
        </p>
        <div className="mt-4 sm:mt-0">
          {/* Botón para comprar artista (abre el modal de creación) */}
          <motion.button
            onClick={() => {
              setIsCompra(true);
              openModalCrear();
            }}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg hover:bg-[#067b80] hover:scale-105 transition-all"
          >
            Comprar Artista
          </motion.button>
        </div>
      </div>

      {/* -------- Controles: Búsqueda y Exportación -------- */}
      <div className="p-4 mx-auto rounded-lg shadow-lg mt-4 flex justify-center" style={{ backgroundColor: "#f1f8f9", borderRadius: "20px" }}>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Buscar artista..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2 rounded-lg w-64"
          />
          <motion.button
            onClick={handleExportExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiDownload /> Exportar
          </motion.button>
        </div>
      </div>

      {/* -------- Tabla de Transacciones -------- */}
      <div className="p-4 mt-4 rounded-lg overflow-auto" style={{ backgroundColor: "rgba(241, 248, 249, 0.6)", borderRadius: "20px" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto rounded-lg shadow-md bg-white bg-opacity-80">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Artista</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Vigencia</th>
                <th className="p-3">Monto</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <motion.tr
                  key={index}
                  className={`border-t ${item.estado === "inactivo" ? "bg-gray-200" : "hover:bg-gray-50"}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td className="p-3">{item.nombre}</td>
                  <td className="p-3 capitalize">{item.tipo}</td>
                  <td className="p-3">
                    {item.fechaInicio} - {item.fechaFin}
                  </td>
                  <td className="p-3">${item.monto.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        item.estado === "activo" || item.estado === "adquirido"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    {/* Botón para ver detalles */}
                    <motion.button
                      onClick={() => openModalVer(index)}
                      className="p-2 bg-blue-500 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                      title="Ver Detalles"
                    >
                      <FiEye className="text-white" />
                    </motion.button>
                    {/* Botón para editar (compra) */}
                    <motion.button
                      onClick={() => openModalEditar(index)}
                      className="p-2 bg-yellow-500 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                      title="Editar"
                    >
                      <FiEdit className="text-white" />
                    </motion.button>
                    {/* Si el artista está en estado "adquirido", se muestran botones para vender y para acceder a merchandising */}
                    {item.estado === "adquirido" && (
                      <>
                        <motion.button
                          onClick={() => openModalVenta(index)}
                          className="p-2 bg-green-500 text-white rounded-lg"
                          whileHover={{ scale: 1.1 }}
                          title="Vender"
                        >
                          <FiShoppingCart size={20} />
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            setSelectedArtist(item.nombre);
                            setActiveView("merchandising");
                          }}
                          className="p-2 bg-indigo-500 text-white rounded-lg"
                          whileHover={{ scale: 1.1 }}
                          title="Merchandising"
                        >
                          <FiShoppingBag size={20} />
                        </motion.button>
                      </>
                    )}
                    {/* Botón para restaurar (cambia el color a bg-purple-500) */}
                    {item.estado === "vendido" && (
                      <motion.button
                        onClick={() => handleRestore(index)}
                        className="p-2 bg-purple-500 text-white rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        title="Restaurar"
                      >
                        <FiRefreshCcw size={20} />
                      </motion.button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== MODALES (Compra/Edición, Visualización, Venta) ===================== */}
      {/* Modal de Compra/Edición */}
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

      {/* Modal de Visualización */}
      {modalVer && currentIndex !== null && (
        <ModalVer data={transacciones[currentIndex]} onClose={closeModalVer} />
      )}

      {/* Modal de Venta (componente independiente) */}
      {modalVenta && currentIndex !== null && (
        <ModalVenta
          isOpen={modalVenta}
          onClose={closeModalVenta}
          formData={formData}
          onChange={handleInputChange}
          onConfirm={handleVentaTransaccion}
        />
      )}
    </div>
  );
};

// ===================== COMPONENTES SECUNDARIOS =====================

// ----- ModalTransaccion (Compra/Edición) -----
// Este modal se usa para registrar o editar una transacción de compra
const ModalTransaccion = ({ isOpen, onClose, formData, onChange, onSave, isCompra, }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg w-full max-w-lg md:max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
            {isCompra ? "Compra de Artista" : "Venta de Artista"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Campo: Nombre del Artista */}
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

          {/* Campo: Monto (Costo o Precio según el modo) */}
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

          {/* Campo: Fecha de Inicio de Contrato */}
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

          {/* Campo: Fecha Fin de Contrato */}
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

          {/* Campo: Subir archivo PDF (Contrato o Acuerdo) */}
          <div className="sm:col-span-2">
            <label className="block mb-2">
              {isCompra ? "Contrato PDF" : "Acuerdo de Compra-Venta"}
            </label>
            <label className="w-full p-3 border rounded-md bg-[#067b80] text-white cursor-pointer flex items-center justify-center font-semibold hover:bg-[#056b6e] transition-all duration-300">
              <FiFileText className="mr-2" />
              {isCompra
                ? formData.contrato
                  ? formData.contrato.name
                  : "Subir Contrato"
                : formData.acuerdo
                ? formData.acuerdo.name
                : "Subir Acuerdo"}
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

ModalTransaccion.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isCompra: PropTypes.bool.isRequired,
  setIsCompra: PropTypes.func.isRequired,
};

// ----- ModalVer (Visualización de detalles) -----
// Este modal muestra la información detallada de la transacción seleccionada
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

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

// ----- ModalVenta (Venta de Artista) -----
// Este modal es completamente independiente y se usa para registrar la venta de un artista.
// Tiene campos exclusivos: Precio de Venta, Fecha de Venta y Acuerdo de Venta.
const ModalVenta = ({ isOpen, onClose, formData, onChange, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg w-full max-w-lg md:max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        {/* Encabezado del Modal de Venta */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Venta de Artista</h2>
          {/* Botón "X" para cerrar el modal de venta */}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>

        {/* Campo: Nombre del Artista (solo lectura) */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Nombre del Artista</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Campo: Precio de Venta */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Precio de Venta</label>
          <input
            type="number"
            name="montoVenta"
            value={formData.montoVenta || ""}
            onChange={onChange}
            className="w-full p-2 border rounded"
            placeholder="Ingrese el precio de venta"
          />
        </div>

        {/* Campo: Fecha de Venta */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Fecha de Venta</label>
          <input
            type="date"
            name="fechaVenta"
            value={formData.fechaVenta || ""}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Campo: Subir Acuerdo de Venta (PDF) */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Acuerdo de Venta (PDF)</label>
          <label
            htmlFor="acuerdoVenta"
            className="inline-block bg-[#067b80] text-white text-sm font-semibold px-4 py-2 rounded-md cursor-pointer hover:bg-[#056b6e] transition-all duration-300"
          >
            <FiFileText className="mr-2" />
            {formData.acuerdoVenta ? formData.acuerdoVenta.name : "Subir Acuerdo"}
            <input
              type="file"
              name="acuerdoVenta"
              id="acuerdoVenta"
              onChange={onChange}
              className="hidden"
              accept=".pdf"
            />
          </label>
        </div>

        {/* Botones de Confirmar Venta y Cancelar */}
        <div className="flex justify-end gap-4 mt-6">
          <motion.button
            onClick={onConfirm}
            className="bg-green-500 text-white px-6 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            Confirmar Venta
          </motion.button>
          <motion.button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            Cancelar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

ModalVenta.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

// ----- PanelMerchandising (Vista de Merchandising) -----
// En esta pantalla se muestran las estadísticas, se pueden agregar nuevos artículos y se listan los artículos existentes.
// Se eliminó cualquier campo de "fecha de regreso" que se repitiera y solo se mantiene un botón "X" en el encabezado para cerrar la vista.
const PanelMerchandising = ({ artista, onClose, nuevoArticulo, setNuevoArticulo, agregarArticulo, calcularEstadisticas }) => {
  const stats = calcularEstadisticas(artista.articulos);
  const totalArticulos = artista.articulos.length;
  const ventasPromedio = totalArticulos > 0 ? (stats.ingresosTotales / totalArticulos).toFixed(2) : 0;

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
   
  const fileInputRef = useRef(null);
  const [articles, setArticles] = useState([]); // Lista de artículos cargados
  const [chartData, setChartData] = useState(null); // Datos del gráfico
  const [selectedArticle, setSelectedArticle] = useState(null); // Artículo seleccionado

  // 📌 Función para manejar la carga del archivo Excel
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // 🎯 Extraer solo los campos necesarios
    const formattedData = jsonData.map((row) => ({
      nombre: row["Nombre Articulo"],
      precio: row["Precio"],
      vendidos: row["Vendidos"] || 0,
      stock: row["Stock"] || 0,
      imagen: row["Imagen"] || "",
    }));

    console.log("Datos procesados:", formattedData);

      // 📝 Actualizar la lista de artículos
      setArticles(formattedData);

      // 📊 Crear la estructura de datos para Chart.js
      setChartData({
        labels: formattedData.map((item) => item.nombre),
        datasets: [
          {
            label: "Ventas",
            data: formattedData.map((item) => item.ventas),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
          {
            label: "Stock",
            data: formattedData.map((item) => item.stock),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 md:p-6 lg:p-8 w-full max-w-7xl "
    >
      {/* Encabezado de Merchandising */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className=" bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-500 p-6 rounded-lg shadow-lg mb-8 text-white "
      >
        <div className="flex flex-wrap justify-between items-center ">
          <h3 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl break-words ">
            Merchandising de {artista.nombre}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl "
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
      </motion.div>

      {/* Formulario para agregar un nuevo artículo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-lg mb-8"
      >
        <h4 className="text-lg sm:text-xl font-semibold mb-4 break-words">
          Agregar Nuevo Artículo
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Campo: Nombre del artículo */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold break-words">Nombre artículo</label>
            <input
              type="text"
              placeholder="Nombre artículo"
              value={nuevoArticulo.nombre}
              onChange={(e) =>
                setNuevoArticulo({ ...nuevoArticulo, nombre: e.target.value })
              }
              className="p-2 border rounded w-full text-sm"
            />
          </div>
          {/* Campo: Precio */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold break-words">Precio</label>
            <input
              type="number"
              placeholder="Precio"
              value={nuevoArticulo.precio}
              onChange={(e) =>
                setNuevoArticulo({
                  ...nuevoArticulo,
                  precio: parseFloat(e.target.value),
                })
              }
              className="p-2 border rounded w-full text-sm"
            />
          </div>
          {/* Campo: Stock */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold break-words">Stock</label>
            <input
              type="number"
              placeholder="Stock"
              value={nuevoArticulo.stock}
              onChange={(e) =>
                setNuevoArticulo({
                  ...nuevoArticulo,
                  stock: parseInt(e.target.value, 10),
                })
              }
              className="p-2 border rounded w-full text-sm"
            />
          </div>
          {/* Campo: Foto del Producto */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold break-words">Foto del Producto</label>
            <label
              htmlFor="fotoProducto"
              className="inline-block bg-[#067b80] text-white text-sm font-semibold px-4 py-2 rounded-md cursor-pointer hover:bg-[#056b6e] transition-all duration-300"
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
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={agregarArticulo}
          className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center gap-2 w-full max-w-xs mx-auto"
        >
          <FiPlus /> Agregar Artículo
        </motion.button>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Tarjeta: Total Vendido */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-blue-50 p-4 rounded-lg text-center shadow"
        >
          <h4 className="text-blue-600 font-bold mb-2 text-base sm:text-lg md:text-xl break-words">
            Total Vendido
          </h4>
          <p className="text-2xl font-bold break-words">{stats.totalVendido}</p>
        </motion.div>
        {/* Tarjeta: Ingresos Totales */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-green-50 p-4 rounded-lg text-center shadow"
        >
          <h4 className="text-green-600 font-bold mb-2 text-base sm:text-lg md:text-xl break-words">
            Ingresos Totales
          </h4>
          <p className="text-2xl font-bold break-words">
            ${stats.ingresosTotales.toLocaleString()}
          </p>
        </motion.div>
        {/* Tarjeta: Artículo Más Popular */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-purple-50 p-4 rounded-lg text-center shadow"
        >
          <h4 className="text-purple-600 font-bold mb-2 text-base sm:text-lg md:text-xl break-words">
            Art. Más Popular
          </h4>
          <p className="text-lg break-words">
            {stats.articuloMasVendido?.nombre || 'N/A'}
          </p>
        </motion.div>
        {/* Tarjeta: Total Artículos */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-yellow-50 p-4 rounded-lg text-center shadow"
        >
          <h4 className="text-yellow-600 font-bold mb-2 text-base sm:text-lg md:text-xl break-words">
            Total Artículos
          </h4>
          <p className="text-2xl font-bold break-words">{totalArticulos}</p>
        </motion.div>
      </motion.div>

      {/* Ventas Promedio */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-indigo-50 p-4 rounded-lg text-center shadow"
        >
          <h4 className="text-indigo-600 font-bold mb-2 text-base sm:text-lg md:text-xl break-words">
            Ventas Promedio
          </h4>
          <p className="text-2xl font-bold break-words">${ventasPromedio}</p>
        </motion.div>
      </motion.div>

      {/* 📊 Gráfico de Ventas */}
      {chartData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-4 rounded-lg shadow mb-6 overflow-x-auto w-full"
          style={{ minHeight: "300px" }}
        >
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </motion.div>
      )}

{/* Listado de Artículos */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.6 }}
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
>
  {artista.articulos.map((articulo) => (
    <motion.div
      key={articulo.id}
      whileHover={{ scale: 1.05 }}
      className="border p-4 rounded-lg shadow-lg bg-white text-center flex flex-col items-center transition-all hover:shadow-2xl"
    >
      {/* Manejo de imagen */}
      <img
        src={
          articulo.foto
            ? typeof articulo.foto === "string" && articulo.foto.startsWith("http")
              ? articulo.foto // Si es una URL válida
              : articulo.foto instanceof File
              ? URL.createObjectURL(articulo.foto) // Si es un archivo cargado
              : "https://http2.mlstatic.com/D_NQ_NP_662041-MEC80424904482_112024-O.webp" // Imagen predeterminada
            : "https://http2.mlstatic.com/D_NQ_NP_662041-MEC80424904482_112024-O.webp" // Imagen predeterminada
        }
        alt={articulo.nombre}
        className="w-full h-40 object-cover rounded-md max-w-xs"
      />
      
      <h2 className="text-lg font-bold mt-2 break-words">{articulo.nombre}</h2>
      <p className="text-gray-700 break-words">Stock: {articulo.stock}</p>
      <p className="text-gray-600 break-words">Vendidos: {articulo.vendidos}</p>
      <span className="mt-auto text-xl font-bold text-green-600 break-words">
        ${articulo.precio}
      </span>
    </motion.div>
  ))}
</motion.div>

      {/* Importación de archivos Excel */}
      <motion.label
  whileHover={{ scale: 1.05 }}  
  whileTap={{ scale: 0.95 }}
  className="bg-green-500 text-white py-2 px-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer w-max mx-auto my-4"
>
  <FiUpload />
  Subir Excel
  <input
    type="file"
    accept=".xlsx, .xls"
    onChange={handleFileUpload}
    className="hidden"
  />
</motion.label>

       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {articles.map((article, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-lg bg-white text-center flex flex-col items-center"
          >
            {article.imagen && (
              <img
                src={article.imagen}
                alt={article.nombre}
                className="w-full h-40 object-cover rounded-md max-w-xs"
              />
            )}
            <h2 className="text-lg font-bold mt-2">{article.nombre}</h2>
            <p className="text-gray-700">Precio: ${article.precio}</p>
            <p className="text-gray-600">Stock: {article.stock}</p>
            <p className="text-gray-500">Vendidos: {article.vendidos}</p>
            <button
              onClick={() => setSelectedArticle(article)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Abrir
            </button>
          </div>
        ))}
      </div>

      {selectedArticle && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-center">{selectedArticle.nombre}</h2>
            <img
              src={selectedArticle.imagen}
              alt={selectedArticle.nombre}
              className="w-full h-auto mt-4 rounded-lg max-h-80 object-contain"
            />
           <p className="text-gray-700 mt-3 text-center">Precio: ${selectedArticle.precio}</p>
            <p className="text-gray-600 text-center">Stock: {selectedArticle.stock}</p>
            <p className="text-gray-500 text-center">Vendidos: {selectedArticle.vendidos}</p>
            <button
              onClick={() => setSelectedArticle(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 w-full"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </motion.div>
  );
};

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
        foto: PropTypes.any,
      })
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  nuevoArticulo: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    stock: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    foto: PropTypes.any,
  }).isRequired,
  setNuevoArticulo: PropTypes.func.isRequired,
  agregarArticulo: PropTypes.func.isRequired,
  calcularEstadisticas: PropTypes.func.isRequired,
};

export default ArtistAcquisition;
