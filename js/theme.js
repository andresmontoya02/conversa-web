(function () {
  var STORAGE_KEY = 'conversa-theme';
  var root = document.documentElement;
  var saved = localStorage.getItem(STORAGE_KEY);
  var initial = saved || 'light'; // default: claro
  root.setAttribute('data-theme', initial);

  document.getElementById('theme-toggle').addEventListener('click', function () {
    var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  });
})();
