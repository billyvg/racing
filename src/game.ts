import * as Sentry from '@sentry/browser';
import { getCanvasManager } from '@sentry-internal/rrweb';
import GameScene from "./scenes/GameScene";

// get the speeder index from the menu page
let parameters = new URLSearchParams(window.location.search);
let speederIndex = parseInt(parameters.get("speeder"));

// set up scene
let scene = new GameScene(speederIndex);

// keep track of time
let currentTime = 0;

// loops updates
function animate(timestamp?: number) {
    let dt = timestamp - currentTime;
    currentTime = timestamp;

    scene.camera.updateProjectionMatrix();
    scene.composer.render();

    if (scene.orbitals)
        scene.orbitals.update()

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
          type: 'image/webp',
          quality: 0.1,
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
