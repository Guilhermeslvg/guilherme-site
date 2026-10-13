/* guilherme/efeitos · revelar palavras (text reveal)
   Cada palavra sobe de trás de uma máscara quando o texto aparece na tela.
   Uso: <h2 data-efeito="revelar">Seu título aqui</h2>
   Opções: data-repetir (revela de novo toda vez que volta à tela) */
(() => {
  if (!document.getElementById("ef-revelar")) {
    const s = document.createElement("style"); s.id = "ef-revelar";
    s.textContent = `
[data-efeito~="revelar"] .ef-palavra { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .08em; margin-bottom: -.08em; }
[data-efeito~="revelar"] .ef-palavra > span { display: inline-block; transform: translateY(105%); transition: transform .9s cubic-bezier(.22,1,.36,1); transition-delay: calc(var(--i) * 60ms); }
[data-efeito~="revelar"].ef-visivel .ef-palavra > span { transform: none; }
@media (prefers-reduced-motion: reduce) { [data-efeito~="revelar"] .ef-palavra > span { transform: none; transition: none; } }`;
    document.head.append(s);
  }
  function iniciar(el) {
    if (el.dataset.efRevelar) return; el.dataset.efRevelar = "1";
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = el.textContent.trim().split(/\s+/).map((p, i) => `<span class="ef-palavra" aria-hidden="true"><span style="--i:${i}">${p.replace(/</g, "&lt;")}</span></span>`).join(" ");
    const repetir = el.hasAttribute("data-repetir");
    new IntersectionObserver(([e], o) => {
      if (e.isIntersecting) { el.classList.add("ef-visivel"); if (!repetir) o.disconnect(); }
      else if (repetir) el.classList.remove("ef-visivel");
    }, { threshold: .4 }).observe(el);
  }
  const tudo = () => document.querySelectorAll('[data-efeito~="revelar"]').forEach(iniciar);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", tudo) : tudo();
  (window.Efeitos ||= {}).revelar = iniciar;
})();
