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
  if (geometry.length) {
    geometry.forEach((geometryData, i) => {
      const buffer = createBuffer(gl, gl.ARRAY_BUFFER, geometryData.data);
      bindDataBuffer(
        gl,
        buffer,
        geometryData.index || i,
        geometryData.size,
        geometryData.type,
        geometryData.stride,
        geometryData.offset,
      );
    });
  } else {
    const buffer = createBuffer(gl, gl.ARRAY_BUFFER, geometry.data);
    geometry.attributes.forEach((attribute, i) => {
      bindDataBuffer(
        gl,
        buffer,
        attribute.index || i,
        attribute.size,
        geometry.type,
        geometry.stride,
        attribute.offset,
      );
    });
    geometry.count = geometry.data.byteLength / geometry.stride;
  }
  gl.bindVertexArray(null);
  return vao;
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

async function createTexture(gl, url) {
  const image = await loadImage(url);
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    image.width,
    image.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    image,
  );
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

export { bindDataBuffer, createBuffer, createProgram, createTexture, createVertexArray, getClientPoint, getPointAt, loadImage, loadImageBitmap, loadShader, toHighDPI, toRadians };
