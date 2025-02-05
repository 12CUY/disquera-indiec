// Importación de dependencias
import { useState } from "react";
import Swal from "sweetalert2"; // Para alertas estilizadas
import { motion, AnimatePresence } from "framer-motion"; // Para animaciones
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCcw,
  FiFilter,
  FiDownload,
  FiMusic,
} from "react-icons/fi"; // Íconos
import PropTypes from "prop-types"; // Validación de props (no se usa actualmente)
import { Link } from "react-router-dom"; // Navegación (no se usa en este fragmento)
import * as XLSX from "xlsx"; // Manipulación de archivos Excel

// Componente principal de gestión musical
const Musica = () => {
  // Estado inicial de las canciones con datos de ejemplo
  const [canciones, setCanciones] = useState([
    {
      foto: null,
      titulo: "Canción 1",
      album: "Álbum 1",
      duracion: "3:45",
      año: 2020,
      genero: "Rock",
      estado: "Activo",
    },
    {
      foto: null,
      titulo: "Canción 2",
      album: "Álbum 2",
      duracion: "4:20",
      año: 2021,
      genero: "Pop",
      estado: "Activo",
    },
  ]);

  // Estados para controlar ventanas modales
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);

  // Estado para almacenar datos del formulario
  const [formData, setFormData] = useState({
    foto: null,
    titulo: "",
    album: "",
    duracion: "",
    año: "",
    genero: "",
    estado: "Activo",
  });

  // Estados auxiliares
  const [currentCancion, setCurrentCancion] = useState(null); // Índice de canción seleccionada
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [errors, setErrors] = useState({}); // Errores de validación
  const [sortOrder, setSortOrder] = useState("asc"); // Orden de clasificación
  const [showSuccess, setShowSuccess] = useState(false); // Estado para animación de éxito

  // Lista de géneros musicales disponibles
  const generos = [
    "Rock",
    "Pop",
    "Jazz",
    "Clásica",
    "Electrónica",
    "Hip-Hop",
    "Reggae",
    "Metal",
  ];

  // Manejadores de modales de creación
  const openModalCrear = () => {
    setFormData({
      // Reiniciar formulario
      foto: null,
      titulo: "",
      album: "",
      duracion: "",
      año: "",
      genero: "",
      estado: "Activo",
    });
    setErrors({}); // Limpiar errores
    setModalCrear(true); // Mostrar modal
  };

  const closeModalCrear = () => setModalCrear(false); // Ocultar modal

  // Manejadores de modales de edición
  const openModalEditar = (index) => {
    setCurrentCancion(index); // Establecer canción a editar
    setFormData(canciones[index]); // Cargar datos existentes
    setErrors({}); // Limpiar errores
    setModalEditar(true); // Mostrar modal
  };

  const closeModalEditar = () => setModalEditar(false); // Ocultar modal

  // Manejadores de modales de visualización
  const openModalVer = (index) => {
    setCurrentCancion(index); // Establecer canción a visualizar
    setModalVer(true); // Mostrar modal
  };

  const closeModalVer = () => setModalVer(false); // Ocultar modal

  // Manejador de cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setFormData({ ...formData, foto: files[0] }); // Manejar archivo de imagen
    } else {
      setFormData({ ...formData, [name]: value }); // Actualizar otros campos
    }
    validateField(name, value); // Validación en tiempo real
  };

  // Función de validación de campos individuales
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    // Validaciones básicas de campos requeridos
    if (name === "titulo" && !value) {
      newErrors.titulo = "El título es obligatorio.";
    } else if (name === "album" && !value) {
      newErrors.album = "El álbum es obligatorio.";
    } else if (name === "duracion" && !value) {
      newErrors.duracion = "La duración es obligatoria.";
    } else if (name === "año" && !value) {
      newErrors.año = "El año es obligatorio.";
    } else if (name === "genero" && !value) {
      newErrors.genero = "El género es obligatorio.";
    } else {
      delete newErrors[name]; // Limpiar error si el campo es válido
    }
    setErrors(newErrors);
  };

  // Verificar si el formulario es válido para enviar
  const isFormValid = () => {
    return (
      formData.titulo &&
      formData.album &&
      formData.duracion &&
      formData.año &&
      formData.genero &&
      Object.keys(errors).length === 0
    );
  };

  // CRUD: Crear nueva canción
  const handleAddCancion = () => {
    if (!isFormValid()) return; // Validación final
    setCanciones([...canciones, { ...formData }]); // Agregar nueva canción
    setShowSuccess(true); // Mostrar feedback visual
    setTimeout(() => setShowSuccess(false), 1000); // Ocultar feedback después de 1s
    closeModalCrear(); // Cerrar modal
  };

  // CRUD: Actualizar canción existente
  const handleUpdateCancion = () => {
    if (!isFormValid()) return; // Validación final
    const updatedCanciones = [...canciones];
    updatedCanciones[currentCancion] = { ...formData }; // Actualizar canción
    setCanciones(updatedCanciones);
    setShowSuccess(true); // Mostrar feedback visual
    setTimeout(() => setShowSuccess(false), 1000);
    closeModalEditar(); // Cerrar modal
  };

  // CRUD: Eliminación lógica (cambiar estado a inactivo)
  const handleDeleteCancion = (index) => {
    const updatedCanciones = [...canciones];
    updatedCanciones[index].estado = "Inactivo"; // Marcar como inactivo
    setCanciones(updatedCanciones);
    Swal.fire({
      // Mostrar alerta estilizada
      icon: "error",
      title: "Canción desactivada",
      text: "La canción fue marcada como inactiva.",
    });
  };

  // Restaurar canción eliminada
  const handleRestoreCancion = (index) => {
    const updatedCanciones = [...canciones];
    updatedCanciones[index].estado = "Activo"; // Marcar como activo
    setCanciones(updatedCanciones);
    Swal.fire({
      // Mostrar alerta estilizada
      icon: "success",
      title: "Canción restaurada",
      text: "La canción fue restaurada y está activa nuevamente.",
    });
  };

  // Manejar cambio en campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualizar término de búsqueda
  };

  // Alternar orden de clasificación por año
  const handleSortByYear = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc")); // Cambiar dirección
  };

  // Exportar datos a archivo Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCanciones); // Crear hoja de trabajo
    const workbook = XLSX.utils.book_new(); // Crear libro de Excel
    XLSX.utils.book_append_sheet(workbook, worksheet, "Canciones"); // Añadir hoja
    XLSX.writeFile(workbook, "canciones.xlsx"); // Descargar archivo
  };

  // Filtrar y ordenar canciones
  const filteredCanciones = canciones
    .filter(
      (
        cancion // Filtrado por título
      ) => cancion.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Ordenamiento por año
      return sortOrder === "asc" ? a.año - b.año : b.año - a.año;
    });

  return (
    // Contenedor principal con fondo animado
    <div className="p-8 min-h-screen bg-cover bg-center bg-[url('/fondo.gif')]">
      {/* Sección de encabezado con imagen de fondo */}
      <div
        className="flex flex-col sm:flex-row md:flex-row items-center justify-between p-4 md:ml-72 text-white rounded-lg bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/dc.jpg')", // Fondo decorativo
          borderRadius: "20px", // Bordes redondeados
        }}
      >
        {/* Título responsive con tamaño dinámico */}
        <p
          className="text-center sm:text-left text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
          style={{
            fontSize: "clamp(25px, 8vw, 60px)", // Tamaño adaptable al viewport
            margin: 0, // Elimina márgenes por defecto
          }}
        >
          Canción
        </p>

        {/* Botón animado para agregar canciones */}
        <div className="mt-4 sm:mt-0">
          <motion.button
            onClick={openModalCrear}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
            style={{ fontSize: "18px" }}
            whileHover={{ scale: 1.05 }} // Animación al hacer hover
            whileTap={{ scale: 0.95 }} // Animación al hacer click
          >
            Agregar Canción
          </motion.button>
        </div>
      </div>

      {/* Migas de pan (breadcrumbs) de navegación */}
      <div
        className="md:ml-72 p-4 mx-auto bg-blue-100 rounded-lg shadow-lg"
        style={{
          backgroundColor: "#f1f8f9", // Color personalizado
          borderRadius: "20px", // Bordes más redondeados
          marginTop: "20px", // Espaciado superior
          marginBottom: "20px", // Espaciado inferior
          height: "auto", // Altura automática
          padding: "10px", // Padding interno
        }}
      >
        <nav aria-label="breadcrumb">
          {" "}
          {/* Accesibilidad para navegación */}
          <ol className="flex flex-wrap gap-2 list-none p-0 m-0 justify-center items-center">
            {/* Elemento de inicio */}
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <Link
                to="/dashboard"
                className="text-[#0aa5a9] px-4 py-2 rounded-lg transition duration-300 hover:bg-[#067b80] hover:text-white no-underline"
              >
                Inicio
              </Link>
            </li>

            {/* Separador */}
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <span className="text-[#0aa5a9] px-2">/</span>
            </li>

            {/* Página actual */}
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <span className="text-[#0aa5a9] px-4 py-2 rounded-lg transition duration-300 hover:bg-[#067b80] hover:text-white no-underline">
                Canción
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Contenedor de herramientas (búsqueda, filtros, exportar) */}
      <div
        className="md:ml-72 p-4 mx-auto bg-gray-100 rounded-lg shadow-lg"
        style={{
          backgroundColor: "#f1f8f9", // Color de fondo personalizado
          borderRadius: "20px", // Bordes redondeados
          marginTop: "20px", // Margen superior
          marginBottom: "20px", // Margen inferior
          height: "auto", // Altura automática
          padding: "10px", // Padding interno
        }}
      >
        {/* Layout responsive para herramientas */}
        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
          {/* Campo de búsqueda */}
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar Canción..."
              value={searchTerm} // Estado controlado
              onChange={handleSearchChange} // Manejador de búsqueda
              className="border border-gray-300 p-2 rounded-lg w-full pl-10" // Estilo con padding para ícono
            />
          </div>

          {/* Botón de filtrado por año */}
          <button
            onClick={handleSortByYear}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FiFilter /> {/* Ícono de filtro */}
            {sortOrder === "asc" ? "Año Ascendente" : "Año Descendente"}
          </button>

          {/* Botón animado para exportar a Excel */}
          <motion.button
            onClick={handleExportToExcel}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-300 transition-colors duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }} // Efecto hover
            whileTap={{ scale: 0.95 }} // Efecto al hacer click
          >
            <FiDownload /> {/* Ícono de descarga */}
            Exportar a Excel
          </motion.button>
        </div>
      </div>

      {/* Contenedor principal de la sección de tabla */}
      <div
        className="flex-1 ml-0 md:ml-72 p-4 rounded-lg overflow-auto"
        style={{
          backgroundColor: "rgba(241, 248, 249, 0.8)",
        }} /* Fondo semitransparente */
      >
        {/* Contenedor para scroll horizontal en móviles */}
        <div className="overflow-x-auto">
          {/* Tabla principal con diseño responsive */}
          <table
            className="min-w-full table-auto rounded-lg shadow-md"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }} /* Fondo blanco semitransparente */
          >
            {/* Encabezado de la tabla */}
            <thead className=" bg-gray-200"
             style={{
              backgroundImage: `url("https://png.pngtree.com/background/20210714/original/pngtree-blue-music-chord-background-picture-image_1205877.jpg")`,
              
            }} /* Fondo blanco semitransparente */>
              {" "}
              {/* Fondo gris para el encabezado */}
              <tr>
                {/* Columnas del encabezado */}
                <th className="px-4 py-2">Foto</th> {/* Espaciado interno */}
                <th className="px-4 py-2">Título</th>
                <th className="px-4 py-2">Álbum</th>
                <th className="px-4 py-2">Duración</th>
                <th className="px-4 py-2">Año</th>
                <th className="px-4 py-2">Género</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>

            {/* Cuerpo de la tabla */}
            <tbody>
              {/* Mapeo de canciones filtradas con animación */}
              {filteredCanciones.map((cancion, index) => (
                <motion.tr /* Fila animada con Framer Motion */
                  key={index}
                  initial={{ opacity: 0 }} /* Estado inicial invisible */
                  animate={{ opacity: 1 }} /* Animación de aparición */
                  exit={{ opacity: 0 }} /* Animación de desaparición */
                  transition={{ duration: 0.5 }} /* Duración de la transición */
                  className={`border-t ${
                    cancion.estado === "Activo"
                      ? "hover:bg-gray-100"
                      : "bg-gray-300"
                  }`} /* Color condicional del fondo */
                >
                  {/* Celda de la foto */}
                  <td className="px-4 py-2">
                    {cancion.foto /* Condicional para mostrar imagen o texto */ ? (
                      <img
                        src={URL.createObjectURL(
                          cancion.foto
                        )} /* Convertir Blob a URL */
                        alt="Foto"
                        className="w-12 h-12 object-cover rounded-md" /* Estilo de la imagen */
                      />
                    ) : (
                      "Sin foto" /* Texto alternativo */
                    )}
                  </td>

                  {/* Demás celdas con datos de la canción */}
                  <td className="px-4 py-2">{cancion.titulo}</td>
                  <td className="px-4 py-2">{cancion.album}</td>
                  <td className="px-4 py-2">{cancion.duracion}</td>
                  <td className="px-4 py-2">{cancion.año}</td>
                  <td className="px-4 py-2">{cancion.genero}</td>

                  {/* Celda de estado con indicador visual */}
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        cancion.estado === "Activo"
                          ? "bg-green-500" /* Verde para activo */
                          : "bg-red-500" /* Rojo para inactivo */
                      }`}
                    >
                      {cancion.estado}
                    </span>
                  </td>

                  {/* Celda de acciones con botones animados */}
                  <td className="px-4 py-2 flex space-x-2">
                    {" "}
                    {/* Contenedor flexible para botones */}
                    {/* Botón Ver */}
                    <motion.div
                      whileHover={{
                        scale: 1.1,
                      }} /* Animación al pasar el mouse */
                      whileTap={{ scale: 0.9 }} /* Animación al hacer click */
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => openModalVer(index)}
                    >
                      <FiEye className="text-white" size={20} />{" "}
                      {/* Ícono ocular */}
                    </motion.div>
                    {/* Botón Editar */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => openModalEditar(index)}
                    >
                      <FiEdit className="text-white" size={20} />{" "}
                      {/* Ícono de edición */}
                    </motion.div>
                    {/* Botón condicional Eliminar/Restaurar */}
                    {cancion.estado === "Activo" ? (
                      <motion.div /* Botón Eliminar */
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleDeleteCancion(index)}
                      >
                        <FiTrash2 className="text-white" size={20} />{" "}
                        {/* Ícono de basura */}
                      </motion.div>
                    ) : (
                      <motion.div /* Botón Restaurar */
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleRestoreCancion(index)}
                      >
                        <FiRefreshCcw className="text-white" size={20} />{" "}
                        {/* Ícono de restauración */}
                      </motion.div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Animación de guardado */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <FiMusic className="text-6xl text-green-500 mx-auto mb-4" />
                <p className="text-xl text-gray-700">Guardado con éxito</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modales */}
        {modalCrear && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalCrear}
            onChange={handleInputChange}
            onSave={handleAddCancion}
            generos={generos}
            errors={errors}
            isFormValid={isFormValid}
          />
        )}

        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateCancion}
            generos={generos}
            errors={errors}
            isFormValid={isFormValid}
          />
        )}

        {modalVer && (
          <ModalVer
            cancion={canciones[currentCancion]}
            onClose={closeModalVer}
          />
        )}
      </div>
    </div>
  );
};

// ModalFormulario: Componente funcional que muestra un formulario en un modal
const ModalFormulario = ({
  formData,
  onClose,
  onChange,
  onSave,
  generos,
  errors,
  isFormValid,
}) => (
  // Fondo oscuro semi-transparente con posicionamiento fijo
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Formulario de Canción</h2>

      <form>
        {" "}
        {/* Formulario principal */}
        {/* Sección para subir imagen con label personalizado */}
        <div className="mb-4 text-center">
          <label className="block text-sm font-semibold text-gray-700 mb-2"></label>
          <div>
            {/* Label estilizado que activa el input file oculto */}
            <label
              htmlFor="foto"
              className="inline-block bg-[#067b80] text-white text-sm font-semibold px-4 py-2 rounded-md cursor-pointer hover:bg-[#056b6e] focus:ring-2 focus:ring-[#056b6e] focus:outline-none"
            >
              Subir Imagen
            </label>
            {/* Input file oculto para subir imagen */}
            <input
              id="foto"
              type="file"
              name="foto"
              onChange={onChange}
              className="hidden"
            />
          </div>
        </div>
        {/* Campo para título de la canción */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.titulo ? "border-red-500" : ""
            }`}
          />
          {/* Mensaje de error si existe validación */}
          {errors.titulo && (
            <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
          )}
        </div>
        {/* Campo para álbum */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Álbum</label>
          <input
            type="text"
            name="album"
            value={formData.album}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.album ? "border-red-500" : ""
            }`}
          />
          {errors.album && (
            <p className="text-red-500 text-sm mt-1">{errors.album}</p>
          )}
        </div>
        {/* Campo para duración */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Duración</label>
          <input
            type="text"
            name="duracion"
            value={formData.duracion}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.duracion ? "border-red-500" : ""
            }`}
          />
          {errors.duracion && (
            <p className="text-red-500 text-sm mt-1">{errors.duracion}</p>
          )}
        </div>
        {/* Campo para año con tipo number */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Año</label>
          <input
            type="number"
            name="año"
            value={formData.año}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.año ? "border-red-500" : ""
            }`}
          />
          {errors.año && (
            <p className="text-red-500 text-sm mt-1">{errors.año}</p>
          )}
        </div>
        {/* Selector de género con opciones dinámicas */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Género</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.genero ? "border-red-500" : ""
            }`}
          >
            <option value="">Selecciona un género</option>
            {/* Mapeo de géneros recibidos por props */}
            {generos.map((genero, index) => (
              <option key={index} value={genero}>
                {genero}
              </option>
            ))}
          </select>
          {errors.genero && (
            <p className="text-red-500 text-sm mt-1">{errors.genero}</p>
          )}
        </div>
        {/* Botones de acción con animaciones (Framer Motion) */}
        <div className="flex justify-end">
          {/* Botón Guardar con validación de formulario */}
          <motion.button
            onClick={onSave}
            className={`bg-blue-500 text-white p-2 rounded-lg mr-2 ${
              !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isFormValid()}
            whileHover={{ scale: 1.05 }} // Animación hover
            whileTap={{ scale: 0.95 }} // Animación al hacer clic
          >
            Guardar
          </motion.button>
          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="bg-red-400 text-white p-2 rounded-md"
          >
            Cerrar
          </button>
        </div>
      </form>
    </div>
  </div>
);
// ModalVer: Componente funcional para visualizar detalles de una canción en modal
// Recibe props: cancion (objeto con datos de la canción), onClose (función para cerrar modal)
const ModalVer = ({ cancion, onClose }) => (
  // Contenedor animado con Framer Motion (animaciones de entrada/salida)
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }} // Estado inicial de la animación
    animate={{ opacity: 1, scale: 1 }} // Estado animado cuando está visible
    exit={{ opacity: 0, scale: 0.8 }} // Estado al salir/desmontar
    transition={{ duration: 0.3 }} // Duración de la transición
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" // Fondo oscuro semi-transparente
  >
    {/* Contenedor principal del modal */}
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Ver Canción</h2>{" "}
      {/* Título del modal */}
      {/* Sección para mostrar la imagen de la canción */}
      <div className="mb-4">
        <strong>Foto:</strong>
        {cancion.foto ? ( // Condicional para mostrar imagen o texto alternativo
          <img
            src={URL.createObjectURL(cancion.foto)} // Crea URL temporal para la imagen
            alt="Foto"
            className="w-12 h-12 object-cover rounded-md" // Estilos de la imagen
          />
        ) : (
          "Sin foto" // Texto si no hay imagen
        )}
      </div>
      {/* Campos de información de la canción */}
      <div className="mb-4">
        <strong>Título:</strong>
        <p>{cancion.titulo}</p>
      </div>
      <div className="mb-4">
        <strong>Álbum:</strong>
        <p>{cancion.album}</p>
      </div>
      <div className="mb-4">
        <strong>Duración:</strong>
        <p>{cancion.duracion}</p>
      </div>
      <div className="mb-4">
        <strong>Año:</strong>
        <p>{cancion.año}</p>
      </div>
      <div className="mb-4">
        <strong>Género:</strong>
        <p>{cancion.genero}</p>
      </div>
      <div className="mb-4">
        <strong>Estado:</strong>
        <p>{cancion.estado}</p>{" "}
        {/* Campo adicional para estado de la canción */}
      </div>
      {/* Botón de cierre */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-purple-500 text-white p-2 rounded-md"
        >
          Cerrar
        </button>
      </div>
    </div>
  </motion.div>
);

// Definición de PropTypes para validación de propiedades
ModalFormulario.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  generos: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  isFormValid: PropTypes.func.isRequired,
};

ModalVer.propTypes = {
  cancion: PropTypes.object.isRequired, // Valida que canción sea objeto requerido
  onClose: PropTypes.func.isRequired, // Valida función de cierre requerida
};

// Posible error en exportación: 'Musica' no está definido en el código mostrado
// Debería ser export {ModalFormulario, ModalVer} o similar según implementación
export default Musica;
