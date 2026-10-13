/* guilherme/efeitos · borda girando (animated gradient border)
   Um feixe de luz dá a volta na borda do elemento sem parar.
   Uso: <div class="cartao" data-efeito="borda">...</div>   (o elemento precisa de border-radius próprio)
   Ajustes (CSS): --borda-cor, --borda-largura, --borda-tempo */
(() => {
  if (document.getElementById("ef-borda")) return;
  const s = document.createElement("style"); s.id = "ef-borda";
  s.textContent = `
@property --ef-angulo { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
:where([data-efeito~="borda"]) { position: relative; isolation: isolate; }
[data-efeito~="borda"]::before { content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none; border-radius: inherit; padding: var(--borda-largura, 2px);
  background: conic-gradient(from var(--ef-angulo), transparent 0deg 250deg, var(--borda-cor, #2cd3f2) 320deg, #fff 345deg, transparent 360deg);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;
  animation: ef-girar var(--borda-tempo, 3.5s) linear infinite; }
@keyframes ef-girar { to { --ef-angulo: 360deg; } }
@media (prefers-reduced-motion: reduce) { [data-efeito~="borda"]::before { animation: none; --ef-angulo: 300deg; } }`;
  document.head.append(s);
})();
