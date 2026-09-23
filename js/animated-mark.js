(function () {
  var GESTURES = ['neutral', 'happy', 'o', 'uwu', 'andi'];
  var MOUTH_PATHS = {
    neutral: 'M 70 150 Q 150 175 230 150',
    happy: 'M 60 145 Q 150 220 240 145',
    uwu: 'M 90 158 Q 120 180 150 158 Q 180 180 210 158',
    andi: 'M 60 145 Q 150 220 240 145',
  };

  var btn = document.getElementById('animated-mark');
  if (!btn) return;

  var svg = document.getElementById('mark-svg');
  var eyesGroup = document.getElementById('mark-eyes');
  var eyeRings = document.getElementById('eye-rings');
  var eyeLeft = document.getElementById('eye-left');
  var eyeRight = document.getElementById('eye-right');
  var eyesAndi = document.getElementById('eyes-andi');
  var pupilLeft = document.getElementById('pupil-left');
  var pupilRight = document.getElementById('pupil-right');
  var mouthPath = document.getElementById('mark-mouth');
  var mouthO = document.getElementById('mark-mouth-o');

  var gestureIndex = 0;
  var tracking = false;
  var mouse = { x: 150, y: 80 };

  function angleTo(cx, cy, mx, my) {
    return (Math.atan2(my - cy, mx - cx) * 180) / Math.PI;
  }

  function updateRotation() {
    var isRing = GESTURES[gestureIndex] !== 'andi';
    var leftRot = isRing && tracking ? angleTo(95, 80, mouse.x, mouse.y) + 45 : 55;
    var rightRot = isRing && tracking ? angleTo(205, 80, mouse.x, mouse.y) + 45 : 55;
    eyeLeft.style.transform = 'rotate(' + leftRot + 'deg)';
    eyeRight.style.transform = 'rotate(' + rightRot + 'deg)';
  }

  function render() {
    var gesture = GESTURES[gestureIndex];
    var isAndi = gesture === 'andi';

    eyeRings.hidden = isAndi;
    eyesAndi.hidden = !isAndi;

    var pupilColor = gesture === 'happy' || gesture === 'uwu' ? 'var(--accent-lima)' : 'var(--accent-lila)';
    pupilLeft.style.fill = pupilColor;
    pupilRight.style.fill = pupilColor;

    if (gesture === 'o') {
      mouthPath.hidden = true;
      mouthO.hidden = false;
    } else {
      mouthO.hidden = true;
      mouthPath.hidden = false;
      mouthPath.setAttribute('d', MOUTH_PATHS[gesture]);
    }

    updateRotation();
  }

  function handleClick() {
    eyesGroup.classList.add('blink');
    setTimeout(function () {
      eyesGroup.classList.remove('blink');
      gestureIndex = (gestureIndex + 1) % GESTURES.length;
      render();
    }, 200);
  }

  function handleMouseMove(e) {
    var rect = svg.getBoundingClientRect();
    var scaleX = 300 / rect.width;
    var scaleY = 230 / rect.height;
    tracking = true;
    mouse = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
    updateRotation();
  }

  function handleMouseLeave() {
    tracking = false;
    updateRotation();
  }

  btn.addEventListener('click', handleClick);
  svg.addEventListener('mousemove', handleMouseMove);
  svg.addEventListener('mouseleave', handleMouseLeave);

  render();
})();
