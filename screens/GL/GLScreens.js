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
};
