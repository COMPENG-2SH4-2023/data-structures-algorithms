class Vertex {
    constructor (vertex, weight) {
        this.node = vertex;
        this.weight = weight;
    }
}

class Node {
    constructor (val, priority) {
        this.val = val;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor () {
        this.values = [];
    }

    enqueue (val, priority) {
        const node = new Node(val, priority);
        this.values.push(node);
        this.bubbleUp();
    }

    dequeue () {
        const min = this.values[0];
        const end = this.values.pop();

        if (this.values.length > 0) {
            this.values[0] = end;
            this.bubbleDown(0);
        }

        return min;
    }

    bubbleUp () {
        let idx = this.values.length - 1;

        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);

            if (this.values[idx].priority >= this.values[parentIdx].priority) {
                break;
            }

            const tmp = this.values[parentIdx];
            this.values[parentIdx] = this.values[idx];
            this.values[idx] = tmp;

            idx = parentIdx;
        }
    }

    // Recursive
    bubbleDown (index) {
        const length = this.values.length;
        let largest = index;

        const left = 2 * index + 1;
        const right = 2 * index + 2;

        // if left child is greater than parent
        if (left <= length && this.values[left]) {
            if (this.values[left].priority < this.values[largest].priority) {
                largest = left;
            }
        }

        // if right child is greater than parent
        if (right <= length && this.values[right]) {
            if (this.values[right].priority < this.values[largest].priority) {
                largest = right;
            }
        }

        // swap
        if (largest !== index) {
            [this.values[largest], this.values[index]] = [this.values[index], this.values[largest]];
            this.bubbleDown(largest);
        }
    }

    // Iterative
    bubbleDownIterative () {
        let idx = 0;
        const length = this.values.length;
        const element = this.values[0];
        while (true) {
            const leftChildIdx = 2 * idx + 1;
            const rightChildIdx = 2 * idx + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIdx < length) {
                leftChild = this.values[leftChildIdx];
                if (leftChild.priority > element.priority) {
                    swap = leftChildIdx;
                }
            }
            if (rightChildIdx < length) {
                rightChild = this.values[rightChildIdx];
                if (
                    (swap === null && rightChild.priority > element.priority) ||
                    (swap !== null && rightChild.priority > leftChild.priority)
                ) {
                    swap = rightChildIdx;
                }
            }
            if (swap === null) break;
            this.values[idx] = this.values[swap];
            this.values[swap] = element;
            idx = swap;
        }
    }
}

class WeightedGraph {
    constructor () {
        this.adjacencyList = {};
    }

    addVertex (vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    addEdge (vertex1, vertex2, weight) {
        this.adjacencyList[vertex1].push(new Vertex(vertex2, weight));
        this.adjacencyList[vertex2].push(new Vertex(vertex1, weight));
    }

    Dijkstra (start, finish) {
        const nodes = new PriorityQueue();
        const distances = {};
        const previous = {};
        const path = []; // to return at end
        let smallest;
        // build up initial state
        for (const vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = null;
        }
        // as long as there is something to visit
        while (nodes.values.length) {
            smallest = nodes.dequeue().val;
            if (smallest === finish) {
                // WE ARE DONE
                // BUILD UP PATH TO RETURN AT END
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }
            if (smallest || distances[smallest] !== Infinity) {
                for (const neighbor in this.adjacencyList[smallest]) {
                    // find neighboring node
                    const nextNode = this.adjacencyList[smallest][neighbor];
                    // calculate new distance to neighboring node
                    const candidate = distances[smallest] + nextNode.weight;
                    const nextNeighbor = nextNode.node;
                    if (candidate < distances[nextNeighbor]) {
                        // updating new smallest distance to neighbor
                        distances[nextNeighbor] = candidate;
                        // updating previous - How we got to neighbor
                        previous[nextNeighbor] = smallest;
                        // enqueue in priority queue with new priority
                        nodes.enqueue(nextNeighbor, candidate);
                    }
                }
            }
        }
        return path.concat(smallest).reverse();
    }
}

const graph = new WeightedGraph();

graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D');
graph.addVertex('E');
graph.addVertex('F');

graph.addEdge('A', 'B', 4);
graph.addEdge('A', 'C', 2);
graph.addEdge('B', 'E', 3);
graph.addEdge('C', 'D', 2);
graph.addEdge('C', 'F', 4);
graph.addEdge('D', 'E', 3);
graph.addEdge('D', 'F', 1);
graph.addEdge('E', 'F', 1);

console.log(graph.Dijkstra('A', 'E'));