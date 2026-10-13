/* guilherme/efeitos · máquina de escrever (typewriter)
   Escreve uma frase letra por letra, apaga e passa para a próxima.
   Uso: <p data-efeito="maquina" data-frases="Landing pages|Sistemas|Automação">Landing pages</p>
   Opções: data-velocidade (ms por letra, padrão 70), data-pausa (ms com a frase pronta, padrão 1600) */
(() => {
  if (!document.getElementById("ef-maquina")) {
    const s = document.createElement("style"); s.id = "ef-maquina";
    s.textContent = `
[data-efeito~="maquina"]::after { content: ""; display: inline-block; width: .08em; height: 1em; margin-left: .06em; vertical-align: -.12em; background: currentColor; animation: ef-cursor 1s steps(1) infinite; }
@keyframes ef-cursor { 50% { opacity: 0; } }`;
    document.head.append(s);
  }
  const semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function iniciar(el) {
    if (el.dataset.efMaquina) return; el.dataset.efMaquina = "1";
    const frases = (el.dataset.frases || el.textContent).split("|").map((f) => f.trim()).filter(Boolean);
    if (semMovimento || !frases.length) return;
    el.setAttribute("aria-label", frases.join(", "));
    const vel = +el.dataset.velocidade || 70, pausa = +el.dataset.pausa || 1600;
    let f = 0, n = 0, apagando = false;
    const passo = () => {
      const frase = frases[f];
      n += apagando ? -1 : 1; el.textContent = frase.slice(0, n);
      if (!apagando && n === frase.length) { apagando = true; return setTimeout(passo, pausa); }
      if (apagando && n === 0) { apagando = false; f = (f + 1) % frases.length; return setTimeout(passo, 350); }
      setTimeout(passo, apagando ? vel * .5 : vel);
    };
    el.textContent = ""; passo();
  }
  const tudo = () => document.querySelectorAll('[data-efeito~="maquina"]').forEach(iniciar);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", tudo) : tudo();
  (window.Efeitos ||= {}).maquina = iniciar;
})();
