import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FiEye, FiEdit, FiTrash2, FiRefreshCcw } from "react-icons/fi"; // Añadido el ícono de restaurar
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Componente principal
const Musica = () => {
  const [canciones, setCanciones] = useState([
    {
      foto: null,
      nombreCancion: "Canción 1",
      nombreArtista: "Artista 1",
      generoMusical: "Rock",
      album: "Álbum 1",
      estado: "Activo",
    },
    {
      foto: null,
      nombreCancion: "Canción 2",
      nombreArtista: "Artista 2",
      generoMusical: "Pop",
      album: "Álbum 2",
      estado: "Activo",
    },
  ]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    foto: null,
    nombreCancion: "",
    nombreArtista: "",
    generoMusical: "",
    album: "",
    estado: "Activo",
  });
  const [currentCancion, setCurrentCancion] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // barra  de  busqueda
  const openModalCrear = () => setModalCrear(true);
  const closeModalCrear = () => setModalCrear(false);

  const openModalEditar = (index) => {
    setCurrentCancion(index);
    setFormData(canciones[index]);
    setModalEditar(true);
  };
  const closeModalEditar = () => setModalEditar(false);

  const openModalVer = (index) => {
    setCurrentCancion(index);
    setModalVer(true);
  };
  const closeModalVer = () => setModalVer(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setFormData({ ...formData, foto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddCancion = () => {
    setCanciones([...canciones, { ...formData }]);
    Swal.fire({
      icon: "success",
      title: "Canción agregada",
      text: `La canción "${formData.nombreCancion}" fue agregada exitosamente.`,
    });
    closeModalCrear();
  };

  const handleUpdateCancion = () => {
    const updatedCanciones = [...canciones];
    updatedCanciones[currentCancion] = { ...formData };
    setCanciones(updatedCanciones);
    Swal.fire({
      icon: "success",
      title: "Canción actualizada",
      text: `La canción "${formData.nombreCancion}" fue actualizada exitosamente.`,
    });
    closeModalEditar();
  };

  const handleDeleteCancion = (index) => {
    const updatedCanciones = [...canciones];
    updatedCanciones[index].estado = "Inactivo";
    setCanciones(updatedCanciones);
    Swal.fire({
      icon: "error",
      title: "Canción desactivada",
      text: "La canción fue marcada como inactiva.",
    });
  };
  const handleRestoreCancion = (index) => {
    const updatedCanciones = [...canciones];
    updatedCanciones[index].estado = "Activo";
    setCanciones(updatedCanciones);
    Swal.fire({
      icon: "success",
      title: "Canción restaurada",
      text: "La canción fue restaurada y está activa nuevamente.",
    });
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // barra  de busqueda
  };

  const handleCardClick = () => {
    Swal.fire({
      icon: "info",
      title: "Función en desarrollo",
      text: "Esta función aún no está implementada.", // funcion del boton tarj
    });
  };

  return (
    <div className="p-8">
      <div
        className="flex flex-col sm:flex-row md:flex-row items-center justify-between p-4 md:ml-72 text-white rounded-lg"
        style={{
          backgroundImage: "url('/img/dc.jpg')", // Usa la ruta relativa de la imagen dentro de public
          backgroundSize: "cover", // Ajusta para que la imagen cubra todo el contenedor
          backgroundPosition: "center", // Centra la imagen
          borderRadius: "20px", // Cambia este valor para ajustar el redondeo
        }}
      >
        {/* Texto "Canción" */}
        <p
          className="text-center sm:text-left text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
          style={{
            fontSize: "clamp(25px, 8vw, 60px)", // Hace que el tamaño de la fuente sea responsivo
            margin: 0, // Asegura que no haya márgenes adicionales
          }}
        >
          Canción
        </p>

        {/* Botón "Agregar Canción" */}
        <div className="mt-4 sm:mt-0">
          <button
            onClick={openModalCrear}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
            style={{
              fontSize: "18px", // Ajusta el tamaño de la letra aquí
            }}
          >
            Agregar Canción
          </button>
        </div>
      </div>
      {/* migajas de pan */}
      <div
        className="md:ml-72 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mx-auto bg-blue-100 sm:bg-green-100 md:bg-yellow-100 lg:bg-red-100 xl:bg-purple-100 rounded-lg shadow-lg"
        style={{
          backgroundColor: "#f1f8f9", // Color de fondo
          borderRadius: "20px", // Bordes redondeados
          marginTop: "20px", // Espaciado superior
          marginBottom: "20px", // Espaciado inferior
          height: "auto", // Ajusta el tamaño a su contenido
          padding: "10px", // Ajusta el relleno si es necesario
        }}
      >
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap gap-2 list-none p-0 m-0 justify-center items-center">
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

            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <span className="text-[#0aa5a9] px-4 py-2 rounded-lg transition duration-300 hover:bg-[#067b80] hover:text-white no-underline">
                Canción
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Contenedor de búsqueda */}
      <div
        className="md:ml-72 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mx-auto bg-gray-100 rounded-lg shadow-lg"
        style={{
          backgroundColor: "#f1f8f9", // Color de fondo
          borderRadius: "20px", // Bordes redondeados
          marginTop: "20px", // Espaciado superior
          marginBottom: "20px", // Espaciado inferior
          height: "auto", // Ajusta el tamaño a su contenido
          padding: "10px", // Ajusta el relleno si es necesario
        }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
          {/* Botón al lado izquierdo con hover más opaco */}
          <button
            className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-300 transition-colors duration-300 w-full sm:w-auto"
            onClick={handleCardClick}
          >
            Tarj.
          </button>
          {/* Input con tamaño dinámico */}
          <input
            type="text"
            placeholder="Buscar Canción..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 p-2 rounded-lg w-full sm:w-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
          />
        </div>
      </div>

      {/* Este es  el contedor  que  se encuentra debajo de la tabla de datos  */}
      <div
        className="flex-1 ml-0 md:ml-72  p-4 rounded-lg overflow-auto"
        style={{
          backgroundColor: "#f1f8f9  ", // Aplica el color de fondo aquí
        }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Foto</th>
                <th className="px-4 py-2">Nombre de la Canción</th>
                <th className="px-4 py-2">Nombre del Artista</th>
                <th className="px-4 py-2">Género Musical</th>
                <th className="px-4 py-2">Álbum</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {canciones.map((cancion, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`border-t ${
                    cancion.estado === "Activo"
                      ? "hover:bg-gray-100"
                      : "bg-gray-300"
                  }`}
                >
                  <td className="px-4 py-2">
                    {cancion.foto ? (
                      <img
                        src={URL.createObjectURL(cancion.foto)}
                        alt="Foto"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td className="px-4 py-2">{cancion.nombreCancion}</td>
                  <td className="px-4 py-2">{cancion.nombreArtista}</td>
                  <td className="px-4 py-2">{cancion.generoMusical}</td>
                  <td className="px-4 py-2">{cancion.album}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        cancion.estado === "Activo"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {cancion.estado}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    <FiEye
                      className="text-blue-500 cursor-pointer"
                      size={20}
                      onClick={() => openModalVer(index)}
                    />
                    <FiEdit
                      className="text-yellow-500 cursor-pointer"
                      size={20}
                      onClick={() => openModalEditar(index)}
                    />
                    {cancion.estado === "Activo" ? (
                      <FiTrash2
                        className="text-red-500 cursor-pointer"
                        size={20}
                        onClick={() => handleDeleteCancion(index)}
                      />
                    ) : (
                      <FiRefreshCcw
                        className="text-green-500 cursor-pointer"
                        size={20}
                        onClick={() => handleRestoreCancion(index)}
                      />
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modales */}
        {modalCrear && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalCrear}
            onChange={handleInputChange}
            onSave={handleAddCancion}
          />
        )}

        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateCancion}
          />
        )}

        {modalVer && (
          <ModalVer
            cancion={canciones[currentCancion]}
            onClose={closeModalVer}
          />
        )}
      </div>
    </div> // aki cierra  el contedor  que esta  debajo de la tabla
  );
};

// ModalFormulario
const ModalFormulario = ({ formData, onClose, onChange, onSave }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Formulario de Canción</h2>
      <form>
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

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Nombre de la Canción
          </label>
          <input
            type="text"
            name="nombreCancion"
            value={formData.nombreCancion}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Nombre del Artista
          </label>
          <input
            type="text"
            name="nombreArtista"
            value={formData.nombreArtista}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Género Musical
          </label>
          <input
            type="text"
            name="generoMusical"
            value={formData.generoMusical}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Álbum</label>
          <input
            type="text"
            name="album"
            value={formData.album}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
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

      </form>
    </div>
  </div>
);

// ModalVer
const ModalVer = ({ cancion, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Ver Canción</h2>
      <div className="mb-4">
        <strong>Foto:</strong>
        {cancion.foto ? (
          <img
            src={URL.createObjectURL(cancion.foto)}
            alt="Foto"
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          "Sin foto"
        )}
      </div>
      <div className="mb-4">
        <strong>Nombre de la Canción:</strong>
        <p>{cancion.nombreCancion}</p>
      </div>
      <div className="mb-4">
        <strong>Nombre del Artista:</strong>
        <p>{cancion.nombreArtista}</p>
      </div>
      <div className="mb-4">
        <strong>Género Musical:</strong>
        <p>{cancion.generoMusical}</p>
      </div>
      <div className="mb-4">
        <strong>Álbum:</strong>
        <p>{cancion.album}</p>
      </div>
      <div className="mb-4">
        <strong>Estado:</strong>
        <p>{cancion.estado}</p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-purple-500 text-white p-2 rounded-md"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
);

// PropTypes
ModalFormulario.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

ModalVer.propTypes = {
  cancion: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Musica;
