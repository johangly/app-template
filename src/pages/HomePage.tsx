import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-full flex justify-center items-start">
      <div className="max-w-4xl w-full flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bienvenido, {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selecciona una opción del menú para comenzar
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Gestión de Usuarios
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Administra los usuarios del sistema, crea nuevos accesos y gestiona permisos.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Gestión de Roles
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Configura los roles y permisos disponibles para los usuarios del sistema.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Configuración
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Personaliza la configuración general del sistema según tus necesidades.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
