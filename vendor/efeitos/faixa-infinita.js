/* guilherme/efeitos · faixa infinita (marquee / logo loop)
   O conteúdo desliza sem fim, duplicado sozinho; para quando o mouse passa por cima e some aos poucos nas bordas.
   Uso: <div data-efeito="faixa-infinita"><span>Logo 1</span><span>Logo 2</span><span>Logo 3</span></div>
   Opções: data-direcao="esquerda | direita" (padrão esquerda), data-velocidade (pixels por segundo, padrão 60)
   Ajustes (CSS): --faixa-espaco (distância entre os itens), --faixa-borda (largura do esmaecido nas pontas) */
(() => {
  if (!document.getElementById("ef-faixa-infinita")) {
    const s = document.createElement("style"); s.id = "ef-faixa-infinita";
    s.textContent = `
:where([data-efeito~="faixa-infinita"]) { display: block; overflow: hidden;
  -webkit-mask: linear-gradient(90deg, transparent, #000 var(--faixa-borda, 12%), #000 calc(100% - var(--faixa-borda, 12%)), transparent);
  mask: linear-gradient(90deg, transparent, #000 var(--faixa-borda, 12%), #000 calc(100% - var(--faixa-borda, 12%)), transparent); }
[data-efeito~="faixa-infinita"] > .ef-faixa-trilho { display: flex; width: max-content; animation: ef-faixa var(--ef-faixa-tempo, 20s) linear infinite; }
[data-efeito~="faixa-infinita"][data-direcao="direita"] > .ef-faixa-trilho { animation-direction: reverse; }
[data-efeito~="faixa-infinita"]:hover > .ef-faixa-trilho, [data-efeito~="faixa-infinita"]:focus-within > .ef-faixa-trilho { animation-play-state: paused; }
[data-efeito~="faixa-infinita"] .ef-faixa-grupo { display: flex; flex-shrink: 0; align-items: center; gap: var(--faixa-espaco, 3rem); padding-right: var(--faixa-espaco, 3rem); }
@keyframes ef-faixa { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
  [data-efeito~="faixa-infinita"] { overflow-x: auto; -webkit-mask: none; mask: none; }
  [data-efeito~="faixa-infinita"] > .ef-faixa-trilho { animation: none; }
  [data-efeito~="faixa-infinita"] .ef-faixa-copia { display: none; }
}`;
    document.head.append(s);
  }
  const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function iniciar(el) {
    if (el.dataset.efFaixaInfinita) return; el.dataset.efFaixaInfinita = "1";
    const itens = [...el.children];
    const trilho = document.createElement("div"); trilho.className = "ef-faixa-trilho";
    const grupo = document.createElement("div"); grupo.className = "ef-faixa-grupo";
    grupo.append(...itens); trilho.append(grupo); el.append(trilho);
    if (calmo || !itens.length) return;
    // cópia escondida de leitores de tela e do teclado
    const copiar = (no) => { const c = no.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.setAttribute("inert", ""); c.classList.add("ef-faixa-copia"); return c; };
    const segundo = copiar(grupo); trilho.append(segundo);
    const ajustar = () => {
      // o grupo precisa ser pelo menos da largura da faixa, senão aparece buraco
      let voltas = 0;
      while (grupo.offsetWidth < el.clientWidth && voltas++ < 20) itens.forEach((i) => grupo.append(copiar(i)));
      segundo.replaceChildren(...[...grupo.children].map((i) => i.cloneNode(true)));
      const vel = +el.dataset.velocidade || 60;
      el.style.setProperty("--ef-faixa-tempo", grupo.offsetWidth / vel + "s");
    };
    ajustar();
    new ResizeObserver(ajustar).observe(el);
  }
  const tudo = () => document.querySelectorAll('[data-efeito~="faixa-infinita"]').forEach(iniciar);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", tudo) : tudo();
  (window.Efeitos ||= {})["faixa-infinita"] = iniciar;
})();
