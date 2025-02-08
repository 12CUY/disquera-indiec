import { useState } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEdit, FiTrash2, FiRefreshCcw, FiMusic, FiDownload } from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx"; // Importar la librería xlsx
import DOMPurify from "dompurify"; // Librería para sanitizar entradas y prevenir XSS

// Componente principal de gestión usuarios
const Usuarios = () => {
  // Estado inicial de usuarios con datos de ejemplo
  const [usuarios, setUsuarios] = useState([
    {
      nombre: "Usuario 1",
      correo: "usuario1@example.com",
      rol: "Administrador",
      estado: true,
      contraseña: "password1", // Contraseña por defecto
    },
    {
      nombre: "Usuario 2",
      correo: "usuario2@example.com",
      rol: "Cliente",
      estado: true,
      contraseña: "password2", // Contraseña por defecto
    },
  ]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalConfirmarEditar, setModalConfirmarEditar] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    rol: "",
    contraseña: "",
  });
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [loading, setLoading] = useState(false); // Estado para la animación de carga
  const [showSuccess, setShowSuccess] = useState(false); // Estado para el mensaje de éxito
  const CONTRASEÑA_ESPECIFICA = "042005"; // Contraseña específica para eliminar y editar

  // Función para sanitizar entradas usando DOMPurify
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input); // Sanitiza el input para prevenir XSS
  };
  
  
  
  const openModalCrear = () => {
    setFormData({
      nombre: "",
      correo: "",
      rol: "",
      contraseña: "",
    });
    setErrors({});
    setModalCrear(true);
  };
  const closeModalCrear = () => setModalCrear(false);

  const openModalEditar = (index) => {
    setCurrentUsuario(index);
    setFormData(usuarios[index]);
    setErrors({});
    setModalConfirmarEditar(true); // Abre el modal de confirmación para editar
    setConfirmarContraseña(""); // Limpia el campo de contraseña
  };
  const closeModalEditar = () => {
    setModalEditar(false);
    setConfirmarContraseña(""); // Limpia el campo de contraseña al cerrar
  };

  const openModalVer = (index) => {
    setCurrentUsuario(index);
    setModalVer(true);
  };
  const closeModalVer = () => setModalVer(false);

  const openModalEliminar = (index) => {
    setCurrentUsuario(index);
    setModalEliminar(true);
    setConfirmarContraseña(""); // Limpia el campo de contraseña
  };
  const closeModalEliminar = () => {
    setModalEliminar(false);
    setConfirmarContraseña(""); // Limpia el campo de contraseña al cerrar
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
 
    // Para otros campos, sanitizar el valor antes de actualizar el estado
    setFormData({ ...formData, [name]: sanitizeInput(value) });
  
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.correo) newErrors.correo = "El correo es obligatorio.";
    if (!formData.rol) newErrors.rol = "El rol es obligatorio.";
    if (!formData.contraseña) newErrors.contraseña = "La contraseña es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUsuario = () => {
    if (!validateForm()) return;
    closeModalCrear(); // Cerrar el modal antes de iniciar la animación
    setLoading(true); // Mostrar animación de carga
    setTimeout(() => {
      setUsuarios([...usuarios, { ...formData, estado: true }]);
      setLoading(false); // Ocultar animación de carga
      setShowSuccess(true); // Mostrar mensaje de éxito
      setTimeout(() => setShowSuccess(false), 1000); // Ocultar mensaje de éxito después de 1 segundo
    }, 1000); // Simular una carga de 1 segundo
  };

  const handleUpdateUsuario = () => {
    if (!validateForm()) return;
    closeModalEditar(); // Cerrar el modal antes de iniciar la animación
    setLoading(true); // Mostrar animación de carga
    setTimeout(() => {
      const updatedUsuarios = [...usuarios];
      updatedUsuarios[currentUsuario] = { ...formData };
      setUsuarios(updatedUsuarios);
      setLoading(false); // Ocultar animación de carga
      setShowSuccess(true); // Mostrar mensaje de éxito
      setTimeout(() => setShowSuccess(false), 1000); // Ocultar mensaje de éxito después de 1 segundo
    }, 1000); // Simular una carga de 1 segundo
  };

  const handleDeleteUsuario = () => {
    if (confirmarContraseña !== CONTRASEÑA_ESPECIFICA) {
      Swal.fire({
        icon: "error",
        title: "Contraseña incorrecta",
        text: "La contraseña ingresada no es correcta.",
      });
      return;
    }
    setLoading(true); // Mostrar animación de carga
    setTimeout(() => {
      const updatedUsuarios = [...usuarios];
      updatedUsuarios[currentUsuario].estado = false;
      setUsuarios(updatedUsuarios);
      setLoading(false); // Ocultar animación de carga
      setShowSuccess(true); // Mostrar mensaje de éxito
      setTimeout(() => setShowSuccess(false), 1000); // Ocultar mensaje de éxito después de 1 segundo
    }, 1000); // Simular una carga de 1 segundo
  };

  const handleRestoreUsuario = (index) => {
    setLoading(true); // Mostrar animación de carga
    setTimeout(() => {
      const updatedUsuarios = [...usuarios];
      updatedUsuarios[index].estado = true;
      setUsuarios(updatedUsuarios);
      setLoading(false); // Ocultar animación de carga
      setShowSuccess(true); // Mostrar mensaje de éxito
      setTimeout(() => setShowSuccess(false), 1000); // Ocultar mensaje de éxito después de 1 segundo
    }, 1000); // Simular una carga de 1 segundo
  };

  const handleSearchChange = (e) => {
    setSearchTerm(sanitizeInput(e.target.value)); // Sanitizar el término de búsqueda
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsuarios);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
    XLSX.writeFile(workbook, "usuarios.xlsx");
  };

  const handleConfirmarEditar = () => {
    if (confirmarContraseña !== CONTRASEÑA_ESPECIFICA) {
      Swal.fire({
        icon: "error",
        title: "Contraseña incorrecta",
        text: "La contraseña ingresada no es correcta.",
      });
      return;
    }
    setModalConfirmarEditar(false); // Cierra el modal de confirmación
    setModalEditar(true); // Abre el modal de edición
    setConfirmarContraseña(""); // Limpia el campo de contraseña después de confirmar
  };

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-cover bg-center bg-[url('/fondo.gif')]">
      {/* Encabezado */}
      <div
        className="flex flex-col sm:flex-row md:flex-row items-center justify-between p-4 md:ml-72 text-white rounded-lg"
        style={{
          backgroundImage: "url('/img/dc.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "20px",
        }}
      >
        <p
          className="text-center sm:text-left text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
          style={{
            fontSize: "clamp(25px, 8vw, 60px)",
            margin: 0,
          }}
        >
          Usuarios
        </p>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={openModalCrear}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
            style={{
              fontSize: "18px",
            }}
          >
            Agregar Usuario
          </button>
        </div>
      </div>

      {/* Migajas de pan */}
      <div
        className="md:ml-72 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mx-auto bg-blue-100 sm:bg-green-100 md:bg-yellow-100 lg:bg-red-100 xl:bg-purple-100 rounded-lg shadow-lg"
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
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <Link
                to="/dashboard"
                className="text-[#0aa5a9] px-4 py-2 rounded-lg transition duration-300 hover:bg-[#067b80] hover:text-white no-underline"
              >
                Inicio
              </Link>
            </li>
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <span className="text-[#0aa5a9] px-2">/</span>
            </li>
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <span className="text-[#0aa5a9] px-4 py-2 rounded-lg transition duration-300 hover:bg-[#067b80] hover:text-white no-underline">
                Usuarios
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Contenedor de búsqueda y exportar */}
      <div
        className="md:ml-72 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mx-auto bg-gray-100 rounded-lg shadow-lg"
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
          <div className=" w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar Usuario..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
            />
          </div>
          <button
            onClick={handleExportToExcel}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FiDownload />
            Exportar a Excel
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div
        className="flex-1 ml-0 md:ml-72 p-4 rounded-lg overflow-auto"
        style={{
          backgroundColor: "rgba(241, 248, 249, 0.6)", // Fondo transparente
          borderRadius: "20px",
        }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200" style={{
              backgroundImage: `url("https://png.pngtree.com/background/20210714/original/pngtree-blue-music-chord-background-picture-image_1205877.jpg")`,
              
            }} /* Fondo blanco semitransparente */>
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Correo</th>
                <th className="px-4 py-2">Rol</th>
                <th className="px-4 py-2">Contraseña</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              
              {filteredUsuarios.map((usuario, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`border-t ${
                    usuario.estado ? "hover:bg-gray-100" : "bg-gray-300"
                  }`}
                >
                  <td className="px-4 py-2">{usuario.nombre}</td>
                  <td className="px-4 py-2">{usuario.correo}</td>
                  <td className="px-4 py-2">{usuario.rol}</td>
                  <td className="px-4 py-2">{usuario.contraseña}</td>
                  <td className="px-4 py-2">

                    
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        usuario.estado ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {usuario.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                   
                  <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(usuario.correo),
                      }}
                    />
                   
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => openModalVer(index)}
                    >
                      <FiEye className="text-white" size={20} />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => openModalEditar(index)}
                    >
                      <FiEdit className="text-white" size={20} />
                    </motion.div>
                    {usuario.estado ? (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => openModalEliminar(index)}
                      >
                        <FiTrash2 className="text-white" size={20} />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleRestoreUsuario(index)}
                      >
                        <FiRefreshCcw className="text-white" size={20} />
                      </motion.div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Animación de carga */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="border-t-4 border-blue-600 border-solid w-16 h-16 rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-lg text-gray-700">Cargando...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mensaje de éxito */}
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
            onSave={handleAddUsuario}
            errors={errors}
          />
        )}

        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateUsuario}
            errors={errors}
          />
        )}

        {modalVer && (
          <ModalVer data={usuarios[currentUsuario]} onClose={closeModalVer} />
        )}

        {modalEliminar && (
          <ModalEliminar
            onClose={closeModalEliminar}
            onConfirm={handleDeleteUsuario}
            confirmarContraseña={confirmarContraseña}
            setConfirmarContraseña={setConfirmarContraseña}
          />
        )}

        {modalConfirmarEditar && (
          <ModalConfirmarEditar
            onClose={() => setModalConfirmarEditar(false)}
            onConfirm={handleConfirmarEditar}
            confirmarContraseña={confirmarContraseña}
            setConfirmarContraseña={setConfirmarContraseña}
          />
        )}
      </div>
    </div>
  );
};

// ModalFormulario
const ModalFormulario = ({ formData, onClose, onChange, onSave, errors }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Formulario de Usuario</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={onChange}
            className={`border border-gray-300 p-2 rounded-md w-full text-sm ${
              errors.nombre ? "border-red-500" : ""
            }`}
          />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Correo</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={onChange}
            className={`border border-gray-300 p-2 rounded-md w-full text-sm ${
              errors.correo ? "border-red-500" : ""
            }`}
          />
          {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Rol</label>
          <select
            name="rol"
            value={formData.rol}
            onChange={onChange}
            className={`border border-gray-300 p-2 rounded-md w-full text-sm ${
              errors.rol ? "border-red-500" : ""
            }`}
          >
            <option value="">Selecciona un rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Cliente">Cliente</option>
          </select>
          {errors.rol && <p className="text-red-500 text-sm mt-1">{errors.rol}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            name="contraseña"
            value={formData.contraseña}
            onChange={onChange}
            className={`border border-gray-300 p-2 rounded-md w-full text-sm ${
              errors.contraseña ? "border-red-500" : ""
            }`}
          />
          {errors.contraseña && <p className="text-red-500 text-sm mt-1">{errors.contraseña}</p>}
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

// ModalVer
const ModalVer = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Ver Usuario</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <p>{data.nombre}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Correo</label>
          <p>{data.correo}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Rol</label>
          <p>{data.rol}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <p>{data.contraseña}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Estado</label>
          <p>{data.estado ? "Activo" : "Inactivo"}</p>
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

// ModalEliminar
const ModalEliminar = ({ onClose, onConfirm, confirmarContraseña, setConfirmarContraseña }) => {
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!confirmarContraseña) {
      setError("No se ha ingresado una contraseña.");
      return;
    }
    setError("");
    onConfirm();
  };

  const handleClose = () => {
    setError(""); // Limpia el error al cerrar el modal
    onClose(); // Cierra el modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            value={confirmarContraseña}
            onChange={(e) => setConfirmarContraseña(e.target.value)}
            className={`border border-gray-300 p-2 rounded-md w-full text-sm ${
              error ? "border-red-500" : ""
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            className="bg-red-500 text-white p-2 rounded-lg mr-2"
          >
            Confirmar
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-400 text-white p-2 rounded-md"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// ModalConfirmarEditar
const ModalConfirmarEditar = ({ onClose, onConfirm, confirmarContraseña, setConfirmarContraseña }) => {
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!confirmarContraseña) {
      setError("No se ha ingresado una contraseña.");
      return;
    }
    setError("");
    onConfirm();
  };

  const handleClose = () => {
    setError(""); // Limpia el error al cerrar el modal
    onClose(); // Cierra el modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Confirmar Edición</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            value={confirmarContraseña}
            onChange={(e) => setConfirmarContraseña(e.target.value)}
            className={`border border-gray-300 p-2 rounded-md w-full text-sm ${
              error ? "border-red-500" : ""
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            className="bg-blue-500 text-white p-2 rounded-lg mr-2"
          >
            Confirmar
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-400 text-white p-2 rounded-md"
          >
            Cancelar
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
  errors: PropTypes.object.isRequired,
};

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

ModalEliminar.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmarContraseña: PropTypes.string.isRequired,
  setConfirmarContraseña: PropTypes.func.isRequired,
};

ModalConfirmarEditar.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmarContraseña: PropTypes.string.isRequired,
  setConfirmarContraseña: PropTypes.func.isRequired,
};

export default Usuarios;