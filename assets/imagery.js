/* ============================================================
   CVImagery — shared procedural image generator
   Draws 6 recognizable classes at any size, with seeded variation.
   Used by CLIP, DINO, Representation Learning modules.
   ============================================================ */
(function () {
  const CLASSES = ["cat", "dog", "car", "bird", "tree", "flower"];
  const PROMPTS = {
    cat:    "a photo of a cat",
    dog:    "a photo of a dog",
    car:    "a photo of a car",
    bird:   "a photo of a bird",
    tree:   "a photo of a tree",
    flower: "a photo of a flower",
  };
  // a 12-D semantic "concept" per class — used to fake a shared embedding space
  const CONCEPT = {
    cat:    [ 0.9,  0.2, -0.3,  0.7, -0.1,  0.4, -0.6,  0.2,  0.5, -0.4,  0.1,  0.3],
    dog:    [ 0.8,  0.4, -0.2,  0.5,  0.1,  0.5, -0.4,  0.3,  0.3, -0.2,  0.0,  0.4],
    car:    [-0.6,  0.7,  0.8, -0.4,  0.6, -0.5,  0.3, -0.7,  0.1,  0.6, -0.4, -0.3],
    bird:   [ 0.3, -0.5, -0.1,  0.4, -0.6,  0.2, -0.2,  0.6, -0.4, -0.1,  0.7,  0.2],
    tree:   [-0.4, -0.7,  0.2, -0.6, -0.3, -0.2,  0.7,  0.1, -0.5,  0.3,  0.4, -0.6],
    flower: [-0.2, -0.3,  0.1, -0.1,  0.7,  0.6,  0.5, -0.2,  0.6,  0.4,  0.5,  0.7],
  };

  function rng(seed) {
    let s = (seed * 9301 + 49297) % 233280;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }

  // draw class onto ctx, filling a size×size box at (ox, oy)
  function draw(ctx, cls, size, ox = 0, oy = 0, seed = 1) {
    const r = rng(seed * 131 + cls.length * 17);
    const S = size, cx = ox + S / 2, cy = oy + S / 2;
    // background
    const bgs = {
      cat: "#1b1410", dog: "#15110c", car: "#0c1018", bird: "#0c1418", tree: "#0a120c", flower: "#140c14",
    };
    ctx.fillStyle = bgs[cls] || "#0c0f14";
    ctx.fillRect(ox, oy, S, S);
    // subtle ground/sky tint
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fillRect(ox, oy + S * 0.6, S, S * 0.4);

    const jx = (r() - 0.5) * S * 0.08, jy = (r() - 0.5) * S * 0.06;

    if (cls === "cat") {
      const furs = ["#e0a94d", "#c9c2b6", "#8a8a8a", "#d98b3a"];
      const fur = furs[Math.floor(r() * furs.length)];
      ctx.fillStyle = fur;
      // body
      ctx.beginPath(); ctx.ellipse(cx + jx, cy + S*0.22 + jy, S*0.26, S*0.18, 0, 0, 7); ctx.fill();
      // head
      ctx.beginPath(); ctx.arc(cx + jx, cy - S*0.08 + jy, S*0.2, 0, 7); ctx.fill();
      // ears (triangles)
      ctx.beginPath(); ctx.moveTo(cx-S*0.18+jx, cy-S*0.2+jy); ctx.lineTo(cx-S*0.24+jx, cy-S*0.36+jy); ctx.lineTo(cx-S*0.06+jx, cy-S*0.24+jy); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx+S*0.18+jx, cy-S*0.2+jy); ctx.lineTo(cx+S*0.24+jx, cy-S*0.36+jy); ctx.lineTo(cx+S*0.06+jx, cy-S*0.24+jy); ctx.fill();
      // eyes
      ctx.fillStyle = "#2bd17e";
      ctx.beginPath(); ctx.ellipse(cx-S*0.08+jx, cy-S*0.09+jy, S*0.035, S*0.05, 0, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+S*0.08+jx, cy-S*0.09+jy, S*0.035, S*0.05, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#111"; 
      ctx.beginPath(); ctx.ellipse(cx-S*0.08+jx, cy-S*0.09+jy, S*0.012, S*0.04, 0, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+S*0.08+jx, cy-S*0.09+jy, S*0.012, S*0.04, 0, 0, 7); ctx.fill();
      // nose + whiskers
      ctx.fillStyle = "#e0607a"; ctx.beginPath(); ctx.arc(cx+jx, cy-S*0.01+jy, S*0.018, 0, 7); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = Math.max(1, S*0.006);
      for (const d of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(cx+jx, cy+jy); ctx.lineTo(cx+d*S*0.22+jx, cy-S*0.02+jy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx+jx, cy+jy); ctx.lineTo(cx+d*S*0.22+jx, cy+S*0.04+jy); ctx.stroke();
      }
    }

    else if (cls === "dog") {
      const furs = ["#a9712f", "#caa46a", "#6b4a2a", "#3a3a3a"];
      const fur = furs[Math.floor(r() * furs.length)];
      ctx.fillStyle = fur;
      ctx.beginPath(); ctx.ellipse(cx + jx, cy + S*0.22 + jy, S*0.27, S*0.17, 0, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + jx, cy - S*0.06 + jy, S*0.2, S*0.18, 0, 0, 7); ctx.fill();
      // snout
      ctx.beginPath(); ctx.ellipse(cx + jx, cy + S*0.06 + jy, S*0.1, S*0.08, 0, 0, 7); ctx.fill();
      // floppy ears
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath(); ctx.ellipse(cx-S*0.2+jx, cy-S*0.04+jy, S*0.07, S*0.16, -0.4, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+S*0.2+jx, cy-S*0.04+jy, S*0.07, S*0.16, 0.4, 0, 7); ctx.fill();
      // eyes
      ctx.fillStyle = "#111";
      ctx.beginPath(); ctx.arc(cx-S*0.08+jx, cy-S*0.08+jy, S*0.028, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+S*0.08+jx, cy-S*0.08+jy, S*0.028, 0, 7); ctx.fill();
      // nose
      ctx.beginPath(); ctx.arc(cx+jx, cy+S*0.05+jy, S*0.035, 0, 7); ctx.fill();
    }

    else if (cls === "car") {
      const cols = ["#ff3366", "#ffd400", "#4dd0ff", "#2ee68b", "#e8e8e8"];
      const col = cols[Math.floor(r() * cols.length)];
      // road
      ctx.fillStyle = "#2a2f38"; ctx.fillRect(ox, cy + S*0.18, S, S*0.32);
      // body
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(cx-S*0.32+jx, cy+S*0.12+jy);
      ctx.lineTo(cx-S*0.24+jx, cy-S*0.04+jy);
      ctx.lineTo(cx-S*0.08+jx, cy-S*0.06+jy);
      ctx.lineTo(cx-S*0.02+jx, cy-S*0.18+jy);
      ctx.lineTo(cx+S*0.14+jx, cy-S*0.18+jy);
      ctx.lineTo(cx+S*0.22+jx, cy-S*0.04+jy);
      ctx.lineTo(cx+S*0.32+jx, cy-S*0.02+jy);
      ctx.lineTo(cx+S*0.32+jx, cy+S*0.12+jy);
      ctx.closePath(); ctx.fill();
      // windows
      ctx.fillStyle = "rgba(10,20,30,0.7)";
      ctx.beginPath();
      ctx.moveTo(cx-S*0.06+jx, cy-S*0.05+jy); ctx.lineTo(cx-S*0.01+jx, cy-S*0.15+jy);
      ctx.lineTo(cx+S*0.12+jx, cy-S*0.15+jy); ctx.lineTo(cx+S*0.17+jx, cy-S*0.05+jy); ctx.closePath(); ctx.fill();
      // wheels
      ctx.fillStyle = "#15171c";
      ctx.beginPath(); ctx.arc(cx-S*0.16+jx, cy+S*0.14+jy, S*0.07, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+S*0.18+jx, cy+S*0.14+jy, S*0.07, 0, 7); ctx.fill();
      ctx.fillStyle = "#5a6271";
      ctx.beginPath(); ctx.arc(cx-S*0.16+jx, cy+S*0.14+jy, S*0.03, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+S*0.18+jx, cy+S*0.14+jy, S*0.03, 0, 7); ctx.fill();
    }

    else if (cls === "bird") {
      const cols = ["#4dd0ff", "#ffd400", "#ff3366", "#2ee68b"];
      const col = cols[Math.floor(r() * cols.length)];
      ctx.fillStyle = col;
      // body
      ctx.beginPath(); ctx.ellipse(cx + jx, cy + S*0.05 + jy, S*0.16, S*0.22, 0.3, 0, 7); ctx.fill();
      // head
      ctx.beginPath(); ctx.arc(cx + S*0.1 + jx, cy - S*0.2 + jy, S*0.11, 0, 7); ctx.fill();
      // wing
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath(); ctx.ellipse(cx - S*0.02 + jx, cy + S*0.05 + jy, S*0.1, S*0.16, 0.5, 0, 7); ctx.fill();
      // beak
      ctx.fillStyle = "#ff9d3a";
      ctx.beginPath(); ctx.moveTo(cx+S*0.2+jx, cy-S*0.2+jy); ctx.lineTo(cx+S*0.32+jx, cy-S*0.17+jy); ctx.lineTo(cx+S*0.2+jx, cy-S*0.13+jy); ctx.fill();
      // eye
      ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(cx+S*0.12+jx, cy-S*0.22+jy, S*0.02, 0, 7); ctx.fill();
      // legs
      ctx.strokeStyle = "#ff9d3a"; ctx.lineWidth = Math.max(1, S*0.012);
      ctx.beginPath(); ctx.moveTo(cx+jx, cy+S*0.25+jy); ctx.lineTo(cx-S*0.04+jx, cy+S*0.36+jy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+S*0.05+jx, cy+S*0.25+jy); ctx.lineTo(cx+S*0.08+jx, cy+S*0.36+jy); ctx.stroke();
    }

    else if (cls === "tree") {
      // trunk
      ctx.fillStyle = "#6b4a2a";
      ctx.fillRect(cx - S*0.04 + jx, cy + S*0.02 + jy, S*0.08, S*0.32);
      // foliage clusters
      const greens = ["#2e8b4e", "#3aa860", "#246b3c"];
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = greens[i % greens.length];
        const a = i / 5 * Math.PI * 2;
        const px = cx + Math.cos(a) * S*0.12 + jx;
        const py = cy - S*0.12 + Math.sin(a) * S*0.1 + jy;
        ctx.beginPath(); ctx.arc(px, py, S*0.13, 0, 7); ctx.fill();
      }
      ctx.fillStyle = "#3aa860";
      ctx.beginPath(); ctx.arc(cx + jx, cy - S*0.12 + jy, S*0.16, 0, 7); ctx.fill();
    }

    else if (cls === "flower") {
      const cols = ["#ff3366", "#ffd400", "#b388ff", "#4dd0ff", "#ff9d3a"];
      const col = cols[Math.floor(r() * cols.length)];
      // stem
      ctx.strokeStyle = "#2e8b4e"; ctx.lineWidth = Math.max(2, S*0.025);
      ctx.beginPath(); ctx.moveTo(cx+jx, cy+jy); ctx.lineTo(cx+jx, cy+S*0.4+jy); ctx.stroke();
      // leaf
      ctx.fillStyle = "#2e8b4e";
      ctx.beginPath(); ctx.ellipse(cx+S*0.08+jx, cy+S*0.22+jy, S*0.08, S*0.035, -0.5, 0, 7); ctx.fill();
      // petals
      ctx.fillStyle = col;
      const petals = 6 + Math.floor(r()*3);
      for (let i = 0; i < petals; i++) {
        const a = i / petals * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(a)*S*0.13 + jx, cy + Math.sin(a)*S*0.13 - S*0.05 + jy, S*0.07, S*0.04, a, 0, 7);
        ctx.fill();
      }
      // center
      ctx.fillStyle = "#ffd400"; ctx.beginPath(); ctx.arc(cx+jx, cy-S*0.05+jy, S*0.06, 0, 7); ctx.fill();
      ctx.fillStyle = "#a06a10"; ctx.beginPath(); ctx.arc(cx+jx, cy-S*0.05+jy, S*0.03, 0, 7); ctx.fill();
    }
  }

  // produce a deterministic "image embedding" in a shared D-dim space.
  // imgNoise simulates the visual-encoder's imperfect, style-dependent reading.
  function imageEmbedding(cls, seed, D = 12, noiseLevel = 0.35) {
    const base = CONCEPT[cls];
    const r = rng(seed * 977 + 13);
    const v = [];
    for (let i = 0; i < D; i++) v.push(base[i % base.length] + (r() * 2 - 1) * noiseLevel);
    return normalize(v);
  }
  // text embedding: same concept space, different "phrasing" noise
  function textEmbedding(cls, D = 12, noiseLevel = 0.12) {
    const base = CONCEPT[cls];
    const r = rng(cls.length * 313 + 7);
    const v = [];
    for (let i = 0; i < D; i++) v.push(base[i % base.length] + (r() * 2 - 1) * noiseLevel);
    return normalize(v);
  }
  function normalize(v) {
    const n = Math.hypot(...v) || 1;
    return v.map(x => x / n);
  }
  function cosine(a, b) {
    let d = 0; for (let i = 0; i < a.length; i++) d += a[i] * b[i];
    return d;
  }

  window.CVImagery = { CLASSES, PROMPTS, CONCEPT, draw, imageEmbedding, textEmbedding, normalize, cosine, rng };
})();
