export function toHighDPI(canvas) {
  const { width, height } = canvas;
  const { devicePixelRatio = 1 } = window;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

export function toRadians(angle) {
  return angle / 180 * Math.PI;
}

export function getClientPoint(e) {
  return {
    x: (e.touches ? e.touches[0] : e).clientX,
    y: (e.touches ? e.touches[0] : e).clientY,
  };
}

export function getPointAt(view, e) {
  const bound = view.getBoundingClientRect();
  const point = getClientPoint(e);
  return {
    x: point.x - bound.left,
    y: point.y - bound.top,
  };
}
