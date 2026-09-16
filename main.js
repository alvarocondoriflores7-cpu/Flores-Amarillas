document.addEventListener("DOMContentLoaded", () => {
  // --- LEER NOMBRE DESDE EL ENLACE (?nombre=Tania) ---
  const parametros = new URLSearchParams(window.location.search);
  const nombreUrl = parametros.get('nombre');
  
  if (nombreUrl) {
    const contenedorTexto = document.querySelector('.texto-rgb');
    if (contenedorTexto) {
      contenedorTexto.innerText = nombreUrl.toUpperCase();
    }
  }

  // --- ELEMENTOS DEL DOM ---
  const ramo = document.getElementById("ramo");
  const tituloInteractivo = document.getElementById("titulo-interactivo");
  const btnMusica = document.getElementById("btn-musica");
  const musicaFondo = document.getElementById("musica-fondo");
  const iconoMusica = document.getElementById("icono-musica");

  // --- CONTROL DE MÚSICA CANTADA (CORO DE FLORES AMARILLAS) ---
  const TIEMPO_CORO = 38; // Inicia cuando empieza a cantar: "Él la estaba esperando con flores amarillas..."
  let musicaIniciada = false;

  function activarMusicaCantada() {
    if (!musicaIniciada && musicaFondo) {
      musicaFondo.currentTime = TIEMPO_CORO;
      
      const promesaPlay = musicaFondo.play();
      if (promesaPlay !== undefined) {
        promesaPlay.then(() => {
          musicaIniciada = true;
          musicaFondo.muted = false;
          if (btnMusica) btnMusica.classList.add("reproduciendo");
          if (iconoMusica) iconoMusica.innerText = "🔊";
        }).catch((err) => {
          console.log("Esperando toque del usuario para reproducir en celular/navegador...");
        });
      }
    }
  }

  // Intentar iniciar audio
  activarMusicaCantada();

  // Reiniciar desde el coro si termina
  if (musicaFondo) {
    musicaFondo.addEventListener("ended", () => {
      musicaFondo.currentTime = TIEMPO_CORO;
      musicaFondo.play();
    });
  }

  // Botón MUTE / UNMUTE
  if (btnMusica) {
    btnMusica.addEventListener("click", (e) => {
      e.stopPropagation();
      
      if (!musicaIniciada) {
        activarMusicaCantada();
        return;
      }

      if (musicaFondo.paused) {
        musicaFondo.play();
        musicaFondo.muted = false;
        if (iconoMusica) iconoMusica.innerText = "🔊";
        btnMusica.classList.add("reproduciendo");
      } else {
        if (musicaFondo.muted) {
          musicaFondo.muted = false;
          if (iconoMusica) iconoMusica.innerText = "🔊";
          btnMusica.classList.add("reproduciendo");
        } else {
          musicaFondo.muted = true;
          if (iconoMusica) iconoMusica.innerText = "🔇";
          btnMusica.classList.remove("reproduciendo");
        }
      }
    });
  }

  // Primer toque activa la canción
  const eventosToque = ["click", "touchstart", "touchend"];
  eventosToque.forEach((evento) => {
    document.body.addEventListener(evento, () => {
      activarMusicaCantada();
    }, { once: true });
  });

  // --- CONFIGURACIÓN DEL RAMO DE FLORES ---
  const floresConfig = [
    { alturaTallo: 300, rotacion: 0, mecimiento: 2, zIndex: 5 },
    { alturaTallo: 260, rotacion: -15, mecimiento: -3, zIndex: 4 },
    { alturaTallo: 270, rotacion: 15, mecimiento: 3, zIndex: 4 },
    { alturaTallo: 220, rotacion: -30, mecimiento: -4, zIndex: 3 },
    { alturaTallo: 230, rotacion: 30, mecimiento: 4, zIndex: 3 },
    { alturaTallo: 180, rotacion: -45, mecimiento: -5, zIndex: 2 },
    { alturaTallo: 190, rotacion: 45, mecimiento: 5, zIndex: 2 },
    { alturaTallo: 330, rotacion: -5, mecimiento: 2, zIndex: 6 },
    { alturaTallo: 310, rotacion: 8, mecimiento: -2, zIndex: 5 }
  ];

  const numPetalos = 10;

  if (ramo) {
    floresConfig.forEach((config, idx) => {
      const florDiv = document.createElement("div");
      florDiv.classList.add("flor");
      
      florDiv.style.setProperty("--rotacion-base", `${config.rotacion}deg`);
      florDiv.style.setProperty("--mecimiento", `${config.mecimiento}deg`);
      florDiv.style.transform = `rotate(${config.rotacion}deg)`;
      florDiv.style.zIndex = config.zIndex;
      florDiv.style.animationDelay = `${idx * 0.15}s, ${1.5 + idx * 0.1}s`;

      const tallo = document.createElement("div");
      tallo.classList.add("tallo");
      tallo.style.height = `${config.alturaTallo}px`;

      const hoja1 = document.createElement("div");
      hoja1.classList.add("hoja", "izquierda");
      hoja1.style.bottom = `${config.alturaTallo * 0.4}px`;

      const hoja2 = document.createElement("div");
      hoja2.classList.add("hoja", "derecha");
      hoja2.style.bottom = `${config.alturaTallo * 0.6}px`;

      tallo.appendChild(hoja1);
      tallo.appendChild(hoja2);

      const cabezaFlor = document.createElement("div");
      cabezaFlor.classList.add("cabeza-flor");

      for (let i = 0; i < numPetalos; i++) {
        const petalo = document.createElement("div");
        petalo.classList.add("petalo");
        const angulo = (360 / numPetalos) * i;
        petalo.style.transform = `translate(-50%, -100%) rotate(${angulo}deg)`;
        cabezaFlor.appendChild(petalo);
      }

      const centro = document.createElement("div");
      centro.classList.add("centro-flor");
      cabezaFlor.appendChild(centro);

      florDiv.appendChild(cabezaFlor);
      florDiv.appendChild(tallo);
      ramo.appendChild(florDiv);
    });
  }

  // --- LÓGICA DE INTERACCIÓN: CORAZONES Y MANITAS ---
  function lanzarEmojiFlotante(x, y, emoji) {
    const cantidad = 5;
    for (let i = 0; i < cantidad; i++) {
      const el = document.createElement("div");
      el.classList.add("elemento-flotante");
      el.innerText = emoji;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      const dx = `${(Math.random() - 0.5) * 120}px`;
      const rot = `${(Math.random() - 0.5) * 40}deg`;
      el.style.setProperty("--dx", dx);
      el.style.setProperty("--rot", rot);

      document.body.appendChild(el);

      setTimeout(() => {
        el.remove();
      }, 1800);
    }
  }

  if (ramo) {
    ramo.addEventListener("click", (e) => {
      e.stopPropagation();
      activarMusicaCantada();
      lanzarEmojiFlotante(e.clientX, e.clientY, "💛");
    });
  }

  if (tituloInteractivo) {
    tituloInteractivo.addEventListener("click", (e) => {
      e.stopPropagation();
      activarMusicaCantada();
      lanzarEmojiFlotante(e.clientX, e.clientY, "🫶");
    });
  }

  // --- SISTEMA DE FUEGOS ARTIFICIALES Y BRILLOS ---
  const canvas = document.getElementById("canvas-efectos");
  if (canvas) {
    const ctx = canvas.getContext("2d");

    function redimensionarCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    redimensionarCanvas();
    window.addEventListener("resize", redimensionarCanvas);

    const particulasNieve = [];
    for (let i = 0; i < 50; i++) {
      particulasNieve.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radio: Math.random() * 2 + 1,
        vy: Math.random() * 0.7 + 0.3,
        vx: (Math.random() - 0.5) * 0.4,
        opacidad: Math.random(),
        velOpacidad: Math.random() * 0.02 + 0.005,
        color: ["#ffffff", "#fff7a1", "#ffd700"][Math.floor(Math.random() * 3)]
      });
    }

    let particulasFuegos = [];

    function crearFuegoArtificial(x, y) {
      const colores = ["#ffd700", "#ff007f", "#00f0ff", "#ffeb3b", "#ffffff", "#ff7300"];
      const cantidadParticulas = 35;

      for (let i = 0; i < cantidadParticulas; i++) {
        const angulo = Math.random() * Math.PI * 2;
        const velocidad = Math.random() * 5 + 2;
        particulasFuegos.push({
          x: x,
          y: y,
          vx: Math.cos(angulo) * velocidad,
          vy: Math.sin(angulo) * velocidad,
          radio: Math.random() * 2.5 + 1.5,
          color: colores[Math.floor(Math.random() * colores.length)],
          vida: 1,
          degradacion: Math.random() * 0.025 + 0.015
        });
      }
    }

    document.body.addEventListener("click", (e) => {
      activarMusicaCantada();
      crearFuegoArtificial(e.clientX, e.clientY);
    });

    function animarCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particulasNieve.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.opacidad += p.velOpacidad;
        if (p.opacidad >= 1 || p.opacidad <= 0.2) p.velOpacidad = -p.velOpacidad;
        if (p.y > canvas.height) p.y = -5;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacidad);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      for (let i = particulasFuegos.length - 1; i >= 0; i--) {
        const p = particulasFuegos[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.vida -= p.degradacion;

        if (p.vida <= 0) {
          particulasFuegos.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.vida);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      requestAnimationFrame(animarCanvas);
    }

    animarCanvas();
  }
});
