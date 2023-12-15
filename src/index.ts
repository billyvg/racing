import * as Sentry from '@sentry/browser';
import { getCanvasManager } from '@sentry-internal/rrweb';
import MenuScene from "./scenes/MenuScene";

// set up scene
let scene = new MenuScene();

// keep track of time
let currentTime = 0;

// loops updates
function animate(timestamp?: number) {
    let dt = timestamp - currentTime;
    currentTime = timestamp;

    scene.camera.updateProjectionMatrix();
    scene.composer.render();

    scene.update(dt);

    requestAnimationFrame(animate);
}

// runs a continuous animation loop
animate()


Sentry.init({
  // this assumes your build process replaces `process.env.npm_package_version` with a value
  integrations: [
    // If you use a bundle with performance monitoring enabled, add the BrowserTracing integration
    new Sentry.BrowserTracing(),
    // If you use a bundle with session replay enabled, add the SessionReplay integration
    new Sentry.Replay({
      useCompression: true,
      _experiments: {
        canvas: {
          fps: 1,
          quality: 0.2,
          manager: getCanvasManager,
        }
      }
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.0,
  replaysSessionSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
});
