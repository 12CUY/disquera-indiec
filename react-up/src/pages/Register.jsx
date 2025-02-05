// Importación de dependencias
import { useState } from "react"; // Manejo de estados
import { useNavigate } from "react-router-dom"; // Navegación entre rutas
import { motion } from "framer-motion"; // Animaciones
import { FiUserPlus } from "react-icons/fi"; // Ícono de registro
import Swal from "sweetalert2"; // Alertas visuales

const Register = () => {
  // Estados para almacenar los valores del formulario
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Estado para email
  const [password, setPassword] = useState(""); // Estado para contraseña
  const [username, setUsername] = useState(""); // Estado para nombre de usuario
  const [phoneNumber, setPhoneNumber] = useState(""); // Estado para teléfono

  // Función para manejar el registro
  const handleRegister = (e) => {
    e.preventDefault(); // Evita recarga de página

    // Validación básica de campos vacíos
    if (!email || !password || !username || !phoneNumber) {
      Swal.fire({ // Muestra alerta de error
        title: "Error",
        text: "Todos los campos son requeridos",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return; // Detiene la ejecución
    }

    // Lógica de registro simulada
    Swal.fire({ // Muestra alerta de éxito
      title: "Registro Exitoso",
      text: "Te has registrado correctamente",
      icon: "success",
      confirmButtonText: "Ir al Dashboard",
    }).then(() => {
      navigate("/dashboard"); // Redirección al dashboard
    });
  };

  return (
    // Contenedor principal con fondo de imagen
    <div className="flex justify-center items-center h-screen bg-cover bg-center bg-[url('/registro-fondo.jpg')]">
      {/* Contenedor animado con efecto deslizante */}
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg" // Estilos base
        initial={{ opacity: 0, x: -100 }} // Animación inicial (fuera de pantalla)
        animate={{ opacity: 1, x: 0 }} // Animación final (posición original)
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }} // Configuración de animación
      >
        {/* Sección de imagen lateral (solo en desktop) */}
        <div
          className="hidden lg:block w-full lg:w-1/2 h-[300px] lg:h-auto bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
          style={{ backgroundImage: "url('/img/piezas.jpeg')" }} // Imagen decorativa
        />

        {/* Sección del formulario */}
        <div className="w-full sm:w-1/2 p-8"> {/* Padding general */}
          <h2 className="text-4xl font-bold text-center text-green-700 mb-6"> {/* Título verde */}
            Regístrate
          </h2>
          
          <form onSubmit={handleRegister}> {/* Formulario controlado */}
            {/* Campo: Nombre de usuario con animación */}
            <motion.div
              className="mb-6" // Margen inferior
              initial={{ opacity: 0, y: 50 }} // Posición inicial (50px abajo)
              animate={{ opacity: 1, y: 0 }} // Posición final
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }} // Tipo de animación
            >
              <label htmlFor="username" className="block text-sm font-medium text-gray-700"> {/* Etiqueta */}
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username} // Valor controlado por estado
                onChange={(e) => setUsername(e.target.value)} // Actualiza estado
                placeholder="Ingresa tu nombre de usuario"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" // Estilos con focus
              />
            </motion.div>

            {/* Campo: Email con misma animación */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo electrónico"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </motion.div>

            {/* Campo: Teléfono con misma animación */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Número de Teléfono
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ingresa tu número de teléfono"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </motion.div>

            {/* Campo: Contraseña con misma animación */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crea una contraseña"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </motion.div>

            {/* Botón de registro con ícono */}
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-green-700 transition duration-200" // Efecto hover
            >
              <FiUserPlus /> {/* Ícono de registro */}
              Registrar
            </button>
          </form>

          {/* Enlace para usuarios existentes */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/"
                className="text-green-600 hover:text-green-700 font-semibold" // Estilo de enlace
              >
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register; // Exportación del componente