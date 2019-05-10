// https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
export function loadImage(src) {
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
export function loadImageBitmap(src) {
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

export async function createTexture(gl, url) {
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
