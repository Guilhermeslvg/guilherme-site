/* guilherme/efeitos · botão magnético (magnetic button)
   O elemento é puxado na direção do mouse quando ele chega perto e volta ao lugar quando sai.
   Uso: <a class="botao" data-efeito="magnetico">Pedir orçamento</a>
   Opções: data-forca (0 a 1, padrão .35) */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(pointer: fine)").matches) return;
  function iniciar(el) {
    if (el.dataset.efMagnetico) return; el.dataset.efMagnetico = "1";
    const forca = +el.dataset.forca || .35;
    el.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * forca}px, ${(e.clientY - r.top - r.height / 2) * forca}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  }
  const tudo = () => document.querySelectorAll('[data-efeito~="magnetico"]').forEach(iniciar);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", tudo) : tudo();
  (window.Efeitos ||= {}).magnetico = iniciar;
})();
