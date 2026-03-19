-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-03-2026 a las 06:18:10
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `informe4_practica`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catedraticos`
--

CREATE TABLE `catedraticos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `catedraticos`
--

INSERT INTO `catedraticos` (`id`, `nombre`) VALUES
(1, 'Ing. Juan Perez'),
(2, 'Ing. Maria Gomez'),
(3, 'Ing. Carlos Hernandez'),
(4, 'Ing. Luis Morales');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `publicacion_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`id`, `publicacion_id`, `usuario_id`, `mensaje`, `creado_en`) VALUES
(1, 1, 2, 'Si, cuesta pero vale la pena', '2026-03-19 03:22:22'),
(2, 1, 3, 'Confirmo, estudien bastante', '2026-03-19 03:22:22'),
(3, 2, 1, 'Muy buen catedratico', '2026-03-19 03:22:22'),
(4, 3, 4, 'A mi me gusto el curso', '2026-03-19 03:22:22'),
(5, 4, 2, 'Demasiados proyectos la verdad', '2026-03-19 03:22:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `creditos` int(11) NOT NULL DEFAULT 5
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id`, `nombre`, `creditos`) VALUES
(1, 'Matematica para Computacion 2', 5),
(2, 'Fisica Basica', 5),
(3, 'Logica de Sistemas', 4),
(4, 'Introduccion a la Programacion', 5),
(5, 'Base de Datos 1', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos_aprobados`
--

CREATE TABLE `cursos_aprobados` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `curso_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos_aprobados`
--

INSERT INTO `cursos_aprobados` (`id`, `usuario_id`, `curso_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1),
(4, 2, 3),
(5, 3, 2),
(6, 4, 1),
(7, 4, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

CREATE TABLE `publicaciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `tipo` enum('curso','catedratico') NOT NULL,
  `referencia_id` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `publicaciones`
--

INSERT INTO `publicaciones` (`id`, `usuario_id`, `tipo`, `referencia_id`, `mensaje`, `creado_en`) VALUES
(1, 1, 'curso', 1, 'Matematica 2 es dificil pero se aprende bastante', '2026-03-19 03:22:15'),
(2, 2, 'catedratico', 1, 'El Ing. Perez explica muy bien', '2026-03-19 03:22:15'),
(3, 3, 'curso', 2, 'Fisica basica es pesada pero interesante', '2026-03-19 03:22:15'),
(4, 4, 'catedratico', 2, 'La Ing. Gomez deja muchos proyectos', '2026-03-19 03:22:15'),
(5, 1, 'curso', 1, 'Excelente curso', '2026-03-19 04:33:45'),
(6, 1, 'curso', 1, 'Prueba correcta', '2026-03-19 04:37:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `registro` varchar(20) NOT NULL,
  `nombres` varchar(80) NOT NULL,
  `apellidos` varchar(80) NOT NULL,
  `correo` varchar(120) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `registro`, `nombres`, `apellidos`, `correo`, `contrasena`, `creado_en`) VALUES
(1, '202407178', 'Pablo', 'Ordoñez', 'pablo@gmail.com', '1234', '2026-03-19 03:21:52'),
(2, '202300101', 'Ana', 'Lopez', 'ana@gmail.com', '1234', '2026-03-19 03:21:52'),
(3, '202300102', 'Carlos', 'Perez', 'carlos@gmail.com', '1234', '2026-03-19 03:21:52'),
(4, '202300103', 'Luis', 'Ramirez', 'luis@gmail.com', '1234', '2026-03-19 03:21:52');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `catedraticos`
--
ALTER TABLE `catedraticos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `publicacion_id` (`publicacion_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cursos_aprobados`
--
ALTER TABLE `cursos_aprobados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuario_curso` (`usuario_id`,`curso_id`),
  ADD KEY `curso_id` (`curso_id`);

--
-- Indices de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registro` (`registro`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `catedraticos`
--
ALTER TABLE `catedraticos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `cursos_aprobados`
--
ALTER TABLE `cursos_aprobados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`publicacion_id`) REFERENCES `publicaciones` (`id`),
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `cursos_aprobados`
--
ALTER TABLE `cursos_aprobados`
  ADD CONSTRAINT `cursos_aprobados_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `cursos_aprobados_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`);

--
-- Filtros para la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD CONSTRAINT `publicaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
