// Shared nav / sidebar injector
(function () {
  const MODULES = [
    { group: "FOUNDATIONS", items: [
      { id: "matrix",        n: "01", title: "Matrix & Tensor",          href: "matrix.html" },
      { id: "convolution",   n: "02", title: "Convolution Kernels",      href: "convolution.html" },
      { id: "features",      n: "03", title: "Feature Extraction",       href: "features.html" },
      { id: "activations",   n: "04", title: "Activation Functions",     href: "activations.html" },
      { id: "loss",          n: "05", title: "Loss Functions",           href: "loss.html" },
      { id: "optimizers",    n: "06", title: "Optimizers",               href: "optimizers.html" },
      { id: "regularization",n: "07", title: "Regularization",           href: "regularization.html" },
      { id: "mlp",           n: "08", title: "The MLP · step-by-step",   href: "mlp.html" },
    ]},
    { group: "ARCHITECTURES", items: [
      { id: "cnn",          n: "09", title: "CNN Builder",               href: "cnn.html" },
      { id: "attention",    n: "10", title: "Attention & Transformers",  href: "attention.html" },
      { id: "clip",         n: "11", title: "CLIP & OpenCLIP",           href: "clip.html" },
      { id: "dino",         n: "12", title: "DINO · Self-Supervised",    href: "dino.html" },
      { id: "gan",          n: "13", title: "GANs",                      href: "gan.html" },
    ]},
    { group: "LABORATORY", items: [
      { id: "opencv",         n: "14", title: "OpenCV Lab",              href: "opencv.html" },
      { id: "augmentation",   n: "15", title: "Augmentation Lab",        href: "augmentation.html" },
      { id: "training",       n: "16", title: "Training Simulator",      href: "training.html" },
      { id: "trainmlp",       n: "17", title: "Training MLP",            href: "training-mlp.html" },
      { id: "representation", n: "18", title: "Representation Learning", href: "representation.html" },
      { id: "embeddings",     n: "19", title: "Embeddings & Latents",    href: "embeddings.html" },
      { id: "sandbox",        n: "20", title: "AI Sandbox",              href: "sandbox.html" },
    ]},
  ];

  function buildSidebar(activeId, prefix) {
    let html = `
      <aside class="sidebar">
        <a class="brand" href="${prefix}index.html" style="text-decoration:none;color:inherit;">
          <div class="brand-mark"></div>
          <div class="brand-text"><b>CORTEX</b>.LAB / <span class="muted">v0.4</span></div>
        </a>
        <a class="nav-link${activeId==='home'?' active':''}" href="${prefix}index.html">
          <span class="idx">00</span><span>Overview</span>
        </a>`;
    for (const g of MODULES) {
      html += `<div class="nav-section"><h4>${g.group}</h4>`;
      for (const m of g.items) {
        html += `<a class="nav-link${activeId===m.id?' active':''}" href="${prefix}modules/${m.href}">
          <span class="idx">${m.n}</span><span>${m.title}</span>
        </a>`;
      }
      html += `</div>`;
    }
    html += `<div class="sidebar-foot">
      <div><span class="dot"></span>RUNTIME · WEBGL+CPU</div>
      <div style="margin-top:4px">SESSION · LOCAL</div>
      <div style="margin-top:4px">LATENCY · <span style="color:var(--text)">12ms</span></div>
    </div></aside>`;
    return html;
  }

  function buildTopbar(crumbs) {
    return `
      <div class="topbar">
        <div class="crumbs">${crumbs}</div>
        <div class="topbar-spacer"></div>
        <div class="toggle-group" data-toggle="explain">
          <button data-v="beginner">BEGINNER</button>
          <button class="on" data-v="advanced">ADVANCED</button>
        </div>
        <div class="toggle-group" data-toggle="theme">
          <button class="on" data-v="dark">DARK</button>
          <button data-v="light">LIGHT</button>
        </div>
        <span class="kbd">⌘ K</span>
      </div>`;
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("cortex-theme", theme); } catch (e) {}
    document.querySelectorAll('[data-toggle="theme"] button').forEach(b =>
      b.classList.toggle("on", b.dataset.v === theme));
  }

  function activateToggles(root) {
    root.querySelectorAll(".toggle-group").forEach(g => {
      g.addEventListener("click", e => {
        const b = e.target.closest("button"); if (!b) return;
        g.querySelectorAll("button").forEach(x => x.classList.remove("on"));
        b.classList.add("on");
        if (g.dataset.toggle === "theme") applyTheme(b.dataset.v);
      });
    });
  }

  window.CORTEX = {
    mount(activeId, crumbs, inModulesDir = true) {
      const prefix = inModulesDir ? "../" : "";
      const sidebar = buildSidebar(activeId, prefix);
      const topbar  = buildTopbar(crumbs);
      const shell = document.querySelector(".shell");
      if (!shell) return;
      // sidebar
      const aside = document.createElement("div");
      aside.innerHTML = sidebar;
      shell.insertBefore(aside.firstElementChild, shell.firstChild);
      // topbar
      const main = shell.querySelector("main");
      if (main) {
        const tb = document.createElement("div");
        tb.innerHTML = topbar;
        main.insertBefore(tb.firstElementChild, main.firstChild);
      }
      activateToggles(document);
      // apply persisted theme
      let saved = "dark";
      try { saved = localStorage.getItem("cortex-theme") || "dark"; } catch (e) {}
      applyTheme(saved);
    },
    MODULES
  };
})();
