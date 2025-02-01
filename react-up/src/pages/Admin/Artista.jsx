import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCcw,
  FiDownload,
} from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

const Artistas = () => {
  const [artistas, setArtistas] = useState([
    {
      foto: null,
      nombre: "Artista 1",
      genero: "Rock",
      pais: "México",
      biografia: "Biografía del artista 1",
      estado: true,
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

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    foto: null,
    nombre: "",
    genero: "",
    pais: "",
    biografia: "",
  });
  const [currentArtista, setCurrentArtista] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const openModalCrear = () => setModalCrear(true);
  const closeModalCrear = () => setModalCrear(false);

  const openModalEditar = (index) => {
    setCurrentArtista(index);
    setFormData(artistas[index]);
    setModalEditar(true);
  };
  const closeModalEditar = () => setModalEditar(false);

  const openModalVer = (index) => {
    setCurrentArtista(index);
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

  const validateForm = () => {
    return (
      formData.nombre && formData.genero && formData.pais && formData.biografia
    );
  };

  const handleAddArtista = () => {
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos son obligatorios.",
      });
      return;
    }

    setArtistas([...artistas, { ...formData, estado: true }]);
    Swal.fire({
      icon: "success",
      title: "Artista agregado",
      text: `El artista "${formData.nombre}" fue agregado exitosamente.`,
    });
    closeModalCrear();
  };

  const handleUpdateArtista = () => {
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos son obligatorios.",
      });
      return;
    }

    const updatedArtistas = [...artistas];
    updatedArtistas[currentArtista] = { ...formData };
    setArtistas(updatedArtistas);
    Swal.fire({
      icon: "success",
      title: "Artista actualizado",
      text: `El artista "${formData.nombre}" fue actualizado exitosamente.`,
    });
    closeModalEditar();
  };

  const handleDeleteArtista = (index) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, desactivar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedArtistas = [...artistas];
        updatedArtistas[index].estado = false;
        setArtistas(updatedArtistas);
        Swal.fire({
          icon: "error",
          title: "Artista desactivado",
          text: "El artista fue marcado como inactivo.",
        });
      }
    });
  };

  const handleRestoreArtista = (index) => {
    const updatedArtistas = [...artistas];
    updatedArtistas[index].estado = true;
    setArtistas(updatedArtistas);
    Swal.fire({
      icon: "success",
      title: "Artista restaurado",
      text: "El artista fue restaurado y está activo nuevamente.",
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };



  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(artistas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Artistas");
    XLSX.writeFile(workbook, "artistas.xlsx");
  };

  const filteredArtistas = artistas.filter((artista) =>
    artista.nombre.toLowerCase().includes(searchTerm.toLowerCase())
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
          Artistas
        </p>
        <div className="mt-4 sm:mt-0">
          <motion.button
            onClick={openModalCrear}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
            style={{
              fontSize: "18px",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Agregar Artista
          </motion.button>
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
          backgroundColor: "#f1f8f9",
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
              onChange={handleSearchChange}
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
            />
          </div>
          <motion.button
            onClick={handleExportExcel}
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
          borderRadius: "20px",
        }}
      >
        <div className="overflow-x-auto">
          <table
            className="min-w-full table-auto rounded-lg shadow-md"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
          >
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Foto</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Género</th>
                <th className="px-4 py-2">País</th>
                <th className="px-4 py-2">Biografía</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredArtistas.map((artista, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`border-t ${
                    artista.estado ? "hover:bg-gray-100" : "bg-gray-300"
                  }`}
                >
                  <td className="px-4 py-2">
                    {artista.foto ? (
                      <img
                        src={URL.createObjectURL(artista.foto)}
                        alt="Foto"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td className="px-4 py-2">{artista.nombre}</td>
                  <td className="px-4 py-2">{artista.genero}</td>
                  <td className="px-4 py-2">{artista.pais}</td>
                  <td className="px-4 py-2">{artista.biografia}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        artista.estado ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {artista.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    <motion.div
                      className="p-2 bg-blue-500 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiEye
                        className="text-white cursor-pointer"
                        size={20}
                        onClick={() => openModalVer(index)}
                      />
                    </motion.div>
                    <motion.div
                      className="p-2 bg-yellow-500 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiEdit
                        className="text-white cursor-pointer"
                        size={20}
                        onClick={() => openModalEditar(index)}
                      />
                    </motion.div>
                    {artista.estado ? (
                      <motion.div
                        className="p-2 bg-red-500 rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiTrash2
                          className="text-white cursor-pointer"
                          size={20}
                          onClick={() => handleDeleteArtista(index)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="p-2 bg-green-500 rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiRefreshCcw
                          className="text-white cursor-pointer"
                          size={20}
                          onClick={() => handleRestoreArtista(index)}
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
        {modalCrear && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalCrear}
            onChange={handleInputChange}
            onSave={handleAddArtista}
          />
        )}

        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateArtista}
          />
        )}

        {modalVer && (
          <ModalVer data={artistas[currentArtista]} onClose={closeModalVer} />
        )}
      </div>
    </div>
  );
};

const ModalFormulario = ({ formData, onClose, onChange, onSave }) => {
  const isFormValid =
    formData.nombre && formData.genero && formData.pais && formData.biografia;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <h2 className="text-xl font-bold mb-4">Formulario de Artista</h2>
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
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Género</label>
          <input
            type="text"
            name="genero"
            value={formData.genero}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">País</label>
          <input
            type="text"
            name="pais"
            value={formData.pais}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Biografía</label>
          <textarea
            name="biografia"
            value={formData.biografia}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full text-sm"
          />
        </div>
        <div className="flex justify-end">
          <motion.button
            onClick={onSave}
            className="bg-blue-500 text-white p-2 rounded-lg mr-2 disabled:bg-gray-400"
            disabled={!isFormValid}
            whileHover={{ scale: isFormValid ? 1.05 : 1 }}
            whileTap={{ scale: isFormValid ? 0.95 : 1 }}
          >
            Guardar
          </motion.button>
          <motion.button
            onClick={onClose}
            className="bg-red-400 text-white p-2 rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cerrar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ModalVer = ({ data, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <h2 className="text-xl font-bold mb-4">Ver Artista</h2>
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
        <div className="flex justify-end">
          <motion.button
            onClick={onClose}
            className="bg-purple-500 text-white p-2 rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cerrar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
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

export default Artistas;