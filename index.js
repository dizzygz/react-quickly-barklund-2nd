// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>JS Starter</h1>`;
function* range(from, to) {
  for (let i = from; i <= to; i++) {
    yield i;
  }
}
function countGoodPasswords(passwords) {
  return passwords.filter((p) => p.length >= 9).length;
}
function factorial(n) {
  if (n === 1) return 1;
  if (n === 0) debugger;
  return n * factorial(n - 1);
}
for (let i of range(1, 8)) {
  console.log(i);
}
try {
  // Ask the user to enter a number
  //let n = Number(prompt("Please enter a positive integer", ""));
  let passwrds = ['123', '123456789', 'abc', 'abdfcfhgtyfh'];
  // Compute the factorial of the number, assuming the input is valid
  //let f = factorial(n);
  // Display the result
  //alert(n + "! = " + f);
  alert('good pass=' + countGoodPasswords(passwrds));
} catch (ex) {
  // If the user's input was not valid, we end up here
  alert(ex); // Tell the user what the error is
}
let o2 = Object.create(Object.prototype);
console.log(o2.toString());

class AsyncQueue {
  constructor() {
    // Values that have been queued but not dequeued yet are stored here
    this.values = [];
    // When Promises are dequeued before their corresponding values are
    // queued, the resolve methods for those Promises are stored here.
    this.resolvers = [];
    // Once closed, no more values can be enqueued, and no more unfulfilled
    // Promises returned.
    this.closed = false;
  }

  enqueue(value) {
    if (this.closed) {
      throw new Error('AsyncQueue closed');
    }
    if (this.resolvers.length > 0) {
      // If this value has already been promised, resolve that Promise
      const resolve = this.resolvers.shift();
      resolve(value);
    } else {
      // Otherwise, queue it up
      this.values.push(value);
    }
  }

  dequeue() {
    if (this.values.length > 0) {
      // If there is a queued value, return a resolved Promise for it
      const value = this.values.shift();
      return Promise.resolve(value);
    } else if (this.closed) {
      // If no queued values and we're closed, return a resolved
      // Promise for the "end-of-stream" marker
      return Promise.resolve(AsyncQueue.EOS);
    } else {
      // Otherwise, return an unresolved Promise,
      // queuing the resolver function for later use
      return new Promise((resolve) => {
        this.resolvers.push(resolve);
      });
    }
  }

  close() {
    // Once the queue is closed, no more values will be enqueued.
    // So resolve any pending Promises with the end-of-stream marker
    while (this.resolvers.length > 0) {
      this.resolvers.shift()(AsyncQueue.EOS);
    }
    this.closed = true;
  }

  // Define the method that makes this class asynchronously iterable
  [Symbol.asyncIterator]() {
    return this;
  }

  // Define the method that makes this an asynchronous iterator. The
  // dequeue() Promise resolves to a value or the EOS sentinel if we're
  // closed. Here, we need to return a Promise that resolves to an
  // iterator result object.
  next() {
    return this.dequeue().then((value) =>
      value === AsyncQueue.EOS
        ? { value: undefined, done: true }
        : { value: value, done: false }
    );
  }
}

// A sentinel value returned by dequeue() to mark "end of stream" when closed
AsyncQueue.EOS = Symbol('end-of-stream');
//Push events of the specified type on the specified document element
// onto an AsyncQueue object, and return the queue for use as an event stream
function eventStream(elt, type) {
  const q = new AsyncQueue(); // Create a queue
  console.log('eventStream...');
  elt.addEventListener(type, (e) => q.enqueue(e)); // Enqueue events
  return q;
}
document.addEventListener('keypress', handleKeys);
let q = eventStream(document, 'keypress');
async function handleKeys() {
  // Get a stream of keypress events and loop once for each one
  //console.log('key press...s');

  for await (const event of q) {
    console.log(event.key);
  }
}

//handleKeys();
