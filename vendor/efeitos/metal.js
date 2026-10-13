/* guilherme/efeitos · metal líquido (liquid metal shader)
   Fundo de metal derretido se movendo devagar, feito em WebGL; deforma de leve onde o mouse passa.
   Uso: <section data-efeito="metal">...</section>
   Opções: data-cores="fundo,base,metal,reflexo" em hexadecimal (padrão "#030916,#06112b,#1d5fd0,#ffffff")
           data-veu="0.6" quanto o metal aparece (0 a 1) · data-velocidade="0.72" */
(() => {
  const VERT = "attribute vec2 a; varying vec2 v_uv; void main(){ v_uv = a * .5 + .5; gl_Position = vec4(a, 0., 1.); }";
  const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res, u_mouse; uniform float u_forca, u_t, u_veu;
uniform vec3 u_fundo, u_base, u_metal, u_reflexo;
// sorteio por célula: vira um ângulo, e o ângulo vira a direção do gradiente
vec2 dir(vec2 c){ float a = fract(sin(dot(c, vec2(27.619, 57.583))) * 29871.137) * 6.2831853; return vec2(cos(a), sin(a)); }
// ruído de gradiente com curva de quinto grau (sem quinas)
float ruido(vec2 p){ vec2 i = floor(p), f = fract(p), u = f * f * f * (f * (f * 6. - 15.) + 10.);
  float a = dot(dir(i), f), b = dot(dir(i + vec2(1., 0.)), f - vec2(1., 0.));
  float c = dot(dir(i + vec2(0., 1.)), f - vec2(0., 1.)), d = dot(dir(i + 1.), f - 1.);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y); }
// 5 camadas, cada uma girada ~31° e quase o dobro do tamanho
float camadas(vec2 p){ float s = 0., amp = .5; mat2 gira = mat2(.857, .515, -.515, .857);
  for (int k = 0; k < 5; k++) { s += amp * ruido(p); p = gira * p * 1.93 + vec2(3.7, -1.9); amp *= .42; } return s; }
// uma etapa de distorção somada a ondas senoidais que escorrem
float liquido(vec2 p, float t){
  vec2 deriva = vec2(t * .06, -t * .045);
  vec2 q = vec2(camadas(p * .55 + deriva), camadas(p * .55 + vec2(-6.1, 2.4) - deriva * .8));
  vec2 onda = vec2(sin(p.y * 1.3 + t * .5 + q.x * 2.5), cos(p.x * 1.1 - t * .42 + q.y * 2.5)) * .3;
  return camadas((p + q * 2.2 + onda) * .45 - deriva * .5) + length(q) * .5;
}
void main(){
  float asp = u_res.x / max(u_res.y, 1.);
  vec2 p = (v_uv - .5) * vec2(asp, 1.) * 1.6, m = (u_mouse - .5) * vec2(asp, 1.) * 1.6, dl = p - m;
  p -= dl * exp(-dot(dl, dl) * 3.2) * .3 * u_forca; // o mouse estufa o metal
  // dobra o valor em faixas: onda triangular, depois afina a parte clara
  float v = liquido(p, u_t), dobra = abs(fract(v * 6. + u_t * .03) * 2. - 1.);
  float f = pow(smoothstep(0., 1., dobra), 2.2);
  float eco = pow(abs(fract(v * 2.3 + .37) * 2. - 1.), 6.) * .35; // reflexo fraco e largo nas partes escuras
  vec3 c = mix(u_fundo, u_base, smoothstep(.04, .3, f));
  c = mix(c, u_metal, max(smoothstep(.2, .55, f) * .9, eco));
  c = mix(c, u_reflexo, smoothstep(.62, .99, f) * .94);
  c = mix(u_fundo, c, u_veu);
  gl_FragColor = vec4(clamp(c, 0., 1.), 1.);
}`;
 const semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16) / 255);
  function iniciar(el) {
    if (el.dataset.efMetal) return; el.dataset.efMetal = "1";
    const cv = document.createElement("canvas"); cv.setAttribute("aria-hidden", "true");
    Object.assign(cv.style, { position: "absolute", inset: "0", width: "100%", height: "100%", zIndex: "-1", pointerEvents: "none" });
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    el.style.isolation = "isolate"; el.prepend(cv);
    const gl = cv.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) return cv.remove();
    const sh = (tipo, src) => { const s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return cv.remove();
    const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (nome) => gl.getUniformLocation(pr, nome);
    const [fundo, base, metal, reflexo] = (el.dataset.cores || "#030916,#06112b,#1d5fd0,#ffffff").split(",").map((c) => hex(c.trim()));
    gl.uniform3fv(U("u_fundo"), fundo); gl.uniform3fv(U("u_base"), base); gl.uniform3fv(U("u_metal"), metal); gl.uniform3fv(U("u_reflexo"), reflexo);
    gl.uniform1f(U("u_veu"), +(el.dataset.veu || .6));
    const vel = +(el.dataset.velocidade || .72), mouse = { x: .5, y: .5, f: 0, cx: .5, cy: .5, cf: 0 };
    let tempo = 0, ultimo = performance.now(), visivel = false, pedido = null;
    const desenhar = (agora) => {
      pedido = null;
      const dt = Math.min(Math.max((agora - ultimo) / 1000, 0), .05); ultimo = agora;
      if (!semMovimento) tempo += dt * vel;
      const ez = 1 - Math.exp(-dt * 8);
      mouse.cx += (mouse.x - mouse.cx) * ez; mouse.cy += (mouse.y - mouse.cy) * ez; mouse.cf += (mouse.f - mouse.cf) * ez;
      const r = Math.min(devicePixelRatio || 1, 1.25), w = Math.max(1, Math.round(cv.clientWidth * r)), hh = Math.max(1, Math.round(cv.clientHeight * r));
      if (cv.width !== w || cv.height !== hh) { cv.width = w; cv.height = hh; gl.viewport(0, 0, w, hh); }
      gl.uniform2f(U("u_res"), w, hh); gl.uniform2f(U("u_mouse"), mouse.cx, mouse.cy); gl.uniform1f(U("u_forca"), mouse.cf); gl.uniform1f(U("u_t"), tempo);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visivel && !semMovimento) pedido = requestAnimationFrame(desenhar);
    };
    const acordar = () => { if (!pedido) { ultimo = performance.now(); pedido = requestAnimationFrame(desenhar); } };
    el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); mouse.x = (e.clientX - r.left) / r.width; mouse.y = 1 - (e.clientY - r.top) / r.height; mouse.f = 1; });
    el.addEventListener("pointerleave", () => { mouse.f = 0; });
    new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) acordar(); }).observe(el);
  }
  const tudo = () => document.querySelectorAll('[data-efeito~="metal"]').forEach(iniciar);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", tudo) : tudo();
  (window.Efeitos ||= {}).metal = iniciar;
})();
