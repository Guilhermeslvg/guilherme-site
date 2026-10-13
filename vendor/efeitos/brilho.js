/* guilherme/efeitos · brilho no texto (text shimmer)
   Uma faixa de luz atravessa as letras de tempos em tempos.
   Uso: <h1 data-efeito="brilho">Seu texto</h1>
   Ajustes (CSS): --brilho-base, --brilho-luz, --brilho-tempo */
(() => {
  if (document.getElementById("ef-brilho")) return;
  const s = document.createElement("style"); s.id = "ef-brilho";
  s.textContent = `
[data-efeito~="brilho"] {
  background: linear-gradient(110deg, var(--brilho-base, #07152f) 40%, var(--brilho-luz, #2cd3f2) 50%, var(--brilho-base, #07152f) 60%);
  background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: ef-brilho var(--brilho-tempo, 3s) linear infinite;
}
@keyframes ef-brilho { from { background-position: 100% 0; } to { background-position: -150% 0; } }
@media (prefers-reduced-motion: reduce) { [data-efeito~="brilho"] { animation: none; background-position: 0 0; } }`;
  document.head.append(s);
})();
