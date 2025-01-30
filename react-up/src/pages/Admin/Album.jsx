import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FiEye, FiEdit, FiTrash2, FiRefreshCcw } from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Album = () => {
  const [albums, setAlbums] = useState([
    {
      foto: null,
      titulo: "Álbum 1",
      artista: "Artista 1",
      año: 2020,
      genero: "Rock",
      activo: true,
    },
    {
      foto: null,
      titulo: "Álbum 2",
      artista: "Artista 2",
      año: 2021,
      genero: "Pop",
      activo: true,
    },
  ]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    foto: null,
    titulo: "",
    artista: "",
    año: "",
    genero: "",
  });
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const generos = ["Rock", "Pop", "Jazz", "Clásica", "Electrónica", "Hip-Hop", "Reggae", "Metal"];

  const openModalCrear = () => setModalCrear(true);
  const closeModalCrear = () => setModalCrear(false);

  const openModalEditar = (index) => {
    setCurrentAlbum(index);
    setFormData(albums[index]);
    setModalEditar(true);
  };
  const closeModalEditar = () => setModalEditar(false);

  const openModalVer = (index) => {
    setCurrentAlbum(index);
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

  const handleAddAlbum = () => {
    setAlbums([...albums, { ...formData, activo: true }]);
    Swal.fire({
      icon: "success",
      title: "Álbum agregado",
      text: `El álbum "${formData.titulo}" fue agregado exitosamente.`,
    });
    closeModalCrear();
  };

  const handleUpdateAlbum = () => {
    const updatedAlbums = [...albums];
    updatedAlbums[currentAlbum] = { ...formData };
    setAlbums(updatedAlbums);
    Swal.fire({
      icon: "success",
      title: "Álbum actualizado",
      text: `El álbum "${formData.titulo}" fue actualizado exitosamente.`,
    });
    closeModalEditar();
  };

  const handleDeleteAlbum = (index) => {
    const updatedAlbums = [...albums];
    updatedAlbums[index].activo = false;
    setAlbums(updatedAlbums);
    Swal.fire({
      icon: "error",
      title: "Álbum desactivado",
      text: "El álbum fue marcado como inactivo.",
    });
  };

  const handleRestoreAlbum = (index) => {
    const updatedAlbums = [...albums];
    updatedAlbums[index].activo = true;
    setAlbums(updatedAlbums);
    Swal.fire({
      icon: "success",
      title: "Álbum restaurado",
      text: "El álbum fue restaurado y está activo nuevamente.",
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCardClick = () => {
    Swal.fire({
      icon: "info",
      title: "Función en desarrollo",
      text: "Esta función aún no está implementada.",
    });
  };

  return (
    <div className="p-8">
      {/* Encabezado y botón de agregar */}
      <div className="flex flex-col sm:flex-row md:flex-row items-center justify-between p-4 md:ml-72 text-white rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('/img/dc.jpg')", borderRadius: "20px" }}>
        <p className="text-center sm:text-left text-2xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ fontSize: "clamp(25px, 8vw, 60px)", margin: 0 }}>
          Álbum
        </p>
        <div className="mt-4 sm:mt-0">
          <button onClick={openModalCrear} className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105" style={{ fontSize: "18px" }}>
            Agregar Álbum
          </button>
        </div>
      </div>

      {/* Migajas de pan */}
      <div className="md:ml-72 p-4 mx-auto bg-blue-100 rounded-lg shadow-lg" style={{ backgroundColor: "#f1f8f9", borderRadius: "20px", marginTop: "20px", marginBottom: "20px", height: "auto", padding: "10px" }}>
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap gap-2 list-none p-0 m-0 justify-center items-center">
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <Link to="/dashboard" className="text-[#0aa5a9] px-4 py-2 rounded-lg transition duration-300 hover:bg-[#067b80] hover:text-white no-underline">
                Inicio
              </Link>
            </li>
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <span className="text-[#0aa5a9] px-2">/</span>
            </li>
            <li className="text-sm sm:text-base md:text-lg lg:text-lg text-center py-2">
              <span className="text-[#0aa5a9] px-4 py-2 rounded-lg transition duration-300 hover:bg-[#067b80] hover:text-white no-underline">
                Álbum
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Contenedor de búsqueda */}
      <div className="md:ml-72 p-4 mx-auto bg-gray-100 rounded-lg shadow-lg" style={{ backgroundColor: "#f1f8f9", borderRadius: "20px", marginTop: "20px", marginBottom: "20px", height: "auto", padding: "10px" }}>
        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
          <button className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-300 transition-colors duration-300 w-full sm:w-auto" onClick={handleCardClick}>
            Tarj.
          </button>
          <input type="text" placeholder="Buscar Álbum..." value={searchTerm} onChange={handleSearchChange} className="border border-gray-300 p-2 rounded-lg w-full sm:w-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl" />
        </div>
      </div>

      {/* Tabla de álbumes */}
      <div className="flex-1 ml-0 md:ml-72 p-4 rounded-lg overflow-auto" style={{ backgroundColor: "#f1f8f9" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Foto</th>
                <th className="px-4 py-2">Título</th>
                <th className="px-4 py-2">Artista</th>
                <th className="px-4 py-2">Año</th>
                <th className="px-4 py-2">Género</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {albums.map((album, index) => (
                <motion.tr key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className={`border-t ${album.activo ? "hover:bg-gray-100" : "bg-gray-300"}`}>
                  <td className="px-4 py-2">
                    {album.foto ? (
                      <img src={URL.createObjectURL(album.foto)} alt="Foto" className="w-12 h-12 object-cover rounded-md" />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td className="px-4 py-2">{album.titulo}</td>
                  <td className="px-4 py-2">{album.artista}</td>
                  <td className="px-4 py-2">{album.año}</td>
                  <td className="px-4 py-2">{album.genero}</td>
                  <td className="px-4 py-2">
                    <span className={`px-3 py-1 rounded-full text-white ${album.activo ? "bg-green-500" : "bg-red-500"}`}>
                      {album.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    <FiEye className="text-blue-500 cursor-pointer" size={20} onClick={() => openModalVer(index)} />
                    <FiEdit className="text-yellow-500 cursor-pointer" size={20} onClick={() => openModalEditar(index)} />
                    {album.activo ? (
                      <FiTrash2 className="text-red-500 cursor-pointer" size={20} onClick={() => handleDeleteAlbum(index)} />
                    ) : (
                      <FiRefreshCcw className="text-green-500 cursor-pointer" size={20} onClick={() => handleRestoreAlbum(index)} />
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
            onSave={handleAddAlbum}
            generos={generos}
          />
        )}

        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateAlbum}
            generos={generos}
          />
        )}

        {modalVer && (
          <ModalVer data={albums[currentAlbum]} onClose={closeModalVer} />
        )}
      </div>
    </div>
  );
};

const ModalFormulario = ({ formData, onClose, onChange, onSave, generos }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Formulario de Álbum</h2>
        <div className="mb-4 text-center">
          <label className="block text-sm font-semibold text-gray-700 mb-2"></label>
          <div>
            <label htmlFor="foto" className="inline-block bg-[#067b80] text-white text-sm font-semibold px-4 py-2 rounded-md cursor-pointer hover:bg-[#056b6e] focus:ring-2 focus:ring-[#056b6e] focus:outline-none">
              Subir Imagen
            </label>
            <input id="foto" type="file" name="foto" onChange={onChange} className="hidden" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Título</label>
          <input type="text" name="titulo" value={formData.titulo} onChange={onChange} className="border border-gray-300 p-2 rounded-md w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Artista</label>
          <input type="text" name="artista" value={formData.artista} onChange={onChange} className="border border-gray-300 p-2 rounded-md w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Año</label>
          <input type="number" name="año" value={formData.año} onChange={onChange} className="border border-gray-300 p-2 rounded-md w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Género</label>
          <select name="genero" value={formData.genero} onChange={onChange} className="border border-gray-300 p-2 rounded-md w-full">
            <option value="">Selecciona un género</option>
            {generos.map((genero, index) => (
              <option key={index} value={genero}>
                {genero}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button onClick={onSave} className="bg-blue-500 text-white p-2 rounded-lg mr-2">
            Guardar
          </button>
          <button onClick={onClose} className="bg-red-400 text-white p-2 rounded-md">
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
        <h2 className="text-xl font-bold mb-4">Ver Álbum</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Foto</label>
          {data.foto ? (
            <img src={URL.createObjectURL(data.foto)} alt="Foto" className="w-12 h-12 object-cover rounded-md" />
          ) : (
            <span>Sin foto</span>
          )}
        </div>
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
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-purple-600 text-white p-2 rounded-md">
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
  generos: PropTypes.array.isRequired,
};

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Album;