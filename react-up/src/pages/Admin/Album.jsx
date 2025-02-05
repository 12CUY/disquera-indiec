// Importación de dependencias y componentes necesarios
import { useState } from "react"; // Hook para manejar el estado en componentes funcionales
import Swal from "sweetalert2"; // Librería para mostrar alertas personalizadas
import { motion } from "framer-motion"; // Librería para animaciones en React
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCcw,
  FiFilter,
  FiDownload,
} from "react-icons/fi"; // Iconos de la librería Feather Icons
import PropTypes from "prop-types"; // Validación de tipos de propiedades en componentes
import { Link } from "react-router-dom"; // Componente para manejar enrutamiento en React
import * as XLSX from "xlsx"; // Librería para manipular archivos de Excel

// Componente principal `Album`
const Album = () => {
  // Estado para almacenar la lista de álbumes
  const [albums, setAlbums] = useState([
    {
      id: 1,
      foto: null,
      titulo: "Álbum 1",
      artista: "Artista 1",
      año: 2020,
      genero: "Rock",
      activo: true,
    },
    {
      id: 2,
      foto: null,
      titulo: "Álbum 2",
      artista: "Artista 2",
      año: 2021,
      genero: "Pop",
      activo: true,
    },
  ]);

  // Estados para controlar la visibilidad de los modales
  const [modalCrear, setModalCrear] = useState(false); // Modal para crear un nuevo álbum
  const [modalEditar, setModalEditar] = useState(false); // Modal para editar un álbum existente
  const [modalVer, setModalVer] = useState(false); // Modal para ver detalles de un álbum

  // Estado para almacenar los datos del formulario (crear/editar)
  const [formData, setFormData] = useState({
    foto: null,
    titulo: "",
    artista: "",
    año: "",
    genero: "",
  });

  // Estado para almacenar el álbum actualmente seleccionado (para editar o ver)
  const [currentAlbum, setCurrentAlbum] = useState(null);

  // Estado para manejar el término de búsqueda (filtrado de álbumes)
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para manejar errores de validación en el formulario
  const [errors, setErrors] = useState({});

  // Estado para manejar el orden de clasificación (ascendente o descendente)
  const [sortOrder, setSortOrder] = useState("asc");

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

  // Función para abrir el modal de creación de un nuevo álbum
  const openModalCrear = () => {
    setFormData({
      foto: null,
      titulo: "",
      artista: "",
      año: "",
      genero: "",
    });
    setErrors({}); // Limpiar errores de validación
    setModalCrear(true); // Mostrar el modal
  };

  // Función para cerrar el modal de creación
  const closeModalCrear = () => setModalCrear(false);

  // Función para abrir el modal de edición de un álbum existente
  const openModalEditar = (album) => {
    setCurrentAlbum(album); // Establecer el álbum actual
    setFormData(album); // Llenar el formulario con los datos del álbum
    setErrors({}); // Limpiar errores de validación
    setModalEditar(true); // Mostrar el modal
  };

  // Función para cerrar el modal de edición
  const closeModalEditar = () => setModalEditar(false);

  // Función para abrir el modal de visualización de detalles de un álbum
  const openModalVer = (album) => {
    setCurrentAlbum(album); // Establecer el álbum actual
    setModalVer(true); // Mostrar el modal
  };

  // Función para cerrar el modal de visualización
  const closeModalVer = () => setModalVer(false);

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      // Si el campo es una imagen, guardar el archivo seleccionado
      setFormData({ ...formData, foto: files[0] });
    } else {
      // Para otros campos, actualizar el valor correspondiente
      setFormData({ ...formData, [name]: value });
    }
  };
  // Función para validar el formulario antes de agregar o actualizar un álbum
  const validateForm = () => {
    const newErrors = {}; // Objeto para almacenar errores de validación

    // Validar que el campo "titulo" no esté vacío
    if (!formData.titulo) newErrors.titulo = "El título es obligatorio.";
    // Validar que el campo "artista" no esté vacío
    if (!formData.artista) newErrors.artista = "El artista es obligatorio.";
    // Validar que el campo "año" no esté vacío
    if (!formData.año) newErrors.año = "El año es obligatorio.";
    // Validar que el campo "genero" no esté vacío
    if (!formData.genero) newErrors.genero = "El género es obligatorio.";

    setErrors(newErrors); // Actualizar el estado de errores
    return Object.keys(newErrors).length === 0; // Retornar true si no hay errores
  };

  // Función para agregar un nuevo álbum
  const handleAddAlbum = () => {
    if (!validateForm()) return; // Si el formulario no es válido, no hacer nada

    // Crear un nuevo álbum con un ID único (usando la fecha actual)
    const newAlbum = {
      id: Date.now(), // Generar un id único basado en el timestamp actual
      ...formData, // Copiar los datos del formulario
      activo: true, // Marcar el álbum como activo por defecto
    };

    // Agregar el nuevo álbum a la lista de álbumes
    setAlbums([...albums, newAlbum]);

    // Mostrar una alerta de éxito usando SweetAlert2
    Swal.fire({
      icon: "success",
      title: "Álbum agregado",
      text: `El álbum "${formData.titulo}" fue agregado exitosamente.`,
    });

    closeModalCrear(); // Cerrar el modal de creación
  };

  // Función para actualizar un álbum existente
  const handleUpdateAlbum = () => {
    if (!validateForm()) return; // Si el formulario no es válido, no hacer nada

    // Actualizar la lista de álbumes, reemplazando el álbum actual con los nuevos datos
    const updatedAlbums = albums.map((album) =>
      album.id === currentAlbum.id
        ? { ...formData, id: currentAlbum.id }
        : album
    );

    setAlbums(updatedAlbums); // Actualizar el estado de álbumes

    // Mostrar una alerta de éxito usando SweetAlert2
    Swal.fire({
      icon: "success",
      title: "Álbum actualizado",
      text: `El álbum "${formData.titulo}" fue actualizado exitosamente.`,
    });

    closeModalEditar(); // Cerrar el modal de edición
  };

  // Función para desactivar un álbum (marcarlo como inactivo)
  const handleDeleteAlbum = (id) => {
    // Actualizar la lista de álbumes, marcando el álbum seleccionado como inactivo
    const updatedAlbums = albums.map((album) =>
      album.id === id ? { ...album, activo: false } : album
    );

    setAlbums(updatedAlbums); // Actualizar el estado de álbumes

    // Mostrar una alerta de éxito usando SweetAlert2
    Swal.fire({
      icon: "error",
      title: "Álbum desactivado",
      text: "El álbum fue marcado como inactivo.",
    });
  };

  // Función para restaurar un álbum (marcarlo como activo)
  const handleRestoreAlbum = (id) => {
    // Actualizar la lista de álbumes, marcando el álbum seleccionado como activo
    const updatedAlbums = albums.map((album) =>
      album.id === id ? { ...album, activo: true } : album
    );

    setAlbums(updatedAlbums); // Actualizar el estado de álbumes

    // Mostrar una alerta de éxito usando SweetAlert2
    Swal.fire({
      icon: "success",
      title: "Álbum restaurado",
      text: "El álbum fue restaurado y está activo nuevamente.",
    });
  };

  // Función para manejar cambios en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualizar el término de búsqueda con el valor del input
  };

  // Función para cambiar el orden de clasificación por año (ascendente o descendente)
  const handleSortByYear = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc")); // Alternar entre "asc" y "desc"
  };

  // Función para exportar la lista de álbumes a un archivo Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAlbums); // Crear una hoja de cálculo con los álbumes filtrados
    const workbook = XLSX.utils.book_new(); // Crear un nuevo libro de Excel
    XLSX.utils.book_append_sheet(workbook, worksheet, "Álbumes"); // Agregar la hoja al libro
    XLSX.writeFile(workbook, "albumes.xlsx"); // Descargar el archivo Excel
  };

  // Filtrar y ordenar la lista de álbumes según el término de búsqueda y el orden de clasificación
  const filteredAlbums = albums
    .filter(
      (album) => album.titulo.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrar por título
    )
    .sort((a, b) => {
      return sortOrder === "asc" ? a.año - b.año : b.año - a.año; // Ordenar por año (ascendente o descendente)
    });
  return (
    // Contenedor principal con fondo animado (GIF) y estilos de diseño
    <div className="p-8 min-h-screen bg-cover bg-center bg-[url('/fondo.gif')]">
      {/* Encabezado y botón de agregar */}
      <div
        className="flex flex-col sm:flex-row md:flex-row items-center justify-between p-4 md:ml-72 text-white rounded-lg bg-cover bg-center"
        style={{ backgroundImage: "url('/img/dc.jpg')", borderRadius: "20px" }}
      >
        {/* Título de la página */}
        <p
          className="text-center sm:text-left text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
          style={{ fontSize: "clamp(25px, 8vw, 60px)", margin: 0 }}
        >
          Álbum
        </p>

        {/* Botón para abrir el modal de creación de un nuevo álbum */}
        <div className="mt-4 sm:mt-0">
          <button
            onClick={openModalCrear}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
            style={{ fontSize: "18px" }}
          >
            Agregar Álbum
          </button>
        </div>
      </div>

      {/* Migajas de pan (breadcrumbs) para navegación */}
      <div
        className="md:ml-72 p-4 mx-auto bg-blue-100 rounded-lg shadow-lg"
        style={{
          backgroundColor: "#f1f8f9",
          borderRadius: "20px",
          marginTop: "20px",
          marginBottom: "20px",
          height: "auto",
          padding: "10px",
        }}
      >
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap gap-2 list-none p-0 m-0 justify-center items-center">
            {/* Enlace a la página de inicio */}
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

            {/* Página actual (Álbum) */}
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <span className="text-[#0aa5a9] px-4 py-2 rounded-lg transition duration-300 hover:bg-[#067b80] hover:text-white no-underline">
                Álbum
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Contenedor de búsqueda, filtro y exportar */}
      <div
        className="md:ml-72 p-4 mx-auto bg-gray-100 rounded-lg shadow-lg"
        style={{
          backgroundColor: "#f1f8f9",
          borderRadius: "20px",
          marginTop: "20px",
          marginBottom: "20px",
          height: "auto",
          padding: "10px",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
          {/* Campo de búsqueda */}
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar Álbum..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
            />
          </div>

          {/* Botón para ordenar por año (ascendente o descendente) */}
          <button
            onClick={handleSortByYear}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FiFilter /> {/* Icono de filtro */}
            {sortOrder === "asc" ? "Año Ascendente" : "Año Descendente"}
          </button>

          {/* Botón para exportar la lista de álbumes a Excel */}
          <motion.button
            onClick={handleExportToExcel}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FiDownload /> {/* Icono de descarga */}
            Exportar a Excel
          </motion.button>
        </div>
      </div>

      {/* Tabla de álbumes */}
      <div
        className="flex-1 ml-0 md:ml-72 p-4 rounded-lg overflow-auto"
        style={{ backgroundColor: "rgba(241, 248, 249, 0.8)" }}
      >
        {/* Contenedor para permitir el desplazamiento horizontal en pantallas pequeñas */}
        <div className="overflow-x-auto">
          {/* Tabla principal */}
          <table
            className="min-w-full table-auto rounded-lg shadow-md"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
          >
            {/* Encabezado de la tabla */}
            <thead
              className="bg-gray-200"
              style={{
                backgroundImage: `url("https://png.pngtree.com/background/20210714/original/pngtree-blue-music-chord-background-picture-image_1205877.jpg")`,
              }} /* Fondo blanco semitransparente */
            >
              <tr>
                <th className="px-4 py-2">Foto</th>{" "}
                {/* Columna para la foto del álbum */}
                <th className="px-4 py-2">Título</th>{" "}
                {/* Columna para el título del álbum */}
                <th className="px-4 py-2">Artista</th>{" "}
                {/* Columna para el artista del álbum */}
                <th className="px-4 py-2">Año</th>{" "}
                {/* Columna para el año del álbum */}
                <th className="px-4 py-2">Género</th>{" "}
                {/* Columna para el género del álbum */}
                <th className="px-4 py-2">Estado</th>{" "}
                {/* Columna para el estado (activo/inactivo) */}
                <th className="px-4 py-2">Acciones</th>{" "}
                {/* Columna para las acciones (ver, editar, eliminar, restaurar) */}
              </tr>
            </thead>

            {/* Cuerpo de la tabla */}
            <tbody>
              {filteredAlbums.map((album) => (
                // Fila de la tabla con animaciones (Framer Motion)
                <motion.tr
                  key={album.id} // Identificador único para cada fila
                  initial={{ opacity: 0 }} // Estado inicial de la animación (invisible)
                  animate={{ opacity: 1 }} // Estado animado (visible)
                  exit={{ opacity: 0 }} // Estado al salir (invisible)
                  transition={{ duration: 0.5 }} // Duración de la animación
                  className={`border-t ${
                    album.activo ? "hover:bg-gray-100" : "bg-gray-300"
                  }`} // Estilos condicionales según el estado del álbum
                >
                  {/* Celda para la foto del álbum */}
                  <td className="px-4 py-2">
                    {album.foto ? ( // Si hay una foto, mostrarla
                      <img
                        src={URL.createObjectURL(album.foto)}
                        alt="Foto"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      "Sin foto" // Si no hay foto, mostrar texto
                    )}
                  </td>
                  {/* Celdas para los datos del álbum */}
                  <td className="px-4 py-2">{album.titulo}</td> {/* Título */}
                  <td className="px-4 py-2">{album.artista}</td> {/* Artista */}
                  <td className="px-4 py-2">{album.año}</td> {/* Año */}
                  <td className="px-4 py-2">{album.genero}</td> {/* Género */}
                  {/* Celda para el estado del álbum (activo/inactivo) */}
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        album.activo ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {album.activo ? "Activo" : "Inactivo"}{" "}
                      {/* Texto condicional según el estado */}
                    </span>
                  </td>
                  {/* Celda para las acciones (ver, editar, eliminar/restaurar) */}
                  <td className="px-4 py-2 flex space-x-2">
                    {/* Botón para ver detalles del álbum */}
                    <motion.div
                      whileHover={{ scale: 1.1 }} // Animación al pasar el cursor
                      whileTap={{ scale: 0.9 }} // Animación al hacer clic
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => openModalVer(album)} // Abrir modal de ver detalles
                    >
                      <FiEye className="text-white" size={20} />{" "}
                      {/* Icono de "ver" */}
                    </motion.div>

                    {/* Botón para editar el álbum */}
                    <motion.div
                      whileHover={{ scale: 1.1 }} // Animación al pasar el cursor
                      whileTap={{ scale: 0.9 }} // Animación al hacer clic
                      className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => openModalEditar(album)} // Abrir modal de edición
                    >
                      <FiEdit className="text-white" size={20} />{" "}
                      {/* Icono de "editar" */}
                    </motion.div>

                    {/* Botón para eliminar o restaurar el álbum */}
                    {album.activo ? ( // Si el álbum está activo, mostrar botón de eliminar
                      <motion.div
                        whileHover={{ scale: 1.1 }} // Animación al pasar el cursor
                        whileTap={{ scale: 0.9 }} // Animación al hacer clic
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleDeleteAlbum(album.id)} // Desactivar el álbum
                      >
                        <FiTrash2 className="text-white" size={20} />{" "}
                        {/* Icono de "eliminar" */}
                      </motion.div>
                    ) : (
                      // Si el álbum está inactivo, mostrar botón de restaurar
                      <motion.div
                        whileHover={{ scale: 1.1 }} // Animación al pasar el cursor
                        whileTap={{ scale: 0.9 }} // Animación al hacer clic
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleRestoreAlbum(album.id)} // Activar el álbum
                      >
                        <FiRefreshCcw className="text-white" size={20} />{" "}
                        {/* Icono de "restaurar" */}
                      </motion.div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modales */}
        {modalCrear && ( // Modal para crear un nuevo álbum
          <ModalFormulario
            formData={formData} // Datos del formulario
            onClose={closeModalCrear} // Función para cerrar el modal
            onChange={handleInputChange} // Función para manejar cambios en los campos
            onSave={handleAddAlbum} // Función para guardar el nuevo álbum
            generos={generos} // Lista de géneros disponibles
            errors={errors} // Errores de validación
          />
        )}

        {modalEditar && ( // Modal para editar un álbum existente
          <ModalFormulario
            formData={formData} // Datos del formulario
            onClose={closeModalEditar} // Función para cerrar el modal
            onChange={handleInputChange} // Función para manejar cambios en los campos
            onSave={handleUpdateAlbum} // Función para guardar los cambios
            generos={generos} // Lista de géneros disponibles
            errors={errors} // Errores de validación
          />
        )}

        {modalVer && ( // Modal para ver detalles de un álbum
          <ModalVer data={currentAlbum} onClose={closeModalVer} />
        )}
      </div>
    </div>
  );
};

// ModalFormulario
const ModalFormulario = ({
  formData,
  onClose,
  onChange,
  onSave,
  generos,
  errors,
}) => {
  return (
    // Contenedor principal del modal con fondo oscuro semi-transparente
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Cuerpo del modal */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Formulario de Álbum</h2>

        {/* Input para subir imagen */}
        <div className="mb-4 text-center">
          <label className="block text-sm font-semibold text-gray-700 mb-2"></label>
          <div>
            <label
              htmlFor="foto"
              className="inline-block bg-[#067b80] text-white text-sm font-semibold px-4 py-2 rounded-md cursor-pointer hover:bg-[#056b6e] focus:ring-2 focus:ring-[#056b6e] focus:outline-none"
            >
              Subir Imagen
            </label>
            <input
              id="foto"
              type="file"
              name="foto"
              onChange={onChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Campo de entrada para el título */}
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
          {errors.titulo && (
            <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
          )}
        </div>

        {/* Campo de entrada para el artista */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Artista</label>
          <input
            type="text"
            name="artista"
            value={formData.artista}
            onChange={onChange}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.artista ? "border-red-500" : ""
            }`}
          />
          {errors.artista && (
            <p className="text-red-500 text-sm mt-1">{errors.artista}</p>
          )}
        </div>

        {/* Campo de entrada para el año */}
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

        {/* Selector de género */}
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

        {/* Botones para guardar y cerrar */}
        <div className="flex justify-end">
          <button
            onClick={onSave}
            className="bg-blue-500 text-white p-2 rounded-lg mr-2"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-red-400 text-white p-2 rounded-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// ModalVer
const ModalVer = ({ data, onClose }) => {
  return (
    // Contenedor principal del modal con fondo oscuro semi-transparente
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Cuerpo del modal */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Ver Álbum</h2>

        {/* Mostrar la foto del álbum */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Foto</label>
          {data.foto ? (
            <img
              src={URL.createObjectURL(data.foto)}
              alt="Foto"
              className="w-12 h-12 object-cover rounded-md"
            />
          ) : (
            <span>Sin foto</span>
          )}
        </div>

        {/* Mostrar la información del álbum */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Título</label>
          <p>{data.titulo}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Artista</label>
          <p>{data.artista}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Año</label>
          <p>{data.año}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Género</label>
          <p>{data.genero}</p>
        </div>

        {/* Botón para cerrar el modal */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-purple-600 text-white p-2 rounded-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Validación de propiedades con PropTypes
ModalFormulario.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  generos: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
};

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

// ERROR: Album no está definido o importado, lo que provocará un fallo
export default Album;
