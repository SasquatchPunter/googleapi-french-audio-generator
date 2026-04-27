const { chunkTasks, processTaskQueue, delay } = require("../batch.js");

describe("chunkRequests()", () => {
  test("dequeues Promises", () => {
    const task = () => new Promise(() => {});
    const queue = [task, task, task];
    chunkTasks(queue, 2);
    expect(queue).toHaveLength(1);
    chunkTasks(queue, 1);
    expect(queue).toHaveLength(0);
  });

  test("returns empty batch when empty queue passed", () => {
    expect(chunkTasks([], 1)).toHaveLength(0);
  });

  test("batches remainder when concurrent limit is more than pool.length", () => {
    const task = () => new Promise(() => {});
    const queue = [task, task, task];
    expect(chunkTasks(queue, 2)).toHaveLength(2);
    expect(chunkTasks(queue, 2)).toHaveLength(1);
    expect(chunkTasks(queue, 2)).toHaveLength(0);
  });
});

describe("processTaskQueue()", () => {
  const resolveTask = () =>
    new Promise((resolve) => {
      resolve(true);
    });
  const rejectTask = () =>
    new Promise((_, reject) => {
      reject(true);
    });

  test("drains a queue fully", async () => {
    const queue = [resolveTask, resolveTask, resolveTask];
    const rejected = await processTaskQueue(queue, 1, 500);
    expect(queue).toHaveLength(0);
    expect(rejected).toHaveLength(0);
  });

  test("rejected tasks are returned", async () => {
    const queue = [resolveTask, rejectTask, resolveTask];
    const rejected = await processTaskQueue(queue, 1, 500);
    expect(rejected).toHaveLength(1);
  });
});

describe("delay()", () => {
  test("awaits ", async () => {
    const d = 100;
    let time = Date.now();
    const res = await delay(d).then(() => Date.now() - time);
    expect(res).toBeGreaterThanOrEqual(d);
  });
});
