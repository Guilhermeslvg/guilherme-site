/* guilherme/efeitos · cartão com brilho (spotlight card / glow card)
   Uma luz segue o mouse por dentro do cartão e acende a borda mais perto dele; a luz passa de um cartão para o outro.
   Inspirado no GlowCard publicado no 21st.dev; reescrito do zero em JavaScript puro.
   Uso: <div class="cartao" data-efeito="cartao-brilho">...</div>   (o elemento precisa de border-radius próprio)
   Ajustes (CSS): --luz-cor (borda), --luz-fundo (brilho de dentro), --luz-tamanho */
(() => {
  if (!document.getElementById("ef-cartao-brilho")) {
    const s = document.createElement("style"); s.id = "ef-cartao-brilho";
    s.textContent = `
:where([data-efeito~="cartao-brilho"]) { position: relative; isolation: isolate; --mx: -999px; --my: -999px; }
[data-efeito~="cartao-brilho"]::before, [data-efeito~="cartao-brilho"]::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
[data-efeito~="cartao-brilho"]::before { z-index: 2; padding: 1.5px;
  background: radial-gradient(calc(var(--luz-tamanho, 260px) * .8) circle at var(--mx) var(--my), var(--luz-cor, #2cd3f2), transparent 70%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; }
[data-efeito~="cartao-brilho"]::after { z-index: -1; background: radial-gradient(var(--luz-tamanho, 260px) circle at var(--mx) var(--my), var(--luz-fundo, rgba(44,211,242,.14)), transparent 70%); }`;
    document.head.append(s);
  }
  // um só ouvinte para todos os cartões: a luz é a posição do mouse na tela, então ela "vaza" para o cartão vizinho
  const cartoes = new Set();
  let pedido = null, px = -9999, py = -9999;
  const pintar = () => { pedido = null; cartoes.forEach((c) => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", px - r.left + "px"); c.style.setProperty("--my", py - r.top + "px"); }); };
  const mover = (e) => { px = e.clientX; py = e.clientY; if (!pedido) pedido = requestAnimationFrame(pintar); };
  addEventListener("pointermove", mover, { passive: true });
  addEventListener("scroll", () => { if (!pedido) pedido = requestAnimationFrame(pintar); }, { passive: true });
  function iniciar(el) { cartoes.add(el); }
  const tudo = () => document.querySelectorAll('[data-efeito~="cartao-brilho"]').forEach(iniciar);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", tudo) : tudo();
  (window.Efeitos ||= {})["cartao-brilho"] = iniciar;
})();
