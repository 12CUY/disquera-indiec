const Compras = () => {
    return (
      <div className="flex-1 ml-10 md:ml-72 cursor-pointer mt-8">
        {/* Fondo blanco */}
        <div className="flex flex-col justify-center items-center min-h-screen  px-4">
          {/* Recuadro horizontal con imagen de fondo */}
          <div
            className="w-full max-w-7xl bg-cover bg-center mb-8 rounded-2xl shadow-lg p-6"
            style={{
              backgroundImage: `url(/img/dc.jpg)`,
              height: "100px",
            }}
          >
            <h1 className="text-center text-white text-xl md:text-2xl font-semibold leading-tight">
            Compras o factura
            </h1>
          </div>
        </div>
      </div>
    );
  };
  export default Compras;