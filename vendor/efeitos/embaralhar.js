/* guilherme/efeitos · letras embaralhando (text scramble)
   As letras viram símbolos e voltam ao texto, da esquerda para a direita.
   Uso: <h2 data-efeito="embaralhar">Seu texto</h2>
   Opções: data-gatilho="passar" (mouse em cima, padrão), "ver" (quando aparece na tela) ou "sempre" (repete);
           data-simbolos="01<>/{}" troca os caracteres usados */
(() => {
  const semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function iniciar(el) {
    if (el.dataset.efEmbaralhar) return; el.dataset.efEmbaralhar = "1";
    const final = el.textContent, simbolos = el.dataset.simbolos || "01<>/{}[]#=+*%&$";
    let quadro = null;
    const rodar = (feito) => {
      if (semMovimento) return feito?.();
      cancelAnimationFrame(quadro); const t0 = performance.now();
      const passo = (agora) => {
        const t = (agora - t0) / 700;
        el.textContent = [...final].map((c, k) => (c === " " || t > .2 + k * .045 ? c : simbolos[(Math.random() * simbolos.length) | 0])).join("");
        if (t < .2 + final.length * .045) quadro = requestAnimationFrame(passo); else { el.textContent = final; feito?.(); }
      };
      quadro = requestAnimationFrame(passo);
    };
    const gatilho = el.dataset.gatilho || "passar";
    if (gatilho === "passar") el.addEventListener("pointerenter", () => rodar());
    else if (gatilho === "ver") new IntersectionObserver(([e], o) => { if (e.isIntersecting) { rodar(); o.disconnect(); } }, { threshold: .6 }).observe(el);
    else { const repetir = () => rodar(() => setTimeout(repetir, 2200)); repetir(); }
  }
  const tudo = () => document.querySelectorAll('[data-efeito~="embaralhar"]').forEach(iniciar);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", tudo) : tudo();
  (window.Efeitos ||= {}).embaralhar = iniciar;
})();
