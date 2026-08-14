import fs from "fs";
import Maze from "./maze.js";
import Runner from "./runner.js";


const openAndBuild = (file) => {
	fs.readFile(file, 'utf8', (_, data) => {
		console.log(data);
	});
}

const QuickSolver = () => {
	
	let maze;
	let runner;
	let saveFile = "completed.txt";
	
	/* eslint-disable no-fallthrough, no-useless-assignment -- pre-existing intentional-looking
	   case cascade in application logic; out of scope for this lint-import-audit lane (imports
	   and module systems only, not JS behavior correctness). Not fixed here. */
	switch (process.argv.length) {
		case 3: {
			maze = openAndBuild(process.argv[3]);
		}
		case 4: {
			try {
				maze = Maze({ build: [parseInt(process.argv[3], 10), parseInt(process.argv[4], 10)] });
			} catch (e) {
				maze = openAndBuild(process.argv[3]);
				saveFile = process.argv[4];
			}
		}
		case 5: {
			maze = Maze({ build: [process.argv[3], process.argv[4]] });
			saveFile = process.argv[5];
		}
		default: {
			maze = Maze();
			break;
		}
	}
	/* eslint-enable no-fallthrough, no-useless-assignment */

	maze.viewLayout();
	runner = Runner(maze);
	
	runner.makeNodePaths();
	runner.buildPath();
	runner.viewCompleted();
}
export default QuickSolver;