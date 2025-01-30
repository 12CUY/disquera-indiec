import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FiEye, FiEdit, FiTrash2, FiRefreshCcw } from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
const Eventos = () => {
  const [eventos, setEventos] = useState([
    {
      foto: null,
      nombreEvento: "Concierto de Rock",
      generoMusical: "Rock",
      descripcion: "Evento de música rock",
      ubicacion: "Auditorio A",
      fecha: "2025-02-10",
      contacto: "123456789",
      capacidad: 500,
      artistas: "Bandas locales",
      estado: true,
    },
    {
      foto: null,
      nombreEvento: "Festival de Jazz",
      generoMusical: "Jazz",
      descripcion: "Evento de música jazz",
      ubicacion: "Teatro B",
      fecha: "2025-03-20",
      contacto: "987654321",
      capacidad: 300,
      artistas: "Artistas internacionales",
      estado: true,
    },
  ]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    foto: null,
    nombreEvento: "",
    generoMusical: "",
    descripcion: "",
    ubicacion: "",
    fecha: "",
    contacto: "",
    capacidad: "",
    artistas: "",
  });
  const [currentEvento, setCurrentEvento] = useState(null);

  const openModalCrear = () => setModalCrear(true);
  const closeModalCrear = () => setModalCrear(false);
  const [searchTerm, setSearchTerm] = useState(""); // barra  de  busqueda
  const openModalEditar = (index) => {
    setCurrentEvento(index);
    setFormData(eventos[index]);
    setModalEditar(true);
  };
  const closeModalEditar = () => setModalEditar(false);

  const openModalVer = (index) => {
    setCurrentEvento(index);
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

  const handleAddEvento = () => {
    setEventos([...eventos, { ...formData, estado: true }]);
    Swal.fire({
      icon: "success",
      title: "Evento agregado",
      text: `El evento "${formData.nombreEvento}" fue agregado exitosamente.`,
    });
    closeModalCrear();
  };

  const handleUpdateEvento = () => {
    const updatedEventos = [...eventos];
    updatedEventos[currentEvento] = { ...formData };
    setEventos(updatedEventos);
    Swal.fire({
      icon: "success",
      title: "Evento actualizado",
      text: `El evento "${formData.nombreEvento}" fue actualizado exitosamente.`,
    });
    closeModalEditar();
  };

  const handleDeleteEvento = (index) => {
    const updatedEventos = [...eventos];
    updatedEventos[index].estado = false;
    setEventos(updatedEventos);
    Swal.fire({
      icon: "error",
      title: "Evento desactivado",
      text: "El evento fue marcado como inactivo.",
    });
  };

  const handleRestoreEvento = (index) => {
    const updatedEventos = [...eventos];
    updatedEventos[index].estado = true;
    setEventos(updatedEventos);
    Swal.fire({
      icon: "success",
      title: "Evento restaurado",
      text: "El evento fue restaurado y está activo nuevamente.",
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
        {/* Texto "evento" */}
        <p
          className="text-center sm:text-left text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
          style={{
            fontSize: "clamp(25px, 8vw, 60px)", // Hace que el tamaño de la fuente sea responsivo
            margin: 0, // Asegura que no haya márgenes adicionales
          }}
        >
          Evento
        </p>

        {/* Botón "Agregar evento" */}
        <div className="mt-4 sm:mt-0">
          <button
            onClick={openModalCrear}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
            style={{
              fontSize: "18px", // Ajusta el tamaño de la letra aquí
            }}
          >
            Agregar Evento
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
                Evento
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
            placeholder="Buscar Evento..."
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
                <th className="px-4 py-2">Nombre del Evento</th>
                <th className="px-4 py-2">Género Musical</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Ubicación</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Contacto</th>
                <th className="px-4 py-2">Capacidad</th>
                <th className="px-4 py-2">Artistas</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`border-t ${
                    evento.estado ? "hover:bg-gray-100" : "bg-gray-300"
                  }`}
                >
                  <td className="px-4 py-2">
                    {evento.foto ? (
                      <img
                        src={URL.createObjectURL(evento.foto)}
                        alt="Foto"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td className="px-4 py-2">{evento.nombreEvento}</td>
                  <td className="px-4 py-2">{evento.generoMusical}</td>
                  <td className="px-4 py-2">{evento.descripcion}</td>
                  <td className="px-4 py-2">{evento.ubicacion}</td>
                  <td className="px-4 py-2">{evento.fecha}</td>
                  <td className="px-4 py-2">{evento.contacto}</td>
                  <td className="px-4 py-2">{evento.capacidad}</td>
                  <td className="px-4 py-2">{evento.artistas}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        evento.estado ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {evento.estado ? "Activo" : "Inactivo"}
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
                    {evento.estado ? (
                      <FiTrash2
                        className="text-red-500 cursor-pointer"
                        size={20}
                        onClick={() => handleDeleteEvento(index)}
                      />
                    ) : (
                      <FiRefreshCcw
                        className="text-green-500 cursor-pointer"
                        size={20}
                        onClick={() => handleRestoreEvento(index)}
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
            onSave={handleAddEvento}
          />
        )}

        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateEvento}
          />
        )}

        {modalVer && (
          <ModalVer data={eventos[currentEvento]} onClose={closeModalVer} />
        )}
      </div>
    </div>
  );
};

const ModalFormulario = ({ formData, onClose, onChange, onSave }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Formulario de Evento</h2>
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
          <label className="block text-sm font-medium mb-1">
            Nombre del Evento
          </label>
          <input
            type="text"
            name="nombreEvento"
            value={formData.nombreEvento}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Género Musical
          </label>
          <input
            type="text"
            name="generoMusical"
            value={formData.generoMusical}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contacto</label>
          <input
            type="text"
            name="contacto"
            value={formData.contacto}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Capacidad</label>
          <input
            type="number"
            name="capacidad"
            value={formData.capacidad}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Artistas</label>
          <input
            type="text"
            name="artistas"
            value={formData.artistas}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
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

      </div>
    </div>
  );
};

const ModalVer = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Ver Evento</h2>
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
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Nombre del Evento
          </label>
          <p>{data.nombreEvento}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Género Musical
          </label>
          <p>{data.generoMusical}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <p>{data.descripcion}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Ubicación</label>
          <p>{data.ubicacion}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha</label>
          <p>{data.fecha}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contacto</label>
          <p>{data.contacto}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Capacidad</label>
          <p>{data.capacidad}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Artistas</label>
          <p>{data.artistas}</p>
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
};

ModalFormulario.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Eventos;
