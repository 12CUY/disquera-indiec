// Importaciones de librerías y hooks necesarios
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

// Componente Loading: Muestra una animación de carga
const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="text-center">
        {/* Spinner de carga con animación */}
        <div className="border-t-4 border-blue-600 border-solid w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-600">
          Cargando...
        </p>
      </div>
    </div>
  );
};

// Componente Login: Maneja el inicio de sesión de usuarios
const Login = () => {
  // Hooks para navegación y estados
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Estado para el email
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [dataLoaded, setDataLoaded] = useState(false); // Estado para datos cargados

  // Función para manejar el login
  const handleLogin = (e) => {
    e.preventDefault();

    // Credenciales predefinidas
    const adminEmail = "admin@yavirac.edu.ec";
    const adminPassword = "12345";
    const userEmail = "user@yavirac.edu.ec";
    const userPassword = "67890";

    // Lógica para admin
    if (email === adminEmail && password === adminPassword) {
      Swal.fire({
        title: "Bienvenido Admin",
        text: "Datos cargados correctamente",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        setLoading(true); // Activa carga

        // Simula proceso de carga
        setTimeout(() => {
          setLoading(false); // Desactiva carga
          setDataLoaded(true); // Marca datos como cargados

          // Redirección después de breve espera
          setTimeout(() => {
            navigate("/dashboard"); // Dashboard admin
          }, 200);
        }, 200);
      });
    } 
    // Lógica para usuario normal
    else if (email === userEmail && password === userPassword) {
      Swal.fire({
        title: "Bienvenido Usuario",
        text: "Datos cargados correctamente",
        icon: "success",
        confirmButtonText: "Continuar",
      }).then(() => {
        setLoading(true); // Activa carga

        // Simula proceso de carga
        setTimeout(() => {
          setLoading(false); // Desactiva carga
          setDataLoaded(true); // Marca datos como cargados

          // Redirección después de breve espera
          setTimeout(() => {
            navigate("/dashboard2"); // Dashboard usuario
          }, 200);
        }, 200);
      });
    } else { // Bloque ELSE para credenciales incorrectas
      // Muestra alerta de error con SweetAlert2
      Swal.fire({
        title: "Error",
        text: "Credenciales incorrectas", // Mensaje de error
        icon: "error", // Icono de error
        confirmButtonText: "Intentar de nuevo", // Texto del botón
      });
    }
  };

  // Render condicional durante la carga
  if (loading) {
    return <Loading />; // Muestra componente Loading (spinner)
  }

  // Render condicional post-carga exitosa
  if (dataLoaded) {
    return ( // Muestra mensaje de éxito temporal
      <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
        <div className="text-center text-lg sm:text-xl md:text-2xl text-gray-600">
          ¡Datos cargados con éxito! 
        </div>
      </div>
    );
  }

  // Vista principal del formulario de login
  return ( // Contenedor principal con fondo de imagen
    <div className="flex justify-center items-center h-screen  bg-cover bg-center bg-[url('/login-fondo.jpg')]">
      {/* Contenedor animado con Framer Motion */}
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg" // Estilos base
        initial={{ opacity: 0 }} // Estado inicial de la animación
        animate={{ opacity: 1 }} // Estado final de la animación
        transition={{ duration: 0.2}} // Duración de la transición
      >
        {/* Sección de imagen lateral (solo en pantallas grandes) */}
        <div
          className="hidden lg:block w-full lg:w-1/2 h-[300px] lg:h-auto bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
          style={{ backgroundImage: "url('/img/dc.jpg')" }} // Imagen decorativa
        ></div>

        {/* Sección del formulario */}
        <div className="w-full lg:w-1/2 p-8"> {/* Padding 8 en todos lados */}
          <h2 className="text-4xl font-bold text-center text-green-700 mb-6"> {/* Título verde */}
            Iniciar Sesión
          </h2>
          <form onSubmit={handleLogin}> {/* Formulario controlado */}
            {/* Campo Email con animación de entrada */}
            <motion.div
              className="mb-6" // Margen inferior 6
              initial={{ opacity: 0, y: 50 }} // Posición inicial (50px abajo)
              animate={{ opacity: 1, y: 0 }} // Posición final
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }} // Animación tipo resorte
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700" // Estilo de label
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email} // Valor controlado por estado
                onChange={(e) => setEmail(e.target.value)} // Actualización de estado
                placeholder="Ingresa tu correo electrónico"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" // Estilos con focus
              />
            </motion.div>

            {/* Campo Contraseña con misma animación que email */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password} // Valor controlado por estado
                onChange={(e) => setPassword(e.target.value)} // Actualización de estado
                placeholder="Ingresa tu contraseña"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" // Mismos estilos que email
              />
            </motion.div>

            {/* Botón de envío del formulario */}
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200" // Efecto hover
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Enlace a registro */}
          <div className="mt-4 text-center"> {/* Margen superior 4 */}
            <p className="text-sm text-gray-500"> {/* Texto secundario */}
              ¿No tienes una cuenta?{" "}
              <a
                href="/register"
                className="text-green-600 hover:text-green-700 font-semibold" // Estilo de enlace
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; // Exportación del componente