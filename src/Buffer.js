export function createBuffer(gl, type, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, data, gl.STATIC_DRAW);
  gl.bindBuffer(type, null);
  return buffer;
}

export function bindDataBuffer(gl, buffer, index, size, type, stride, offset) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(index);
  gl.vertexAttribPointer(index, size || 3, type || gl.FLOAT, false, stride || 0, offset || 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

export function createVertexArray(gl, geometry) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  if (geometry.stride) {
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
  } else {
    if (geometry.indices) {
      const indexBuffer = createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, geometry.indices);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      geometry.count = geometry.indices.length;
    }
    geometry.attributes.forEach((geometryData, i) => {
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
      if ((geometryData.index || i) === 0 && !geometry.count) {
        geometry.count = geometryData.data.length;
      }
    });
  }
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  return vao;
}
