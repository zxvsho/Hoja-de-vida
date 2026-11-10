import React, { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  actualizarExperiencia,
  cerrarSesionAdmin,
  crearExperiencia,
  eliminarExperiencia,
  iniciarSesionAdmin,
  listarExperiencias,
  verificarSesionAdmin,
} from "./api.js";
import perfil from "../img/perfil.png";

const temas = [
  ["violeta", "🟣 Violeta"],
  ["gruvbox", "🟠 Gruvbox"],
  ["nord", "🔵 Nord"],
  ["tokyo-night", "🌌 Tokyo Night"],
  ["catppuccin", "🌸 Catppuccin"],
  ["kanagawa", "🍃 Kanagawa"],
];

const links = [
  ["/", "Inicio"],
  ["/sobre-mi", "Sobre mí"],
  ["/estudios", "Estudios"],
  ["/experiencias", "Experiencias"],
  ["/contacto", "Contacto"],
  ["/admin", "Administrar"],
];

function Header() {
  const [tema, setTema] = useState(
    () => localStorage.getItem("temaPreferido") || "violeta",
  );
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem("temaPreferido", tema);
  }, [tema]);

  useEffect(() => setMenuAbierto(false), [location.pathname]);

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link className="logo" to="/" aria-label="Miguel, inicio">
          Miguel
        </Link>
        <div className="nav-controles">
          <label className="sr-only" htmlFor="temaSelect">
            Elegir tema de colores
          </label>
          <select
            id="temaSelect"
            className="selector-tema"
            value={tema}
            onChange={(event) => setTema(event.target.value)}
          >
            {temas.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuAbierto}
            aria-controls="navMenu"
            aria-label={menuAbierto ? "Cerrar navegación" : "Abrir navegación"}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            <span aria-hidden="true">{menuAbierto ? "×" : "☰"}</span>
          </button>
        </div>
        <nav
          id="navMenu"
          className={`site-nav${menuAbierto ? " menu-abierto" : ""}`}
          aria-label="Navegación principal"
        >
          <ul>
            {links.map(([to, label]) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) => (isActive ? "activo" : "")}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Hero({ title, subtitle, showPhoto = true }) {
  return (
    <section className="hero">
      {showPhoto && <img src={perfil} alt="Foto de Miguel" />}
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </section>
  );
}

function Card({ title, children, className = "" }) {
  return (
    <section className={`tarjeta ${className}`.trim()}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}

function Home() {
  const habilidades = [
    "Linux",
    "Open Source",
    "Arch Linux",
    "Terminal / CLI",
    "HTML & CSS",
    "Bases de Datos",
  ];
  return (
    <>
      <Hero
        title="Miguel"
        subtitle="Estudiante de Ingeniería de Software · Universidad de Cartagena"
      />
      <main>
        <Card title="Bienvenido">
          <p>
            Esta es mi hoja de vida digital, donde comparto un poco sobre mí,
            mi formación académica y mis datos de contacto. Navega usando el
            menú superior para conocer más.
          </p>
        </Card>
        <Card title="Habilidades destacadas">
          {habilidades.map((habilidad) => (
            <span className="etiqueta" key={habilidad}>
              {habilidad}
            </span>
          ))}
        </Card>
      </main>
    </>
  );
}

function About() {
  return (
    <>
      <Hero title="Sobre mí" />
      <main>
        <Card title="Perfil personal">
          <p>
            Soy estudiante de Ingeniería de Software en la Universidad de
            Cartagena, sede Magangué. Me interesa el desarrollo web, las bases
            de datos y la construcción de soluciones tecnológicas que resuelvan
            problemas reales. Disfruto trabajar en equipo y aprender nuevas
            herramientas constantemente.
          </p>
        </Card>
        <Card title="Linux & Open Source">
          <p>
            Fuera de la carrera, soy un entusiasta de Linux y del software
            libre. Me gusta explorar distintas distribuciones y entender cómo
            funcionan por dentro, personalizar mi entorno de escritorio y
            configurar mi propio flujo de trabajo desde la terminal. Sigo de
            cerca proyectos open source y creo en el valor de construir y
            compartir herramientas de forma abierta con la comunidad.
          </p>
        </Card>
        <div className="grid-dos">
          <Card title="Intereses">
            <ul>
              <li>Desarrollo web (frontend y backend)</li>
              <li>Bases de datos</li>
              <li>Sistemas operativos y personalización de Linux</li>
              <li>Software y cultura open source</li>
              <li>Automatización de tareas</li>
            </ul>
          </Card>
          <Card title="Habilidades blandas">
            <ul>
              <li>Trabajo colaborativo</li>
              <li>Resolución de problemas</li>
              <li>Comunicación efectiva</li>
              <li>Organización y planificación</li>
            </ul>
          </Card>
        </div>
      </main>
    </>
  );
}

function Studies() {
  const areas = [
    "Programación",
    "Bases de Datos",
    "Física",
    "Cálculo",
    "Desarrollo Web",
    "Trabajo Colaborativo (CIPA)",
  ];
  return (
    <>
      <Hero title="Formación académica" />
      <main>
        <Card>
          <div className="linea-tiempo">
            <h3>Ingeniería de Software</h3>
            <p>
              <strong>Universidad de Cartagena</strong> — Sede Magangué
              (Montecarlos)
            </p>
            <p>
              Actualmente cursando el programa, con formación en desarrollo de
              software, bases de datos, física, cálculo y competencias
              generales.
            </p>
          </div>
          <div className="linea-tiempo">
            <h3>Educación básica y media</h3>
            <p>Formación previa completada antes de ingresar a la universidad.</p>
          </div>
        </Card>
        <Card title="Cursos y áreas trabajadas">
          {areas.map((area) => (
            <span className="etiqueta" key={area}>
              {area}
            </span>
          ))}
        </Card>
      </main>
    </>
  );
}

function fechaLegible(fecha) {
  if (!fecha) return "";
  const date = new Date(`${String(fecha).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "short",
      });
}

function ExperienceCard({ experiencia }) {
  return (
    <Card title={`${experiencia.cargo} · ${experiencia.empresa}`}>
      <p className="experience-meta">
        {fechaLegible(experiencia.fechaInicio)} –{" "}
        {experiencia.actual ? "Actualidad" : fechaLegible(experiencia.fechaFin)}
        {experiencia.ubicacion ? ` · ${experiencia.ubicacion}` : ""}
      </p>
      {experiencia.descripcion && <p>{experiencia.descripcion}</p>}
      {experiencia.tecnologias?.map((tecnologia) => (
        <span className="etiqueta" key={tecnologia}>
          {tecnologia}
        </span>
      ))}
    </Card>
  );
}

function Experiences() {
  const [experiencias, setExperiencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    setCargando(true);
    setError("");
    try {
      setExperiencias(await listarExperiencias());
    } catch (requestError) {
      if (requestError.status === 401) setAutenticado(false);
      setError(requestError.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <>
      <Hero title="Experiencias profesionales" />
      <main>
        <Card>
          <p>Datos obtenidos desde mi API (Node.js, Express y MongoDB).</p>
        </Card>
        {cargando && <Card><p role="status">Cargando experiencias...</p></Card>}
        {!cargando && error && (
          <Card title="No se pudieron cargar las experiencias">
            <p className="mensaje-error visible">{error}</p>
            <button type="button" onClick={cargar}>Reintentar</button>
          </Card>
        )}
        {!cargando && !error && experiencias.length === 0 && (
          <Card><p>Sin experiencias registradas.</p></Card>
        )}
        {!cargando && !error && experiencias.map((experiencia) => (
          <ExperienceCard
            key={experiencia._id || experiencia.id}
            experiencia={experiencia}
          />
        ))}
      </main>
    </>
  );
}

function Contact() {
  const [estado, setEstado] = useState("");

  function enviar(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const datos = new FormData(form);
    const nombre = String(datos.get("nombre") || "").trim();
    const correo = String(datos.get("correo") || "").trim();
    const mensaje = String(datos.get("mensaje") || "").trim();

    if (
      nombre.length < 3 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ||
      mensaje.length < 10
    ) {
      setEstado(
        "Completa los campos con un nombre, correo válido y mensaje de al menos 10 caracteres.",
      );
      return;
    }

    setEstado(`¡Gracias, ${nombre}! Tu mensaje fue validado correctamente.`);
    form.reset();
  }

  return (
    <>
      <Hero title="Contacto" />
      <main>
        <div className="grid-dos">
          <Card title="Datos de contacto">
            <ul className="contacto-lista">
              <li>
                📧{" "}
                <a href="mailto:miguelandrescuellotarriba600@gmail.com">
                  miguelandrescuellotarriba600@gmail.com
                </a>
              </li>
              <li>
                🐙{" "}
                <a
                  href="https://github.com/zxvsho"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/zxvsho
                </a>
              </li>
              <li>📍 Magangué, Bolívar, Colombia</li>
            </ul>
          </Card>
          <Card title="Escríbeme">
            <form className="contact-form" onSubmit={enviar} noValidate>
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                minLength={3}
              />
              <label htmlFor="correo">Correo</label>
              <input id="correo" name="correo" type="email" required />
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows="4"
                required
                minLength={10}
              />
              <button type="submit">Enviar</button>
              <p className="form-status" role="status">{estado}</p>
            </form>
            <p className="form-note">
              * Este formulario valida los datos en el navegador (no envía datos
              reales aún).
            </p>
          </Card>
        </div>
      </main>
    </>
  );
}

const formularioVacio = {
  empresa: "",
  cargo: "",
  descripcion: "",
  ubicacion: "",
  fechaInicio: "",
  fechaFin: "",
  actual: false,
  tecnologias: "",
};

function fechaInput(fecha) {
  return fecha ? String(fecha).slice(0, 10) : "";
}

function Admin() {
  const [experiencias, setExperiencias] = useState([]);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [iniciandoSesion, setIniciandoSesion] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  async function cargar() {
    setCargando(true);
    setError("");
    try {
      setExperiencias(await listarExperiencias());
    } catch (requestError) {
      if (requestError.status === 401) setAutenticado(false);
      setError(requestError.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    verificarSesionAdmin()
      .then(setAutenticado)
      .catch((requestError) => {
        if (requestError.status !== 401) setError(requestError.message);
      })
      .finally(() => setVerificandoSesion(false));
  }, []);

  useEffect(() => {
    if (autenticado) cargar();
  }, [autenticado]);

  async function iniciarSesion(event) {
    event.preventDefault();
    setError("");
    setIniciandoSesion(true);
    try {
      await iniciarSesionAdmin(password);
      setPassword("");
      setAutenticado(true);
    } catch (requestError) {
      if (requestError.status === 401) setAutenticado(false);
      setError(requestError.message);
    } finally {
      setIniciandoSesion(false);
    }
  }

  async function cerrarSesion() {
    try {
      await cerrarSesionAdmin();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setAutenticado(false);
      setExperiencias([]);
      setFormulario(formularioVacio);
      setEditando(null);
    }
  }

  function cambiarCampo(event) {
    const { name, value, checked, type } = event.target;
    setFormulario((actual) => ({
      ...actual,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "actual" && checked ? { fechaFin: "" } : {}),
    }));
  }

  function editar(experiencia) {
    setEditando(experiencia._id || experiencia.id);
    setFormulario({
      empresa: experiencia.empresa || "",
      cargo: experiencia.cargo || "",
      descripcion: experiencia.descripcion || "",
      ubicacion: experiencia.ubicacion || "",
      fechaInicio: fechaInput(experiencia.fechaInicio),
      fechaFin: fechaInput(experiencia.fechaFin),
      actual: Boolean(experiencia.actual),
      tecnologias: (experiencia.tecnologias || []).join(", "),
    });
    setError("");
    setAviso("");
    document.getElementById("experience-form")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function cancelarEdicion() {
    setEditando(null);
    setFormulario(formularioVacio);
    setError("");
    setAviso("");
  }

  async function guardar(event) {
    event.preventDefault();
    setError("");
    setAviso("");
    setGuardando(true);
    const payload = {
      ...formulario,
      tecnologias: formulario.tecnologias
        .split(",")
        .map((tecnologia) => tecnologia.trim())
        .filter(Boolean),
      fechaFin:
        formulario.actual || !formulario.fechaFin
          ? null
          : formulario.fechaFin,
    };

    try {
      if (editando) {
        await actualizarExperiencia(editando, payload);
        setAviso("La experiencia se actualizó correctamente.");
      } else {
        await crearExperiencia(payload);
        setAviso("La experiencia se creó correctamente.");
      }
      setFormulario(formularioVacio);
      setEditando(null);
      await cargar();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(experiencia) {
    const nombre = `${experiencia.cargo} · ${experiencia.empresa}`;
    if (
      !window.confirm(
        `¿Eliminar la experiencia "${nombre}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    setError("");
    setAviso("");
    try {
      await eliminarExperiencia(experiencia._id || experiencia.id);
      if (editando === (experiencia._id || experiencia.id)) cancelarEdicion();
      setAviso("La experiencia se eliminó correctamente.");
      await cargar();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <Hero
        title="Administrar experiencias"
        subtitle="Crea, edita y elimina experiencias profesionales."
        showPhoto={false}
      />
      {verificandoSesion ? (
        <main className="admin-main">
          <Card><p role="status">Verificando sesión...</p></Card>
        </main>
      ) : !autenticado ? (
        <main className="admin-main">
          <Card title="Acceso administrativo">
            <form className="admin-form login-form" onSubmit={iniciarSesion}>
              <p>Inicia sesión para administrar las experiencias profesionales.</p>
              <div className="field">
                <label htmlFor="admin-password">Contraseña</label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {error && <p className="alert error-alert" role="alert">{error}</p>}
              <button type="submit" disabled={iniciandoSesion}>
                {iniciandoSesion ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>
          </Card>
        </main>
      ) : (
      <main className="admin-main">
        <div className="admin-session">
          <span>Sesión administrativa activa</span>
          <button type="button" className="secondary-button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
        {error && <p className="alert error-alert" role="alert">{error}</p>}
        <Card title={editando ? "Editar experiencia" : "Nueva experiencia"}>
          <form id="experience-form" className="admin-form" onSubmit={guardar}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="empresa">Empresa *</label>
                <input
                  id="empresa"
                  name="empresa"
                  value={formulario.empresa}
                  onChange={cambiarCampo}
                  required
                  maxLength={120}
                />
              </div>
              <div className="field">
                <label htmlFor="cargo">Cargo *</label>
                <input
                  id="cargo"
                  name="cargo"
                  value={formulario.cargo}
                  onChange={cambiarCampo}
                  required
                  maxLength={120}
                />
              </div>
              <div className="field">
                <label htmlFor="fechaInicio">Fecha de inicio *</label>
                <input
                  id="fechaInicio"
                  name="fechaInicio"
                  type="date"
                  value={formulario.fechaInicio}
                  onChange={cambiarCampo}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="fechaFin">Fecha de finalización</label>
                <input
                  id="fechaFin"
                  name="fechaFin"
                  type="date"
                  value={formulario.fechaFin}
                  onChange={cambiarCampo}
                  disabled={formulario.actual}
                  min={formulario.fechaInicio || undefined}
                />
              </div>
              <div className="field">
                <label htmlFor="ubicacion">Ubicación</label>
                <input
                  id="ubicacion"
                  name="ubicacion"
                  value={formulario.ubicacion}
                  onChange={cambiarCampo}
                  maxLength={120}
                />
              </div>
              <div className="field">
                <label htmlFor="tecnologias">Tecnologías</label>
                <input
                  id="tecnologias"
                  name="tecnologias"
                  value={formulario.tecnologias}
                  onChange={cambiarCampo}
                  placeholder="Node.js, Express, MongoDB"
                />
                <small>Sepáralas con comas.</small>
              </div>
            </div>
            <div className="field">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="4"
                value={formulario.descripcion}
                onChange={cambiarCampo}
                maxLength={2000}
              />
            </div>
            <label className="checkbox-field">
              <input
                name="actual"
                type="checkbox"
                checked={formulario.actual}
                onChange={cambiarCampo}
              />
              Actualmente trabajo aquí
            </label>
            {error && (
              <p className="alert error-alert" role="alert">
                {error}
              </p>
            )}
            {aviso && (
              <p className="alert success-alert" role="status">
                {aviso}
              </p>
            )}
            <div className="form-actions">
              <button type="submit" disabled={guardando}>
                {guardando
                  ? "Guardando..."
                  : editando
                    ? "Guardar cambios"
                    : "Crear experiencia"}
              </button>
              {editando && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={cancelarEdicion}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </Card>
        <section className="admin-list" aria-labelledby="admin-list-title">
          <h2 id="admin-list-title">Experiencias registradas</h2>
          {cargando && <p role="status">Cargando experiencias...</p>}
          {!cargando && experiencias.length === 0 && !error && (
            <p>Aún no hay experiencias registradas.</p>
          )}
          {!cargando &&
            experiencias.map((experiencia) => (
              <article
                className="admin-experience"
                key={experiencia._id || experiencia.id}
              >
                <div>
                  <h3>
                    {experiencia.cargo} · {experiencia.empresa}
                  </h3>
                  <p>
                    {fechaLegible(experiencia.fechaInicio)} –{" "}
                    {experiencia.actual
                      ? "Actualidad"
                      : fechaLegible(experiencia.fechaFin)}
                  </p>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => editar(experiencia)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => eliminar(experiencia)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
        </section>
      </main>
      )}
    </>
  );
}

function NotFound() {
  return (
    <main>
      <Card title="Página no encontrada">
        <p>La ruta que buscas no existe.</p>
        <Link to="/">Volver al inicio</Link>
      </Card>
    </main>
  );
}

function App() {
  const location = useLocation();
  const [mostrarArriba, setMostrarArriba] = useState(false);

  useEffect(() => {
    const titulos = {
      "/": "Miguel | Hoja de Vida",
      "/sobre-mi": "Sobre mí | Miguel",
      "/estudios": "Estudios | Miguel",
      "/experiencias": "Experiencias | Miguel",
      "/contacto": "Contacto | Miguel",
      "/admin": "Administrar experiencias | Miguel",
    };
    document.title = titulos[location.pathname] || "Miguel | Hoja de Vida";
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const actualizarVisibilidad = () =>
      setMostrarArriba(window.scrollY > 300);
    window.addEventListener("scroll", actualizarVisibilidad, { passive: true });
    return () => window.removeEventListener("scroll", actualizarVisibilidad);
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-mi" element={<About />} />
        <Route path="/estudios" element={<Studies />} />
        <Route path="/experiencias" element={<Experiences />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer>
        <p>&copy; 2026 Miguel — Universidad de Cartagena</p>
      </footer>
      {mostrarArriba && (
        <button
          id="btnArriba"
          type="button"
          aria-label="Volver arriba"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}
    </>
  );
}

export default App;
