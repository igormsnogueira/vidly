import * as Sentry from "@sentry/browser";

function init() {
  Sentry.init({
    dsn: "https://9550e4bc95484f6ba2f460d27c6eb3d7@sentry.io/1358962"
  });
}
function log(error) {
  Sentry.captureException(error);
}
export default { init, log };
