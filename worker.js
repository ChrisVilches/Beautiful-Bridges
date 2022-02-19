console.log("hello, I'm a service")

self.onmessage = function (e) {
  console.log("received")
  for (let i = 0; i < 10; i++) {

  }

  console.log("finished")
  self.postMessage(e.data.num + 1)
}
