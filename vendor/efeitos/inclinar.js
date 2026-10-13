/* guilherme/efeitos · inclinar em 3D (tilt card)
   O elemento inclina na direção do mouse, com um reflexo de luz por cima.
   Uso: <div class="cartao" data-efeito="inclinar">...</div>
   Opções: data-graus (inclinação máxima, padrão 10) */
(() => {
  if (!document.getElementById("ef-inclinar")) {
    const s = document.createElement("style"); s.id = "ef-inclinar";
    s.textContent = `
[data-efeito~="inclinar"] { transform-style: preserve-3d; transition: transform .5s cubic-bezier(.22,1,.36,1); will-change: transform; }
[data-efeito~="inclinar"] .ef-reflexo { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .4s;
  background: radial-gradient(circle at var(--rx, 50%) var(--ry, 50%), rgba(255,255,255,.35), transparent 55%); mix-blend-mode: soft-light; }
[data-efeito~="inclinar"]:hover .ef-reflexo { opacity: 1; }`;
    document.head.append(s);
  }
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  function iniciar(el) {
    if (el.dataset.efInclinar) return; el.dataset.efInclinar = "1";
    const graus = +el.dataset.graus || 10;
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    const reflexo = document.createElement("span"); reflexo.className = "ef-reflexo"; reflexo.setAttribute("aria-hidden", "true"); el.append(reflexo);
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateY(${(x - .5) * graus * 2}deg) rotateX(${(.5 - y) * graus * 2}deg)`;
      el.style.setProperty("--rx", x * 100 + "%"); el.style.setProperty("--ry", y * 100 + "%");
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  }
  const tudo = () => document.querySelectorAll('[data-efeito~="inclinar"]').forEach(iniciar);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", tudo) : tudo();
  (window.Efeitos ||= {}).inclinar = iniciar;
})();
