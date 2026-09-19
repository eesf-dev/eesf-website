// Theme toggle: explicit override of the system preference, intentionally
// not persisted (resets on reload) so it's just a quick way to preview
// both themes while editing.
(function () {
  try {
    var root = document.documentElement;
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var current = mq.matches ? 'dark' : 'light';

    toggle.addEventListener('click', function () {
      current = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', current);
    });
  } catch (e) { /* toggle is a convenience, fine if it no-ops */ }
})();
