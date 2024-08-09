export default (maze = {}) => {
    let m = {
        wallChar: (maze.wallChar ? maze.wallChar : "#"),
        startChar: (maze.startChar ? maze.startChar : "s"),
        endChar: (maze.endChar ? maze.endChar : "e"),
        openChar: (maze.openChar ? maze.openChar : " "),
        layout: (maze.layout ? maze.layout.trim().split('\n').map((i)=> i.trim().split("")) : []),
        height: (maze.layout ? maze.layout.trim().split('\n').length : 0),
        width: (maze.layout ? maze.layout.trim().split('\n')[0].length : 0),
        
        buildNew(h=10, w=10, mazeType="h") {
            let openPoints = [],
                newLayout = [],
                choices = [this.openChar, this.openChar, this.wallChar],
                s = [0, 0],
                e = [0, 0];
                this.height = h;
                this.width = w;
            for (let i = 0; i < h; i++){
                newLayout.push([]);
                for (let j = 0; j < w; j++){
                    newLayout[i].push([i, j]);
                }
            }
            for (let x = 0; x < newLayout.length; x++){ 
                for (let y = 0; y < newLayout[x].length; y++) {
                    let p = newLayout[x][y];
                    if (p[0] == 0 || p[1] == 0 || p[0] == this.height - 1 || p[1] == this.width - 1) {
                        newLayout[x][y] = this.wallChar;
                    } else {
                        openPoints.push([x, y]);
                    }
                }
            }
            this.layout = newLayout;
            if (mazeType == "h") {
                s = [1, Math.floor(Math.random() * (this.width - 2)) + 1];
                openPoints = openPoints.filter((i) => i[0] !== s[0] || i[1] !== s[1]);
                e = [this.height - 2, Math.floor(Math.random() * (this.width - 2)) + 1];
                openPoints = openPoints.filter((i) => i[0] !== e[0] || i[1] !== e[1]);
            } else if (mazeType == "v") {
                s = [Math.floor(Math.random() * (this.height - 2)) + 1, 1];
                openPoints = openPoints.filter((i) => i[0] !== s[0] || i[1] !== s[1]);
                e = [Math.floor(Math.random() * (this.height - 2)) + 1, this.width - 2];
                openPoints = openPoints.filter((i) => i[0] !== e[0] || i[1] !== e[1]);
            } else if (mazeType == "r") {
                while (s[0] == e[0] && s[1] == e[1]) {
                    s = [Math.floor(Math.random() * (this.height - 2)) + 1, Math.floor(Math.random() * (this.width - 2)) + 1];
                    e = [Math.floor(Math.random() * (this.height - 2)) + 1, Math.floor(Math.random() * (this.width - 2)) + 1];
                }
                openPoints = openPoints.filter((i) => i[0] !== s[0] || i[1] !== s[1]);
                openPoints = openPoints.filter((i) => i[0] !== e[0] || i[1] !== e[1]);

            } else {
                throw "Incorrect Maze type: try h, v, or r.";
            }
            this.layout[s[0]][s[1]] = this.startChar;
            this.layout[e[0]][e[1]] = this.endChar;

            openPoints.map((i)=> {
                this.layout[i[0]][i[1]] = choices[Math.floor(Math.random() * choices.length)];
            });
            
            return this.layout;
        },

        typeInfo() {
            console.log(`    start point: ${this.startChar}\n    end point: ${this.endChar}\n    open spaces: ${this.openChar}\n    wall type: ${this.wallChar}\n    size: ${this.height} x ${this.width}`);
        },

        viewLayout() {
            return console.log(this.layout.map((i)=> i.join("")).join('\n'));
        }
    }
    if (maze.layout == undefined) {
        let h = (maze.build ? maze.build[0] : 10);
        let w = (maze.build ? maze.build[1] : 10);
        let t = (maze.buildType ? maze.buildType : "h");
        m.buildNew(h, w, t);
    }
    return m;
}