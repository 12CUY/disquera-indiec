import { useState } from "react"; // Hook para manejar el estado en React
import Swal from "sweetalert2"; // Librería para mostrar alertas personalizadas
import { motion } from "framer-motion"; // Librería para animaciones
import {
  FiEye, // Ícono de "ver"
  FiEdit, // Ícono de "editar"
  FiTrash2, // Ícono de "eliminar"
  FiRefreshCcw, // Ícono de "restaurar"
  FiDownload, // Ícono de "descargar"
} from "react-icons/fi"; // Importación de íconos desde react-icons
import PropTypes from "prop-types"; // PropTypes para validación de propiedades
import { Link } from "react-router-dom"; // Link para navegación en React Router
import * as XLSX from "xlsx"; // Librería para exportar archivos Excel
import DOMPurify from "dompurify"; // Librería para sanitizar entradas y prevenir XSS
const Artistas = () => {
  // Estado para almacenar la lista de artistas
  const [artistas, setArtistas] = useState([
    {
      foto: null,
      nombre: "Artista 1",
      genero: "Rock",
      pais: "México",
      biografia: "Biografía del artista 1",
      estado: true, // Indica si el artista está activo
    },
    {
      foto: null,
      nombre: "Artista 2",
      genero: "Pop",
      pais: "Estados Unidos",
      biografia: "Biografía del artista 2",
      estado: true,
    },
  ]);
// Función para sanitizar entradas usando DOMPurify
const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input); // Sanitiza el input para prevenir XSS
};
  // Estados para controlar la visibilidad de los modales
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    foto: null,
    nombre: "",
    genero: "",
    pais: "",
    biografia: "",
  });

  // Estado para rastrear el artista seleccionado
  const [currentArtista, setCurrentArtista] = useState(null);

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Función para abrir el modal de creación
  const openModalCrear = () => setModalCrear(true);
  // Función para cerrar el modal de creación
  const closeModalCrear = () => setModalCrear(false);

  // Función para abrir el modal de edición con los datos del artista seleccionado
  const openModalEditar = (index) => {
    setCurrentArtista(index); // Guarda el índice del artista seleccionado
    setFormData(artistas[index]); // Llena el formulario con los datos del artista
    setModalEditar(true); // Muestra el modal de edición
  };
  // Función para cerrar el modal de edición
  const closeModalEditar = () => setModalEditar(false);

  // Función para abrir el modal de visualización de un artista
  const openModalVer = (index) => {
    setCurrentArtista(index); // Guarda el índice del artista seleccionado
    setModalVer(true); // Muestra el modal de visualización
  };
  // Función para cerrar el modal de visualización
  const closeModalVer = () => setModalVer(false);

  // Maneja los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    // Si el input es un archivo (imagen), se actualiza con el archivo seleccionado
    if (name === "foto") {
      setFormData({ ...formData, foto: files[0] });
    } else {
      // Si es un campo de texto, se actualiza normalmente
      setFormData({ ...formData, [name]: value });
    } 
    setFormData({ ...formData, [name]: sanitizeInput(value) });
    
  };

  // Función para validar que todos los campos del formulario estén llenos
  const validateForm = () => {
    return (
      formData.nombre && // Verifica si el nombre está lleno
      formData.genero && // Verifica si el género está lleno
      formData.pais && // Verifica si el país está lleno
      formData.biografia // Verifica si la biografía está llena
    );
  };

  // Función para agregar un nuevo artista a la lista
const handleAddArtista = () => {
  // Verifica si el formulario es válido antes de agregar un artista
  if (!validateForm()) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Todos los campos son obligatorios.", // Muestra una alerta si falta información
    });
    return;
  }

  // Agrega el nuevo artista a la lista manteniendo los existentes
  setArtistas([...artistas, { ...formData, estado: true }]);

  // Muestra una alerta de éxito al agregar el artista
  Swal.fire({
    icon: "success",
    title: "Artista agregado",
    text: `El artista "${formData.nombre}" fue agregado exitosamente.`,
  });

  closeModalCrear(); // Cierra el modal de creación
};

// Función para actualizar la información de un artista existente
const handleUpdateArtista = () => {
  // Verifica si el formulario es válido antes de actualizar
  if (!validateForm()) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Todos los campos son obligatorios.", // Muestra una alerta si falta información
    });
    return;
  }

  // Crea una copia de la lista de artistas para modificarla
  const updatedArtistas = [...artistas];
  // Reemplaza los datos del artista seleccionado con los nuevos valores
  updatedArtistas[currentArtista] = { ...formData };

  // Actualiza la lista de artistas con los nuevos datos
  setArtistas(updatedArtistas);

  // Muestra una alerta de éxito al actualizar el artista
  Swal.fire({
    icon: "success",
    title: "Artista actualizado",
    text: `El artista "${formData.nombre}" fue actualizado exitosamente.`,
  });

  closeModalEditar(); // Cierra el modal de edición
};

// Función para desactivar un artista (eliminación lógica)
const handleDeleteArtista = (index) => {
  Swal.fire({
    title: "¿Estás seguro?", // Mensaje de confirmación
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, desactivar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Crea una copia de la lista de artistas
      const updatedArtistas = [...artistas];
      // Cambia el estado del artista a "false" (inactivo)
      updatedArtistas[index].estado = false;
      // Actualiza la lista con los cambios
      setArtistas(updatedArtistas);

      // Muestra una alerta indicando que el artista ha sido desactivado
      Swal.fire({
        icon: "error",
        title: "Artista desactivado",
        text: "El artista fue marcado como inactivo.",
      });
    }
  });
};

// Función para restaurar un artista previamente desactivado
const handleRestoreArtista = (index) => {
  // Crea una copia de la lista de artistas
  const updatedArtistas = [...artistas];
  // Cambia el estado del artista a "true" (activo)
  updatedArtistas[index].estado = true;
  // Actualiza la lista con los cambios
  setArtistas(updatedArtistas);

  // Muestra una alerta indicando que el artista ha sido restaurado
  Swal.fire({
    icon: "success",
    title: "Artista restaurado",
    text: "El artista fue restaurado y está activo nuevamente.",
  });
};

// Función para manejar la búsqueda de artistas en la lista
const handleSearchChange = (e) => {
  setSearchTerm(sanitizeInput(e.target.value)); // Actualiza el término de búsqueda con el valor del input
};

// Función para exportar la lista de artistas a un archivo Excel
const handleExportExcel = () => {
  // Convreturnierte la lista de artistas en un formato adecuado para Excel
  const worksheet = XLSX.utils.json_to_sheet(artistas);
  // Crea un nuevo libro de Excel
  const workbook = XLSX.utils.book_new();
  // Agrega la hoja de datos al libro de Excel
  XLSX.utils.book_append_sheet(workbook, worksheet, "Artistas");
  // Descarga el archivo con el nombre "artistas.xlsx"
  XLSX.writeFile(workbook, "artistas.xlsx");
};

// Filtra la lista de artistas según el término de búsqueda ingresado
const filteredArtistas = artistas.filter((artista) =>
  artista.nombre.toLowerCase().includes(searchTerm.toLowerCase()) // Compara en minúsculas para evitar problemas de mayúsculas/minúsculas
);
 return(
  <div className="p-8 min-h-screen bg-cover bg-center bg-[url('/fondo.gif')]">
    {/* Encabezado */}
    <div
      className="flex flex-col sm:flex-row md:flex-row items-center justify-between p-4 md:ml-72 text-white rounded-lg"
      style={{
        backgroundImage: "url('/img/dc.jpg')", // Imagen de fondo para el encabezado
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "20px", // Bordes redondeados
      }}
    >
      <p
        className="text-center sm:text-left text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
        style={{
          fontSize: "clamp(25px, 8vw, 60px)", // Tamaño de fuente adaptable
          margin: 0,
        }}
      >
        Artistas
      </p>
      <div className="mt-4 sm:mt-0">
        <motion.button
          onClick={openModalCrear} // Botón para abrir el modal de agregar artista
          className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
          style={{
            fontSize: "18px", // Tamaño de fuente del botón
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Agregar Artista
        </motion.button>
      </div>
    </div>

    {/* Migas de pan */}
    <div
      className="md:ml-72 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mx-auto bg-blue-100 sm:bg-green-100 md:bg-yellow-100 lg:bg-red-100 xl:bg-purple-100 rounded-lg shadow-lg"
      style={{
        backgroundColor: "#f1f8f9", // Color de fondo del contenedor de navegación
        borderRadius: "20px",
        marginTop: "20px",
        marginBottom: "20px",
        height: "auto",
        padding: "10px",
      }}
    >
      <nav aria-label="breadcrumb"> {/* Navegación de migas de pan */}
        <ol className="flex flex-wrap gap-2 list-none p-0 m-0 justify-center items-center">
          <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
            <Link
              to="/dashboard"
              className="text-[#0aa5a9] px-4 py-2 rounded-lg transition duration-300 hover:bg-[#067b80] hover:text-white no-underline"
            >
              Inicio
            </Link>
          </li>
          <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
            <span className="text-[#0aa5a9] px-2">/</span> {/* Separador de rutas */}
          </li>
          <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
            <span className="text-[#0aa5a9] px-4 py-2 rounded-lg transition duration-300 hover:bg-[#067b80] hover:text-white no-underline">
              Artistas
            </span>
          </li>
        </ol>
      </nav>
    </div>

    {/* Contenedor de búsqueda y exportar */}
    <div
      className="md:ml-72 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mx-auto bg-gray-100 rounded-lg shadow-lg"
      style={{
        backgroundColor: "#f1f8f9", // Color de fondo del contenedor de búsqueda
        borderRadius: "20px",
        marginTop: "20px",
        marginBottom: "20px",
        height: "auto",
        padding: "10px",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
        
        <div className=" w-full sm:w-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <input
            type="text"
            placeholder="Buscar Artista..."
            value={searchTerm}
            onChange={handleSearchChange} // Input de búsqueda
            className="border border-gray-300 p-2 rounded-lg w-full pl-10"
          />
        </div>
        <motion.button
          onClick={handleExportExcel} // Botón para exportar la lista de artistas a Excel
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiDownload className="text-white" />
          Exportar a Excel
        </motion.button>
      </div>
    </div>


    {/* Tabla de artistas */}
<div
  className="flex-1 ml-0 md:ml-72 p-4 rounded-lg overflow-auto"
  style={{
    backgroundColor: "rgba(241, 248, 249, 0.6)", // Fondo transparente
    borderRadius: "20px", // Bordes redondeados
  }}
>
  {/* Contenedor para la tabla con desplazamiento horizontal */}
  <div className="overflow-x-auto">
    {/* Tabla de artistas */}
    <table
      className="min-w-full table-auto rounded-lg shadow-md"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }} // Fondo blanco con opacidad
    >
      {/* Encabezado de la tabla */}
      <thead className="bg-gray-200"
       style={{
        backgroundImage: `url("https://png.pngtree.com/background/20210714/original/pngtree-blue-music-chord-background-picture-image_1205877.jpg")`,
        
      }} /* Fondo blanco semitransparente */>
        <tr>
          <th className="px-4 py-2">Foto</th> {/* Columna para la foto del artista */}
          <th className="px-4 py-2">Nombre</th> {/* Columna para el nombre del artista */}
          <th className="px-4 py-2">Género</th> {/* Columna para el género del artista */}
          <th className="px-4 py-2">País</th> {/* Columna para el país del artista */}
          <th className="px-4 py-2">Biografía</th> {/* Columna para la biografía del artista */}
          <th className="px-4 py-2">Estado</th> {/* Columna para el estado del artista */}
          <th className="px-4 py-2">Acciones</th> {/* Columna para las acciones (ver, editar, eliminar/restaurar) */}
        </tr>
      </thead>
      <tbody>
        {/* Mapeo de los artistas filtrados */}
        {filteredArtistas.map((artista, index) => (
          <motion.tr
            key={index}
            initial={{ opacity: 0 }} // Animación de entrada: opacidad 0
            animate={{ opacity: 1 }} // Animación de salida: opacidad 1
            exit={{ opacity: 0 }} // Animación de salida: opacidad 0
            transition={{ duration: 0.5 }} // Duración de la transición
            className={`border-t ${
              artista.estado ? "hover:bg-gray-100" : "bg-gray-300"
            }`} // Fondo diferente si el estado es activo o inactivo
          >
            {/* Columna para la foto del artista */}
            <td className="px-4 py-2">
              {artista.foto ? (
                <img
                  src={URL.createObjectURL(artista.foto)} // Imagen de la foto del artista
                  alt="Foto"
                  className="w-12 h-12 object-cover rounded-md" // Estilos de la imagen (tamaño, redondeo)
                />
              ) : (
                "Sin foto" // Texto cuando no hay foto disponible
              )}
            </td>
            {/* Columna para el nombre del artista */}
            <td className="px-4 py-2">{artista.nombre}</td>
            {/* Columna para el género del artista */}
            <td className="px-4 py-2">{artista.genero}</td>
            {/* Columna para el país del artista */}
            <td className="px-4 py-2">{artista.pais}</td>
            {/* Columna para la biografía del artista */}
            <td className="px-4 py-2">{artista.biografia}</td>
            {/* Columna para mostrar el estado del artista */}
            <td className="px-4 py-2">
              
              
              <span
                className={`px-3 py-1 rounded-full text-white ${
                  artista.estado ? "bg-green-500" : "bg-red-500"
                }`} // Cambio de color según el estado (activo/inactivo)
              >
                {artista.estado ? "Activo" : "Inactivo"} {/* Texto que muestra el estado */}
              </span>
            </td>
            {/* Columna para las acciones (ver, editar, eliminar/restaurar) */}
            <td className="px-4 py-2 flex space-x-2">
              {/* Acción de ver */}
              <motion.div
                className="p-2 bg-blue-500 rounded-lg"
                whileHover={{ scale: 1.1 }} // Efecto de hover (aumento de tamaño)
                whileTap={{ scale: 0.9 }} // Efecto al hacer clic (disminuye tamaño)
              >
                <FiEye
                  className="text-white cursor-pointer"
                  size={20}
                  onClick={() => openModalVer(index)} // Abre el modal de ver artista
                />
              </motion.div>
              {/* Acción de editar */}
              <motion.div
                className="p-2 bg-yellow-500 rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiEdit
                  className="text-white cursor-pointer"
                  size={20}
                  onClick={() => openModalEditar(index)} // Abre el modal de editar artista
                />
              </motion.div>
              {/* Acción de eliminar/restaurar */}
              {artista.estado ? (
                // Si el artista está activo, se muestra la opción de eliminar
                <motion.div
                  className="p-2 bg-red-500 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiTrash2
                    className="text-white cursor-pointer"
                    size={20}
                    onClick={() => handleDeleteArtista(index)} // Elimina el artista (cambio de estado)
                  />
                </motion.div>
              ) : (
                // Si el artista está inactivo, se muestra la opción de restaurar
                <motion.div
                  className="p-2 bg-green-500 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiRefreshCcw
                    className="text-white cursor-pointer"
                    size={20}
                    onClick={() => handleRestoreArtista(index)} // Restaura el artista (cambio de estado)
                  />
                </motion.div>
              )}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Modales */}
  {/* Modal para crear un artista */}
  {modalCrear && (
    <ModalFormulario
      formData={formData}
      onClose={closeModalCrear} // Cierra el modal de creación
      onChange={handleInputChange} // Maneja los cambios en el formulario
      onSave={handleAddArtista} // Guarda el nuevo artista
    />
  )}

  {/* Modal para editar un artista */}
  {modalEditar && (
    <ModalFormulario
      formData={formData}
      onClose={closeModalEditar} // Cierra el modal de edición
      onChange={handleInputChange} // Maneja los cambios en el formulario
      onSave={handleUpdateArtista} // Guarda los cambios del artista
    />
  )}

  {/* Modal para ver los detalles de un artista */}
  {modalVer && (
    <ModalVer data={artistas[currentArtista]} onClose={closeModalVer} /> // Muestra los detalles del artista
  )}
</div>
    </div>
  );
};

// Componente ModalFormulario que maneja el formulario para crear o editar un artista.
const ModalFormulario = ({ formData, onClose, onChange, onSave }) => {
  // Verifica si el formulario es válido, es decir, si todos los campos requeridos están llenos.
  const isFormValid =
    formData.nombre && formData.genero && formData.pais && formData.biografia;

  return (
    // Crea una capa de fondo semitransparente que cubre toda la pantalla y un modal centrado.
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }} // Estado inicial (invisible)
      animate={{ opacity: 1 }} // Estado final (visible)
      exit={{ opacity: 0 }} // Estado cuando se cierra (invisible)
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto"
        initial={{ y: -50, opacity: 0 }} // Movimiento inicial hacia arriba con opacidad 0
        animate={{ y: 0, opacity: 1 }} // Animación de entrada (en la posición original con opacidad completa)
        exit={{ y: -50, opacity: 0 }} // Animación de salida (se mueve hacia arriba con opacidad 0)
      >
        <h2 className="text-xl font-bold mb-4">Formulario de Artista</h2>
        
        {/* Sección para subir la foto del artista */}
        <div className="mb-4 text-center">
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
            onChange={onChange} // Llama a la función onChange cuando cambia el valor del input
            className="hidden" // Oculta el input real
          />
        </div>

        {/* Sección para ingresar el nombre del artista */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre} // Muestra el valor actual de 'nombre'
            onChange={onChange} // Llama a la función onChange cuando cambia el valor del input
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>

        {/* Sección para ingresar el género del artista */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Género</label>
          <input
            type="text"
            name="genero"
            value={formData.genero} // Muestra el valor actual de 'genero'
            onChange={onChange} // Llama a la función onChange cuando cambia el valor del input
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>

        {/* Sección para ingresar el país del artista */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">País</label>
          <input
            type="text"
            name="pais"
            value={formData.pais} // Muestra el valor actual de 'pais'
            onChange={onChange} // Llama a la función onChange cuando cambia el valor del input
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>

        {/* Sección para ingresar la biografía del artista */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Biografía</label>
          <textarea
            name="biografia"
            value={formData.biografia} // Muestra el valor actual de 'biografia'
            onChange={onChange} // Llama a la función onChange cuando cambia el valor del input
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>

        {/* Sección para los botones de acción: Guardar y Cerrar */}
        <div className="flex justify-end">
          <motion.button
            onClick={onSave} // Llama a la función onSave al hacer clic en el botón
            className="bg-blue-500 text-white p-2 rounded-lg mr-2 disabled:bg-gray-400"
            disabled={!isFormValid} // Deshabilita el botón si el formulario no es válido
            whileHover={{ scale: isFormValid ? 1.05 : 1 }} // Animación al pasar el mouse por encima
            whileTap={{ scale: isFormValid ? 0.95 : 1 }} // Animación al hacer clic
          >
            Guardar
          </motion.button>
          <motion.button
            onClick={onClose} // Llama a la función onClose al hacer clic en el botón
            className="bg-red-400 text-white p-2 rounded-md"
            whileHover={{ scale: 1.05 }} // Animación al pasar el mouse por encima
            whileTap={{ scale: 0.95 }} // Animación al hacer clic
          >
            Cerrar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente ModalVer para ver los detalles de un artista.
const ModalVer = ({ data, onClose }) => {
  return (
    // Similar al ModalFormulario, crea un modal centrado con fondo semitransparente
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }} // Estado inicial (invisible)
      animate={{ opacity: 1 }} // Estado final (visible)
      exit={{ opacity: 0 }} // Estado cuando se cierra (invisible)
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto"
        initial={{ y: -50, opacity: 0 }} // Movimiento inicial hacia arriba con opacidad 0
        animate={{ y: 0, opacity: 1 }} // Animación de entrada (en la posición original con opacidad completa)
        exit={{ y: -50, opacity: 0 }} // Animación de salida (se mueve hacia arriba con opacidad 0)
      >
        <h2 className="text-xl font-bold mb-4">Ver Artista</h2>

        {/* Muestra la foto del artista */}
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

        {/* Muestra los detalles del artista */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <p>{data.nombre}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Género</label>
          <p>{data.genero}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">País</label>
          <p>{data.pais}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Biografía</label>
          <p>{data.biografia}</p>
        </div>

        {/* Botón para cerrar el modal */}
        <div className="flex justify-end">
          <motion.button
            onClick={onClose} // Llama a la función onClose al hacer clic en el botón
            className="bg-purple-500 text-white p-2 rounded-md"
            whileHover={{ scale: 1.05 }} // Animación al pasar el mouse por encima
            whileTap={{ scale: 0.95 }} // Animación al hacer clic
          >
            Cerrar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Definición de los propTypes para asegurar que los tipos de las propiedades sean correctos
ModalFormulario.propTypes = {
  formData: PropTypes.object.isRequired, // formData debe ser un objeto
  onClose: PropTypes.func.isRequired, // onClose debe ser una función
  onChange: PropTypes.func.isRequired, // onChange debe ser una función
  onSave: PropTypes.func.isRequired, // onSave debe ser una función
};

ModalVer.propTypes = {
  data: PropTypes.object.isRequired, // data debe ser un objeto
  onClose: PropTypes.func.isRequired, // onClose debe ser una función
};

export default Artistas; // Exporta el componente para su uso en otras partes de la aplicación