const onIdle = (delay = 0) =>
  new Promise((r) =>
    setTimeout(async () => {
      r();
    }, delay)
  );

export default {
  onIdle,
};
