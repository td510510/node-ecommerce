'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const SECONDS = 5000;

const countConnect = async () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
  return numConnection;
};

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numCores * 5;

    console.log(`Number of connections: ${numConnection}`);
    console.log(`Number of cores: ${numCores}`);
    console.log(`Memory usage: ${(memoryUsage / (1024 * 1024)).toFixed(2)} MB`);

    if (numConnection > maxConnections) {
      console.log(
        `Warning: Number of connections (${numConnection}) exceeds the limit (${maxConnections})`
      );
    }
    if (memoryUsage > 100 * 1024 * 1024) {
      console.log(
        `Warning: Memory usage (${(memoryUsage / (1024 * 1024)).toFixed(
          2
        )} MB) exceeds the limit (100 MB)`
      );
    }
    if (memoryUsage > 200 * 1024 * 1024) {
      console.log(
        `Warning: Memory usage (${(memoryUsage / (1024 * 1024)).toFixed(
          2
        )} MB) exceeds the limit (200 MB)`
      );
    }
  }, SECONDS);
};

module.exports = { countConnect, checkOverload };
