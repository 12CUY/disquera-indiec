import { useState } from "react";

const Compras = () => {
  const [compras] = useState([
    {
      id: 1,
      nombre: "Cancion 1",
      artista: "Artista A",
      precio: "$2.99",
      fecha: "2024-01-31",
      imagen: "/img/imagen1.jpg",
    },
    {
      id: 2,
      nombre: "Cancion 2",
      artista: "Artista B",
      precio: "$3.49",
      fecha: "2024-01-30",
      imagen: "/img/imagen1.jpg",
    },
    {
      id: 3,
      nombre: "Cancion 3",
      artista: "Artista C",
      precio: "$1.99",
      fecha: "2024-01-28",
      imagen: "/img/imagen1.jpg",
    },
    {
      id: 4,
      nombre: "Cancion 4",
      artista: "Artista D",
      precio: "$4.99",
      fecha: "2024-01-15",
      imagen: "/img/imagen1.jpg",
    },
    {
      id: 5,
      nombre: "Cancion 5",
      artista: "Artista E",
      precio: "$2.00",
      fecha: "2024-01-20",
      imagen: "/img/imagen1.jpg",
    },
    {
      id: 6,
      nombre: "Cancion 6",
      artista: "Artista F",
      precio: "$1.00",
      fecha: "2024-01-24",
      imagen: "/img/imagen1.jpg",
    },
  ]);

  return (
    <div className="flex-1 ml-10 md:ml-72 cursor-pointer">
      {/* Contenedor principal */}
      <div className="flex flex-col justify-start items-center min-h-screen px-4 pt-4 bg-black">
        {/* ✅ Encabezado con más espacio interno */}
        <div
          className="w-full bg-cover bg-center rounded-2xl shadow-lg p-8"
          style={{
            backgroundImage: "url(/img/dc.jpg)",
            height: "100px",
          }}
        >
          <h1 className="text-center text-white text-xl md:text-2xl font-semibold leading-tight">
            Compras o Factura
          </h1>
        </div>

        {/* ✅ Más espacio entre el encabezado y la tabla */}
        <div className="w-full bg-cover bg-center rounded-2xl shadow-lg p-6 bg-black mt-8">
          <h2 className="text-white text-lg font-semibold mb-4">
            Historial de Compras
          </h2>
          <table className="w-full text-white border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 text-left">Imagen</th>{" "}
                {/* Nueva columna de Imagen */}
                <th className="py-2 text-left">Canción</th>
                <th className="py-2 text-left">Artista</th>
                <th className="py-2 text-left">Precio</th>
                <th className="py-2 text-left">Fecha</th>
                <th className="py-2 text-left">Factura</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id} className="border-b border-gray-700">
                  <td className="py-2">
                    {/* Imagen de la canción */}
                    <img
                      src={compra.imagen}
                      alt={compra.nombre}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2">{compra.nombre}</td>
                  <td className="py-2">{compra.artista}</td>
                  <td className="py-2">{compra.precio}</td>
                  <td className="py-2">{compra.fecha}</td>
                  <td className="py-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Compras;
