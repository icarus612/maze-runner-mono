import Node from "components/node"

export default (maze) => {
    let r =  {
        maze,
        openNodes: [],
        visited: [],
        toVisit: [],
        start: null,
        end: null,
        completed: false,
        mappedMaze: [],
        possiblePaths: [],
        pathChar: false,
        
        getOpenNodes() {
            let p = this.maze.layout;
            for (let x = 0; x < p.length; x++){
                for (let y = 0; y < p[x].length; y++){
                    if (p[x][y] != this.maze.wallChar) {
                        this.openNodes.push(Node([x, y]));
                    }
                }
            }
        },

        findEndPoints() {
            const check = (nodeVal) => {
                let node = null;
                let onv = this.openNodes.map((i)=> i.value);
                if (!onv.includes(nodeVal)) {
                    node = Node(nodeVal);
                } else {
                    this.openNodes.map((i) => {
                        if (i.value == nodeVal) {
                            node = i;
                        }
                    });
                }
                return node;
            }
            for (let x = 0; x < this.maze.layout.length; x++) {
                for (let y = 0; y < this.maze.layout[x].length; y++) {
                    let p = this.maze.layout[x][y];
                    if (p == this.maze.startChar) {
                        this.start = check([x, y]);
                    } else if (p == this.maze.endChar) {
                        this.end = check([x, y]);
                    }
                }
            }
            return this;
        },

        lookAround(node) {
            this.openNodes.forEach((i) => {
                if (i.value[0] - 1 == node.value[0] && i.value[1] == node.value[1]) {
                    node.addChild(i);
                } else if (i.value[0] + 1 == node.value[0] && i.value[1] == node.value[1]) {
                    node.addChild(i);
                } else if (i.value[1] - 1 == node.value[1] && i.value[0] == node.value[0]) {
                    node.addChild(i);
                } else if (i.value[1] + 1 == node.value[1] && i.value[0] == node.value[0]) {
                    node.addChild(i);
                }
            });
        },

        makeNodePaths() { //error function stuck in forever loop
            this.toVisit.push(this.start);
            while (this.toVisit.length > 0 && this.completed === false) {
                const point = this.toVisit.shift();
                const visitedBool = point.value.length > 0 
                    ? this.visited.map((x)=> x[0] != point.value[0] || x[1] != point.value[1]).every((x)=> x === true)
                    : false;
                if (visitedBool) {
                    this.lookAround(point);
                    this.visited.push(point.value);
                    let newPath = new Set([...point.path]);
                    newPath.add(point.value);
                    point.children.map((i) => {
                        i.setPath(newPath);
                        if (i.value[0] == this.end.value[0] && i.value[1] == this.end.value[1]) {
                            this.end = i
                            this.completed = true;
                        } else {
                            this.toVisit.push(i);
                        }
                    });
                }  
            }
        },

        viewCompleted() {
            if (!this.completed) return console.log("Cannot view completed version of incomplete maze")
            console.log("Completed Maze: ")
            this.mappedMaze.map((i) => console.log(i.join("")));
        },

        buildPath(path="x") {
            if (!this.completed) return console.log("Cannot build path on incomplete maze")
            let otherOptions = ["x", "o", "+", "*", "p"];
            if (path == this.maze.startChar || path == this.maze.endChar || path == this.maze.wallChar || path == this.maze.openChar) { 
                console.log("Path character is already being used as a maze character trying something else...");
                for (let i in otherOptions) { 
                    if (i !== this.maze.startChar && i !== this.maze.endChar && i !== this.maze.wallChar && i !== this.maze.openChar) {
                        path = i;
                        console.log(`New path character: ${i}`);
                        break;             
                    } 
                }
            }
            this.pathChar = path
            this.mappedMaze = this.maze.layout.map((i)=> [...i]);
            for (let i = 0; i < this.mappedMaze.length; i++) {
                for (let j = 0; j < this.mappedMaze[i].length; j++) {
                    [...this.end.path].map((p)=> {
                        if ((p[0] == i && p[1] == j) && (this.start.value[0] != i || this.start.value[1] != j)) {
                            this.mappedMaze[i][j] = path;
                        } 
                    });
                }
            }
        }
    }

    r.getOpenNodes();
    r.findEndPoints();
    return r;
}
