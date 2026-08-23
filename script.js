// Terminal-style typewriter description on project hover.
document.querySelectorAll('.project').forEach(function (project) {
  var desc = project.querySelector('.project__desc');
  if (!desc) return;

  var fullText = desc.getAttribute('data-text') || '';

  var typed = document.createElement('span');
  typed.className = 'typed';
  var caret = document.createElement('span');
  caret.className = 'caret';
  desc.appendChild(typed);
  desc.appendChild(caret);

  var timer = null;
  var token = 0;              // bumps on every start/stop to cancel stale loops
  var SPEED = 16;             // ms per character
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function startTyping() {
    var mine = ++token;
    caret.classList.remove('done');
    desc.classList.add('is-visible');

    if (reduceMotion.matches) {              // no typing animation: show it all at once
      typed.textContent = fullText;
      caret.classList.add('done');
      return;
    }

    typed.textContent = '';
    var i = 0;
    (function step() {
      if (mine !== token) return;            // a newer hover/leave cancelled us
      if (i <= fullText.length) {
        typed.textContent = fullText.slice(0, i);
        i++;
        timer = setTimeout(step, SPEED);
      } else {
        caret.classList.add('done');         // finished -> pulse at the end
      }
    })();
  }

  function stopTyping() {
    token++;                                 // cancel any running loop
    if (timer) clearTimeout(timer);
    typed.textContent = '';
    caret.classList.remove('done');
    desc.classList.remove('is-visible');
  }

  project.addEventListener('mouseenter', startTyping);
  project.addEventListener('mouseleave', stopTyping);
  // keyboard support: typing also runs while the project link has focus
  project.addEventListener('focusin', startTyping);
  project.addEventListener('focusout', stopTyping);
});
