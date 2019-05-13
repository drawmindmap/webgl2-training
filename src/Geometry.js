// https://github.com/pissang/geometry-extrude
// https://github.com/dmnsgn/primitive-geometry
// https://github.com/deathcap/box-geometry
// https://github.com/vorg/primitive-capsule
// https://github.com/vorg/primitive-cube
// https://github.com/vorg/primitive-sphere
// https://github.com/vorg/primitive-rounded-cube

function toGeometry(geometryData) {
  return {
    indices: new Uint16Array(geometryData.indices),
    attributes: [
      {
        data: new Float32Array(geometryData.vertices),
        index: 0,
        size: 3,
      },
      {
        data: new Float32Array(geometryData.textures),
        index: 1,
        size: 2,
      },
      {
        data: new Float32Array(geometryData.normals),
        index: 2,
        size: 3,
      },
    ],
  };
}

// https://github.com/nickdesaulniers/prims
// http://learningwebgl.com/blog/?p=1253
export function createSphere() {
  const vertices = [];
  const textures = [];
  const normals = [];
  const indices = [];

  const latitudeBands = 30;
  const longitudeBands = 30;
  const radius = 1.0;

  for (let latNumber = 0; latNumber <= latitudeBands; latNumber += 1) {
    const theta = latNumber * Math.PI / latitudeBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let longNumber = 0; longNumber <= longitudeBands; longNumber += 1) {
      const phi = longNumber * 2 * Math.PI / longitudeBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;
      const u = 1 - longNumber / longitudeBands;
      const v = 1 - latNumber / latitudeBands;

      normals.push(x, y, z);
      textures.push(u, v);
      vertices.push(radius * x, radius * y, radius * z);
    }
  }

  for (let latNumber = 0; latNumber < latitudeBands; latNumber += 1) {
    for (let longNumber = 0; longNumber < longitudeBands; longNumber += 1) {
      const first = latNumber * (longitudeBands + 1) + longNumber;
      const second = first + longitudeBands + 1;
      indices.push(second, first, first + 1, second + 1, second, first + 1);
    }
  }

  return toGeometry({
    vertices,
    textures,
    normals,
    indices,
  });
}

export function createCube() {
  const vertices = [
    // x,    y,    z
    // front face (z: +1)
    1.0, 1.0, 1.0, // top right
    -1.0, 1.0, 1.0, // top left
    -1.0, -1.0, 1.0, // bottom left
    1.0, -1.0, 1.0, // bottom right
    // right face (x: +1)
    1.0, 1.0, -1.0, // top right
    1.0, 1.0, 1.0, // top left
    1.0, -1.0, 1.0, // bottom left
    1.0, -1.0, -1.0, // bottom right
    // top face (y: +1)
    1.0, 1.0, -1.0, // top right
    -1.0, 1.0, -1.0, // top left
    -1.0, 1.0, 1.0, // bottom left
    1.0, 1.0, 1.0, // bottom right
    // left face (x: -1)
    -1.0, 1.0, 1.0, // top right
    -1.0, 1.0, -1.0, // top left
    -1.0, -1.0, -1.0, // bottom left
    -1.0, -1.0, 1.0, // bottom right
    // bottom face (y: -1)
    1.0, -1.0, 1.0, // top right
    -1.0, -1.0, 1.0, // top left
    -1.0, -1.0, -1.0, // bottom left
    1.0, -1.0, -1.0, // bottom right
    // back face (z: -1)
    -1.0, 1.0, -1.0, // top right
    1.0, 1.0, -1.0, // top left
    1.0, -1.0, -1.0, // bottom left
    -1.0, -1.0, -1.0, // bottom right
  ];

  const normals = [
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,

    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
  ];

  const textures = [
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23,
  ];

  return toGeometry({
    vertices,
    textures,
    normals,
    indices,
  });
}
