function ID(n) {
return document.getElementById(n)
}

function wait(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}
