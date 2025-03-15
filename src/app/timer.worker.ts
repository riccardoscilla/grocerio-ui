/// <reference lib="webworker" />

let intervalId: any;
let remainingTime = 0

self.onmessage = (event) => {
  const { command, startTime } = event.data;

  if (command === 'start') {
    remainingTime = startTime;
    intervalId = setInterval(() => {
      remainingTime -= 1000;
      self.postMessage(remainingTime);

      if (remainingTime <= 0) {
        console.log("Timer Done!")
        clearInterval(intervalId);
        self.postMessage(5000);
        self.postMessage('done');
      }
    }, 1000);
  } 
  else if (command === 'pause') {
    clearInterval(intervalId);
  } 
  else if (command === 'reset') {
    clearInterval(intervalId);
    self.postMessage(5000);
  }
};
