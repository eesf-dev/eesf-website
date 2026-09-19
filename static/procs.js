// Decorative "hub and people" animation in the hero card. Purely visual;
// fails silently if canvas isn't available.
(function () {
  try {
    var canvas = document.getElementById('procs');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function accentColor() {
      var style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--accent').trim() || '#e8592f';
    }
    function textColor() {
      var style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--text-faint').trim() || '#9c9284';
    }

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, hub, people;

    function layout() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hub = { x: w * 0.22, y: h * 0.5 };
      people = [];
      var n = 5;
      for (var i = 0; i < n; i++) {
        var t = i / (n - 1);
        people.push({ x: w * 0.74, y: h * (0.14 + t * 0.72), phase: Math.random() * Math.PI * 2 });
      }
    }
    layout();
    window.addEventListener('resize', layout);

    var msgs = [];
    function spawnMsg() {
      var target = people[Math.floor(Math.random() * people.length)];
      msgs.push({ x: hub.x, y: hub.y, tx: target.x, ty: target.y, t: 0 });
    }
    var lastSpawn = 0;

    function draw(ts) {
      ctx.clearRect(0, 0, w, h);
      var accent = accentColor();
      var faint = textColor();

      ctx.strokeStyle = faint;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1.5;
      people.forEach(function (p) {
        ctx.beginPath();
        ctx.moveTo(hub.x, hub.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.fillStyle = faint;
      people.forEach(function (p) {
        var pulse = reduced ? 0 : Math.sin((ts || 0) / 650 + p.phase) * 0.15 + 0.85;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5.5 * pulse, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (!reduced) {
        msgs.forEach(function (m) {
          m.t += 0.017;
          var x = m.x + (m.tx - m.x) * m.t;
          var y = m.y + (m.ty - m.y) * m.t;
          ctx.fillStyle = accent;
          ctx.globalAlpha = Math.max(0, 1 - m.t);
          ctx.beginPath();
          ctx.arc(x, y, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        });
        msgs = msgs.filter(function (m) { return m.t < 1; });
        if (!lastSpawn || ts - lastSpawn > 600) { spawnMsg(); lastSpawn = ts; }
        requestAnimationFrame(draw);
      }
    }

    if (reduced) {
      draw(0);
    } else {
      requestAnimationFrame(draw);
    }
  } catch (e) { /* decorative only */ }
})();
