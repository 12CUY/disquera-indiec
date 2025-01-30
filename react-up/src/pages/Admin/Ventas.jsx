import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FiEye, FiEdit, FiTrash2, FiRefreshCcw } from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Ventas = () => {
  const [ventas, setVentas] = useState([
    {
      fecha: "2023-10-01",
      albumCancion: "Álbum 1",
      cantidad: 2,
      precio: 20,
      total: 40,
      activo: true,
    },
    {
      fecha: "2023-10-02",
      albumCancion: "Canción 1",
      cantidad: 3,
      precio: 10,
      total: 30,
      activo: true,
    },
  ]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [formData, setFormData] = useState({
    fecha: "",
    albumCancion: "",
    cantidad: 0,
    precio: 0,
    total: 0,
  });
  const [currentVenta, setCurrentVenta] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const openModalCrear = () => setModalCrear(true);
  const closeModalCrear = () => setModalCrear(false);

  const openModalEditar = (index) => {
    setCurrentVenta(index);
    setFormData(ventas[index]);
    setModalEditar(true);
  };
  const closeModalEditar = () => setModalEditar(false);

  const openModalVer = (index) => {
    setCurrentVenta(index);
    setModalVer(true);
  };
  const closeModalVer = () => setModalVer(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    // Calcular el total si cambia la cantidad o el precio
    if (name === "cantidad" || name === "precio") {
      newFormData.total = newFormData.cantidad * newFormData.precio;
    }

    setFormData(newFormData);
  };

  const handleAddVenta = () => {
    setVentas([...ventas, { ...formData, activo: true }]);
    Swal.fire({
      icon: "success",
      title: "Venta agregada",
      text: `La venta de "${formData.albumCancion}" fue agregada exitosamente.`,
    });
    closeModalCrear();
  };

  const handleUpdateVenta = () => {
    const updatedVentas = [...ventas];
    updatedVentas[currentVenta] = { ...formData };
    setVentas(updatedVentas);
    Swal.fire({
      icon: "success",
      title: "Venta actualizada",
      text: `La venta de "${formData.albumCancion}" fue actualizada exitosamente.`,
    });
    closeModalEditar();
  };

  const handleDeleteVenta = (index) => {
    const updatedVentas = [...ventas];
    updatedVentas[index].activo = false;
    setVentas(updatedVentas);
    Swal.fire({
      icon: "error",
      title: "Venta desactivada",
      text: "La venta fue marcada como inactiva.",
    });
  };

  const handleRestoreVenta = (index) => {
    const updatedVentas = [...ventas];
    updatedVentas[index].activo = true;
    setVentas(updatedVentas);
    Swal.fire({
      icon: "success",
      title: "Venta restaurada",
      text: "La venta fue restaurada y está activa nuevamente.",
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
          Ventas
        </p>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={openModalCrear}
            className="bg-[#0aa5a9] text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:bg-[#067b80] hover:scale-105"
            style={{
              fontSize: "18px",
            }}
          >
            Agregar Venta
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
                Ventas
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Contenedor de búsqueda */}
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
          <button
            className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-300 transition-colors duration-300 w-full sm:w-auto"
            onClick={handleCardClick}
          >
            Tarj.
          </button>
          <input
            type="text"
            placeholder="Buscar Venta..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 p-2 rounded-lg w-full sm:w-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
          />
        </div>
      </div>

      {/* Tabla de ventas */}
      <div
        className="flex-1 ml-0 md:ml-72 p-4 rounded-lg overflow-auto"
        style={{
          backgroundColor: "#f1f8f9",
        }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Álbum/Canción</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`border-t ${
                    venta.activo ? "hover:bg-gray-100" : "bg-gray-300"
                  }`}
                >
                  <td className="px-4 py-2">{venta.fecha}</td>
                  <td className="px-4 py-2">{venta.albumCancion}</td>
                  <td className="px-4 py-2">{venta.cantidad}</td>
                  <td className="px-4 py-2">${venta.precio.toFixed(2)}</td>
                  <td className="px-4 py-2 font-bold text-green-600">
                    ${venta.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        venta.activo ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {venta.activo ? "Activo" : "Inactivo"}
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
                    {venta.activo ? (
                      <FiTrash2
                        className="text-red-500 cursor-pointer"
                        size={20}
                        onClick={() => handleDeleteVenta(index)}
                      />
                    ) : (
                      <FiRefreshCcw
                        className="text-green-500 cursor-pointer"
                        size={20}
                        onClick={() => handleRestoreVenta(index)}
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
            onSave={handleAddVenta}
          />
        )}

        {modalEditar && (
          <ModalFormulario
            formData={formData}
            onClose={closeModalEditar}
            onChange={handleInputChange}
            onSave={handleUpdateVenta}
          />
        )}

        {modalVer && (
          <ModalVer data={ventas[currentVenta]} onClose={closeModalVer} />
        )}
      </div>
    </div>
  );
};

const ModalFormulario = ({ formData, onClose, onChange, onSave }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Formulario de Venta</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Álbum/Canción
          </label>
          <input
            type="text"
            name="albumCancion"
            value={formData.albumCancion}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Precio</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Total</label>
          <input
            type="number"
            name="total"
            value={formData.total}
            readOnly
            className="border border-gray-300 p-2 rounded-md w-full bg-gray-100"
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Ver Venta</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha</label>
          <p>{data.fecha}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Álbum/Canción
          </label>
          <p>{data.albumCancion}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Cantidad</label>
          <p>{data.cantidad}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Precio</label>
          <p>${data.precio.toFixed(2)}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Total</label>
          <p className="font-bold text-green-600">${data.total.toFixed(2)}</p>
        </div>
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

export default Ventas;