import argparse
import re

from . import Maze, Runner

def open_and_build(file):
	with open(file) as m:
		txt = m.read()
		m1 = [list(i) for i in txt.split("\n")]
		flat = [y for x in m1 for y in x]
		s = set(txt)
		wall = txt[0][0]
		s.remove("\n")
		s.remove(wall)
		for i in s:
			if flat.count(i) == 1:
				pass
			else: 
				space = i
		s.remove(space)
		flat[:] = [x for x in flat if x != wall and x != space]
		start = flat[0]
		end = flat[1]
		return Maze(m1, start, end, wall, space)

def upload():
	upload_file = input("Choose a file to upload: ").strip()
	try:
		return open_and_build(upload_file)
	except:
		input("File Not found. (press enter to try again ctrl + c to end)")
		return upload()

def find_type():
	while True:
		maze_type = input("Would you like to upload a maze or build a new one? \n  1) Build New \n  2) Upload \n").strip()
		try:
			m_type = int(maze_type)
			if m_type not in [1, 2]:
				input("Choose 1 or 2. (press enter to try again ctrl + c to end)")
				continue
		except:
			input("Type must be a number. (press enter to try again ctrl + c to end)")
			continue
		break
	
	if m_type == 1:
		return build_new()
	else:
		return upload()
		
def place_points(m):
	while True:
		point_placement = input("Where would you like your start and end points to be placed in the maze? \n  1) Top and bottom \n  2) Left and Right \n  3) Random Placement \n").strip()
		try:
			if int(point_placement) == 1:
				maze_type = "h"
				break
			elif int(point_placement) == 2:
				maze_type = "v"
				break
			elif int(point_placement) == 3:
				maze_type = "r"
				break
			else:
				input("Try again using 1, 2, or 3 (press enter to try again ctrl + c to end)")
		except:
			input("Must be the number 1, 2 or 3 (press enter to try again ctrl + c to end)")
	maze = Maze()
	maze.build_new(m[0], m[1], maze_type)
	return maze

def build_new():
	maze_info = input("Enter maze height and width: ").strip()
	try:
		m = [int(i) for i in maze_info.split(" ")]
	except:
		input("Try again (Both hieght and with must be numbers: height width) (press enter to try again ctrl + c to end)")
		return build_new()
	return place_points(m)

def save_file(file_name, runner):
	with open(file_name, "w") as file:
		file.write("Origional maze: \n")
		for i in runner.maze.layout:
			for j in i:
				file.write(j)
			file.write("\n")
		file.write("\n Solved maze: \n")
		for i in runner.mapped_maze:
			for j in i:
				file.write(j)
			file.write("\n")
		file.write("\n")

def build_and_save(runner, file_name):
	runner.make_node_paths()
	complete = "Yes" if runner.completed else "No"
	print(f"Is maze possible? {complete}")
	if runner.completed:	
		runner.build_path()
		runner.view_completed()
		save_file(file_name, runner)
	
 
if __name__ == "__main__":
	parser = argparse.ArgumentParser()
	parser.add_argument("-of", "--openfile", help="Open File Name", dest='openfile', type=str)
	parser.add_argument("-sf", "--savefile", help="Save File Name", dest='savefile', type=str, default='completed.txt')
	parser.add_argument("-d", "--dimensions", help="Maze dimentions", dest='dimensions', type=int, nargs=2)
	parser.add_argument("-t", "--type", help="Maze Type", dest='type', type=str, default='h')
	args = parser.parse_known_args()[0]

	m_type = args.type
	if m_type not in ['h', 'v', 'r']:
		m_type = place_points()

	if args.openfile:
		maze = open_and_build(args.openfile, m_type)
	elif args.dimensions:
		maze = Maze(build=(int(args.dimensions[0]), int(args.dimensions[1])), build_type=m_type)	
	else:
		maze = find_type()

	maze.view_layout()
	runner = Runner(maze)
	build_and_save(runner, "completed.txt")
	