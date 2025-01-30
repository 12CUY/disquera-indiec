import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FiEye, FiEdit, FiTrash2, FiRefreshCcw } from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Manager = () => {
  const [managers, setManagers] = useState([
    {
      foto: null,
      apellidos: "Perez",
      nombres: "Juan",
      correo: "juan.perez@example.com",
      genero: "Masculino",
      estado: true,
    },
    {
      foto: null,
      apellidos: "Gomez",
      nombres: "Maria",
      correo: "maria.gomez@example.com",
      genero: "Femenino",
      estado: true,
    },
  ]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    foto: null,
    apellidos: "",
    nombres: "",
    correo: "",
    genero: "",
  });
  const [currentManager, setCurrentManager] = useState(null);

  const openModalCrear = () => setModalCrear(true);
  const closeModalCrear = () => setModalCrear(false);
  const [searchTerm, setSearchTerm] = useState(""); // barra  de  busqueda
  const openModalEditar = (index) => {
    setCurrentManager(index);
    setFormData(managers[index]);
    setModalEditar(true);
  };
  const closeModalEditar = () => setModalEditar(false);

  const openModalVer = (index) => {
    setCurrentManager(index);
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

  const handleAddManager = () => {
    setManagers([...managers, { ...formData, estado: true }]);
    Swal.fire({
      icon: "success",
      title: "Usuario agregado",
      text: `El usuario "${formData.nombres}" fue agregado exitosamente.`,
    });
    closeModalCrear();
  };

  const handleUpdateManager = () => {
    const updatedManagers = [...managers];
    updatedManagers[currentManager] = { ...formData };
    setManagers(updatedManagers);
    Swal.fire({
      icon: "success",
      title: "Usuario actualizado",
      text: `El usuario "${formData.nombres}" fue actualizado exitosamente.`,
    });
    closeModalEditar();
  };

  const handleDeleteManager = (index) => {
    const updatedManagers = [...managers];
    updatedManagers[index].estado = false;
    setManagers(updatedManagers);
    Swal.fire({
      icon: "error",
      title: "Usuario desactivado",
      text: "El usuario fue marcado como inactivo.",
    });
  };

  const handleRestoreManager = (index) => {
    const updatedManagers = [...managers];
    updatedManagers[index].estado = true;
    setManagers(updatedManagers);
    Swal.fire({
      icon: "success",
      title: "Usuario restaurado",
      text: "El usuario fue restaurado y está activo nuevamente.",
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
          Manager
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
            Agregar Manager
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
                Manager
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
            placeholder="Buscar Manager..."
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
                <th className="px-4 py-2">Apellidos</th>
                <th className="px-4 py-2">Nombres</th>
                <th className="px-4 py-2">Correo</th>
                <th className="px-4 py-2">Género</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((manager, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`border-t ${
                    manager.estado ? "hover:bg-gray-100" : "bg-gray-300"
                  }`}
                >
                  <td className="px-4 py-2">
                    {manager.foto ? (
                      <img
                        src={URL.createObjectURL(manager.foto)}
                        alt="Foto"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td className="px-4 py-2">{manager.apellidos}</td>
                  <td className="px-4 py-2">{manager.nombres}</td>
                  <td className="px-4 py-2">{manager.correo}</td>
                  <td className="px-4 py-2">{manager.genero}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        manager.estado ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {manager.estado ? "Activo" : "Inactivo"}
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
                    {manager.estado ? (
                      <FiTrash2
                        className="text-red-500 cursor-pointer"
                        size={20}
                        onClick={() => handleDeleteManager(index)}
                      />
                    ) : (
                      <FiRefreshCcw
                        className="text-green-500 cursor-pointer"
                        size={20}
                        onClick={() => handleRestoreManager(index)}
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
            onSave={handleAddManager}
          />
        )}

        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateManager}
          />
        )}

        {modalVer && (
          <ModalVer data={managers[currentManager]} onClose={closeModalVer} />
        )}
      </div>
    </div>
  );
};

const ModalFormulario = ({ formData, onClose, onChange, onSave }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Formulario de Usuario</h2>
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
          <label className="block text-sm font-medium mb-1">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombres</label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Correo</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Género</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full"
          >
            <option value="">Seleccionar</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Ver Usuario</h2>
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
          <label className="block text-sm font-medium mb-1">Apellidos</label>
          <p>{data.apellidos}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombres</label>
          <p>{data.nombres}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Correo</label>
          <p>{data.correo}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Género</label>
          <p>{data.genero}</p>
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

export default Manager;
