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
