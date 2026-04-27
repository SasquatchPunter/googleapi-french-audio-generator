/**
 * Chunks HTTP requests from a queue.
 * @param {(() => Promise<any>)[]} queue
 * @param {number} length
 */
function chunkTasks(queue, length) {
  const chunk = [];
  while (length-- > 0 && queue.length > 0) {
    const task = queue.pop();
    if (task !== undefined) chunk.push(task);
  }
  return chunk;
}

/**
 * Batches and concurrently processes a queue of tasks.
 *
 * Each task is a "runner" function returning a Promise. This is to hold off executing
 * the function passed to the return Promise until the task function is ready to be run.
 *
 * Processed tasks are removed from the queue.
 * Tasks whose promises reject are returned after the queue has been fully processed.
 * @param {(() => Promise<any>)[]} queue Queue of tasks to batch and process.
 * @param {number} concurrent Number of tasks to run during every timeout window.
 * @param {number} timeoutMS Length of timeout period in milliseconds.
 * @returns {Promise<(() => Promise<any>)[]>} An array of rejected tasks.
 */

async function processTaskQueue(queue, concurrent, timeoutMS) {
  /** @type {(() => Promise<any>)[]} */
  const rejected = [];
  const loopDelayMS = 100;
  let pending = 0;
  let lastTimeout = 0;

  while (true) {
    if (queue.length == 0 && pending === 0) break;

    const now = Date.now();

    if (now - lastTimeout > timeoutMS) {
      lastTimeout = now;

      const chunk = chunkTasks(queue, concurrent).map((task) =>
        task().catch(() => {
          rejected.push(task);
        }),
      );

      pending++;

      Promise.allSettled(chunk).finally(() => {
        pending--;
      });
    }

    await delay(loopDelayMS);
  }

  return rejected;
}

/**
 * Promise that resolves after a delay. Can be used for throttling in async functions.
 * @param {number} delayMS Timeout in milliseconds.
 */
async function delay(delayMS = 0) {
  return await new Promise((resolve) => setTimeout(resolve, delayMS));
}

module.exports = {
  chunkTasks,
  processTaskQueue,
  delay,
};
