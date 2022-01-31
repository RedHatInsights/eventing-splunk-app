export function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export const promisify = (fn) => {
  console.log("promisify: Don't use this in production! Use a proper promisify library instead.");

  // return a new promisified function
  return (...args) => {
    return new Promise((resolve, reject) => {
      // create a callback that resolves and rejects
      const callback = (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback)

      // pass the callback into the function
      fn.call(this, ...args);
    })
  }
}
