import GLMainScreen from './GLMainScreen';
import GLWrap from './GLWrap';

const THREE = require('three');
global.THREE = THREE;
require('three/examples/js/shaders/CopyShader');
require('three/examples/js/shaders/DigitalGlitch');
require('three/examples/js/shaders/FilmShader');
require('three/examples/js/postprocessing/EffectComposer');
require('three/examples/js/postprocessing/RenderPass');
require('three/examples/js/postprocessing/ShaderPass');
require('three/examples/js/postprocessing/GlitchPass');
require('three/examples/js/postprocessing/FilmPass');
import ExpoTHREE from 'expo-three';

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
        transparent: true,
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

  THREEGlitchFilm: {
    screen: GLWrap('three.js glitch and film effects', async gl => {
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

      const composer = new THREE.EffectComposer(renderer);
      composer.addPass(new THREE.RenderPass(scene, camera));
      composer.addPass(new THREE.FilmPass(0.8, 0.325, 256, false));
      const finalPass = new THREE.GlitchPass();
      finalPass.renderToScreen = true;
      composer.addPass(finalPass);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        map: await ExpoTHREE.createTextureAsync({
          asset: Expo.Asset.fromModule(require('../../assets/images/nikki.png')),
        }),
      });

      const cubes = Array(24)
        .fill()
        .map(() => {
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);
          mesh.position.x = 3 - 6 * Math.random();
          mesh.position.y = 3 - 6 * Math.random();
          mesh.position.z = -5 * Math.random();
          const angularVelocity = {
            x: 0.1 * Math.random(),
            y: 0.1 * Math.random(),
          };
          return { mesh, angularVelocity };
        });

      camera.position.z = 3;

      const animate = () => {
        requestAnimationFrame(animate);

        cubes.forEach(({ mesh, angularVelocity }) => {
          mesh.rotation.x += angularVelocity.x;
          mesh.rotation.y += angularVelocity.y;
        });

        composer.render();

        gl.endFrameEXP();
      };
      animate();
    }),
  },

  THREESprite: {
    screen: GLWrap('three.js sprite rendering', async gl => {
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

      const spriteMaterial = new THREE.SpriteMaterial({
        map: await ExpoTHREE.createTextureAsync({
          asset: Expo.Asset.fromModule(require('../../assets/images/nikki.png')),
        }),
        color: 0xffffff,
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      scene.add(sprite);

      camera.position.z = 3;

      const animate = () => {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);

        gl.endFrameEXP();
      };
      animate();
    }),
  },
};
