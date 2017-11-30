import { Dimensions } from 'react-native';

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

import ProcessingWrap from './ProcessingWrap';

import './BeforePIXI';
import * as PIXI from 'pixi.js';

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

      return {
        onTick() {
          gl.clearColor(0, 0, 1, 1);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);
          gl.endFrameEXP();
        },
      };
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

      return {
        onTick() {
          cube.rotation.x += 0.04;
          cube.rotation.y += 0.07;

          renderer.render(scene, camera);

          gl.endFrameEXP();
        },
      };
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

      return {
        onTick() {
          cubes.forEach(({ mesh, angularVelocity }) => {
            mesh.rotation.x += angularVelocity.x;
            mesh.rotation.y += angularVelocity.y;
          });

          composer.render();

          gl.endFrameEXP();
        },
      };
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

      return {
        onTick() {
          renderer.render(scene, camera);
          gl.endFrameEXP();
        },
      };
    }),
  },

  ProcessingInAndOut: {
    screen: ProcessingWrap(`'In and out' from openprocessing.org`, p => {
      p.setup = () => {
        p.strokeWeight(7);
      };

      const harom = (ax, ay, bx, by, level, ratio) => {
        if (level <= 0) {
          return;
        }

        const vx = bx - ax;
        const vy = by - ay;
        const nx = p.cos(p.PI / 3) * vx - p.sin(p.PI / 3) * vy;
        const ny = p.sin(p.PI / 3) * vx + p.cos(p.PI / 3) * vy;
        const cx = ax + nx;
        const cy = ay + ny;
        p.line(ax, ay, bx, by);
        p.line(ax, ay, cx, cy);
        p.line(cx, cy, bx, by);

        harom(
          ax * ratio + cx * (1 - ratio),
          ay * ratio + cy * (1 - ratio),
          ax * (1 - ratio) + bx * ratio,
          ay * (1 - ratio) + by * ratio,
          level - 1,
          ratio
        );
      };

      p.draw = () => {
        p.background(240);
        harom(
          p.width - 142,
          p.height - 142,
          142,
          p.height - 142,
          6,
          (p.sin((0.0005 * Date.now()) % (2 * p.PI)) + 1) / 2
        );
      };
    }),
  },

  ProcessingNoClear: {
    screen: ProcessingWrap('Draw without clearing screen with processing.js', p => {
      let t = 0;

      p.setup = () => {
        p.background(0);
        p.noStroke();
      };

      p.draw = () => {
        t += 12;
        p.translate(p.width * 0.5, p.height * 0.5);
        p.fill(
          128 * (1 + p.sin(0.004 * t)),
          128 * (1 + p.sin(0.005 * t)),
          128 * (1 + p.sin(0.007 * t))
        );
        p.ellipse(
          0.25 * p.width * p.cos(0.002 * t),
          0.25 * p.height * p.sin(0.002 * t),
          0.1 * p.width * (1 + p.sin(0.003 * t)),
          0.1 * p.width * (1 + p.sin(0.003 * t))
        );
      };
    }),
  },

  PIXIBasic: {
    screen: GLWrap('Basic pixi.js use', async gl => {
      const { scale: resolution } = Dimensions.get('window');
      const width = gl.drawingBufferWidth / resolution;
      const height = gl.drawingBufferHeight / resolution;
      const app = new PIXI.Application({
        context: gl,
        width,
        height,
        resolution,
        backgroundColor: 0xffffff,
      });
      app.ticker.add(() => gl.endFrameEXP());

      const graphics = new PIXI.Graphics();
      graphics.lineStyle(0);
      graphics.beginFill(0x00ff00);
      graphics.drawCircle(width / 2, height / 2, 50);
      graphics.endFill();
      app.stage.addChild(graphics);
    }),
  },

  PIXISprite: {
    screen: GLWrap('pixi.js sprite rendering', async gl => {
      const { scale: resolution } = Dimensions.get('window');
      const width = gl.drawingBufferWidth / resolution;
      const height = gl.drawingBufferHeight / resolution;
      const app = new PIXI.Application({
        context: gl,
        width,
        height,
        resolution,
        backgroundColor: 0xffffff,
      });
      app.ticker.add(() => gl.endFrameEXP());

      const asset = Expo.Asset.fromModule(require('../../assets/images/nikki.png'));
      await asset.downloadAsync();
      const image = new HTMLImageElement(asset);
      const sprite = PIXI.Sprite.from(image);
      app.stage.addChild(sprite);
    }),
  },
};
