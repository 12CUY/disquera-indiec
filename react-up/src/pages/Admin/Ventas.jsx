import { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiSearch, FiFilter, FiDownload } from "react-icons/fi";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

const Ventas = () => {
  const [ventas] = useState([
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
    {
      fecha: "2023-10-03",
      albumCancion: "Álbum 2",
      cantidad: 1,
      precio: 15,
      total: 15,
      activo: true,
    },
  ]);

  const [modalVer, setModalVer] = useState(false);
  const [currentVenta, setCurrentVenta] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const openModalVer = (index) => {
    setCurrentVenta(index);
    setModalVer(true);
  };
  const closeModalVer = () => setModalVer(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortByDate = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const filteredVentas = ventas
    .filter((venta) =>
      venta.albumCancion.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredVentas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");
    XLSX.writeFile(workbook, "ventas.xlsx");
  };

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
          Ventas
        </p>
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

      {/* Contenedor de búsqueda, filtro y exportar */}
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
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar Venta..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
          <button
            onClick={handleSortByDate}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FiFilter />
            {sortOrder === "asc" ? "Fecha Ascendente" : "Fecha Descendente"}
          </button>
          <button
            onClick={handleExportToExcel}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-300 transition-colors duration-300 flex items-center gap-2"
          >
            <FiDownload />
            Exportar a Excel
          </button>
        </div>
      </div>

      {/* Tabla de ventas */}
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
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)", // Fondo transparente
            }}
          >
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
              {filteredVentas.map((venta, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`border-t ${
                    venta.activo ? "hover:bg-gray-100" : "bg-gray-300"
                  }`}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)", // Fondo transparente
                  }}
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
                  <td className="px-4 py-2">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => openModalVer(index)}
                    >
                      <FiEye className="text-white" size={20} />
                    </motion.div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Ver */}
        {modalVer && (
          <ModalVer data={ventas[currentVenta]} onClose={closeModalVer} />
        )}
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

ModalVer.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Ventas;