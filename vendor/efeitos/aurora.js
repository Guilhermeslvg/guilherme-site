/* guilherme/efeitos · fundo aurora (aurora background)
   Manchas de luz borradas se movendo devagar atrás do conteúdo, como uma aurora.
   Uso: <section data-efeito="aurora">...</section>
   Ajustes (CSS): --aurora-1, --aurora-2, --aurora-3 (cores), --aurora-fundo, --aurora-tempo */
(() => {
  if (document.getElementById("ef-aurora")) return;
  const s = document.createElement("style"); s.id = "ef-aurora";
  s.textContent = `
:where([data-efeito~="aurora"]) { position: relative; isolation: isolate; overflow: hidden; background: var(--aurora-fundo, #06112b); }
[data-efeito~="aurora"]::before { content: ""; position: absolute; inset: -40%; z-index: -1; pointer-events: none; filter: blur(48px); opacity: .85;
  background:
    radial-gradient(30% 40% at 30% 40%, var(--aurora-1, #2cd3f2), transparent 70%),
    radial-gradient(35% 30% at 70% 35%, var(--aurora-2, #1d5fd0), transparent 70%),
    radial-gradient(30% 35% at 55% 70%, var(--aurora-3, #6fb2f0), transparent 70%);
  animation: ef-aurora var(--aurora-tempo, 14s) ease-in-out infinite alternate; }
@keyframes ef-aurora { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(25deg) scale(1.15) translate(4%, -3%); } 100% { transform: rotate(-15deg) scale(1.05) translate(-4%, 3%); } }
@media (prefers-reduced-motion: reduce) { [data-efeito~="aurora"]::before { animation: none; } }`;
  document.head.append(s);
})();
