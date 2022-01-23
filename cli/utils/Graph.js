// Ziyovuddin Shamsiddini's Directed Graph Implementation
// taken from https://medium.com/@ziyoshams/graphs-in-javascript-cc0ed170b156
/* eslint-disable no-restricted-syntax */

class Graph {
  constructor() {
    this.AdjList = new Map();
  }

  addVertex(vertex) {
    if (!this.AdjList.has(vertex)) {
      this.AdjList.set(vertex, []);
    }
  }

  addEdge(vertex, node) {
    if (this.AdjList.has(vertex)) {
      if (this.AdjList.has(node)) {
        const arr = this.AdjList.get(vertex);
        if (!arr.includes(node)) {
          arr.push(node);
        }
      } else {
        throw new Error(`Can't add non-existing vertex ->'${node}'`);
      }
    } else {
      throw new Error(`You should add '${vertex}' first`);
    }
  }

  nodes() {
    const nodes = [];
    for (const [key] of this.AdjList) {
      nodes.push(key);
    }
    return nodes;
  }

  serialize() {
    const result = {
      nodes: [],
      links: [],
    };
    for (const [key, value] of this.AdjList) {
      result.nodes.push(key);
      value.forEach((edge) => {
        result.links.push({ source: key, target: edge });
      });
    }
    return result;
  }

  deserialize(serializedGraph) {
    serializedGraph.nodes.forEach((n) => {
      this.addVertex(n);
    });

    serializedGraph.links.forEach((e) => {
      this.addEdge(e.source, e.target);
    });
  }

  createVisitedObject() {
    const arr = {};
    for (const key of this.AdjList.keys()) {
      arr[key] = false;
    }

    return arr;
  }

  doesPathExist(firstNode, secondNode) {
    // https://stackoverflow.com/a/50575971
    const pathQueue = [];
    const visited = this.createVisitedObject();
    const q = [];
    visited[firstNode] = true;
    q.push(firstNode);
    pathQueue.push([firstNode]);
    while (q.length) {
      const node = q.shift();
      const path = pathQueue.shift();
      visited[node] = true;

      const elements = this.AdjList.get(node);
      if (elements.includes(secondNode)) {
        return { path: [...path, secondNode], pathExists: true };
      }
      for (const elem of elements) {
        if (!visited[elem]) {
          pathQueue.push([...path, elem]);
          q.push(elem);
          visited[elem] = true;
        }
      }
    }
    return { path: [], pathExists: false };
  }

  getIndegree(node) {
    const indegrees = Array.from(this.AdjList.entries()).reduce((acc, curr) => {
      curr[1].forEach((table) => {
        if (acc[table]) {
          acc[table] = acc[table] + 1;
        } else {
          acc[table] = 1;
        }
      });

      return acc;
    }, {});

    return indegrees[node] || 0;
  }
}

module.exports = Graph;
