import * as THREE from 'three';
import ExpoTHREE from 'expo-three';

import GLMainScreen from './GLMainScreen';
import GLWrap from './GLWrap';

export default {
  GLMainScreen: { screen: GLMainScreen },

  ClearToBlue: {
    screen: GLWrap('Clear to blue', gl => {
      gl.clearColor(0, 0, 1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.endFrameEXP();
    }),
  },

  BasicTexture: {
    screen: GLWrap('Basic texture use', async gl => {
      const vert = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(
        vert,
        `
precision highp float;
attribute vec2 position;
varying vec2 uv;
void main () {
  uv = position;
  gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
}`
      );
      gl.compileShader(vert);
      const frag = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(
        frag,
        `
precision highp float;
uniform sampler2D texture;
varying vec2 uv;
void main () {
  gl_FragColor = texture2D(texture, vec2(uv.x, uv.y));
}`
      );
      gl.compileShader(frag);

      const program = gl.createProgram();
      gl.attachShader(program, vert);
      gl.attachShader(program, frag);
      gl.linkProgram(program);
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      const verts = new Float32Array([-2, 0, 0, -2, 2, 2]);
      gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
      const positionAttrib = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(positionAttrib);
      gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

      const textureAsset = Expo.Asset.fromModule(require('../../assets/images/nikki.png'));
      await textureAsset.downloadAsync();
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        128,
        128,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textureAsset
      );
      gl.uniform1i(gl.getUniformLocation(program, 'texture'), 0);

      const animate = () => {
        gl.clearColor(0, 0, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);
        gl.endFrameEXP();
      };
      animate();
    }),
  },

  THREEBasic: {
    screen: GLWrap('Basic three.js use', async gl => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );

      const renderer = ExpoTHREE.createRenderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor(0xffffff);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({
        map: await ExpoTHREE.createTextureAsync({
          asset: Expo.Asset.fromModule(require('../../assets/images/nikki.png')),
        }),
      });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      camera.position.z = 3;

      const animate = () => {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.04;
        cube.rotation.y += 0.07;

        renderer.render(scene, camera);

        gl.endFrameEXP();
      };
      animate();
    }),
  },
};
