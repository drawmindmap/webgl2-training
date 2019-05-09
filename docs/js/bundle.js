function toHighDPI(canvas) {
  const { width, height } = canvas;
  const { devicePixelRatio = 1 } = window;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

function toRadians(angle) {
  return angle / 180 * Math.PI;
}

// https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
  });
}

// https://developers.google.com/web/ilt/pwa/working-with-the-fetch-api
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
function loadImageBitmap(src) {
  return fetch(src, {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }).then((response) => {
    if (response.ok) {
      return response.blob();
    }
    throw new Error(response.statusText);
  }).then(blob => createImageBitmap(blob));
}

function getClientPoint(e) {
  return {
    x: (e.touches ? e.touches[0] : e).clientX,
    y: (e.touches ? e.touches[0] : e).clientY,
  };
}

function getPointAt(view, e) {
  const bound = view.getBoundingClientRect();
  const point = getClientPoint(e);
  return {
    x: point.x - bound.left,
    y: point.y - bound.top,
  };
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // https://www.khronos.org/webgl/wiki/HandlingContextLost#Handling_Shaders_and_Programs
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource);
  if (!vertexShader) {
    return null;
  }

  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!fragmentShader) {
    return null;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // https://www.khronos.org/webgl/wiki/HandlingContextLost#Handling_Shaders_and_Programs
  if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

function createBuffer(gl, type, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, data, gl.STATIC_DRAW);
  gl.bindBuffer(type, null);
  return buffer;
}

function bindDataBuffer(gl, buffer, index, size, type, stride, offset) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(index);
  gl.vertexAttribPointer(index, size || 3, type || gl.FLOAT, false, stride || 0, offset || 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function createVertexArray(gl, geometry) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  Object.keys(geometry).forEach((attribute, i) => {
    const geometryData = geometry[attribute];
    const buffer = createBuffer(gl, gl.ARRAY_BUFFER, geometryData.data);
    bindDataBuffer(
      gl,
      buffer,
      i,
      geometryData.size,
      geometryData.type,
      geometryData.stride,
      geometryData.offset,
    );
  });
  gl.bindVertexArray(null);
  return vao;
}

export { bindDataBuffer, createBuffer, createProgram, createVertexArray, getClientPoint, getPointAt, loadImage, loadImageBitmap, loadShader, toHighDPI, toRadians };
