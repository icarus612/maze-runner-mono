import random

class Maze:
	def __init__ (self, layout=None, start_char="s", end_char="e", wall_char="#", open_char=" ", build=[(10, 10), "h"]):
		self.wall_char = wall_char
		self.start_char = start_char
		self.end_char = end_char
		self.open_char = open_char
		self.layout = layout
		if layout:
			self.width = len(layout[0])
			self.height = len(layout)
		else:
			self.build_new(build[0][0], build[0][1], build[1])

	def build_new(self, width=None, height=None, maze_type = "h"):
		if height == None:
			height = self.height 
		else:
			self.height = height
		if width == None:
			width = self.width 
		else:
			self.width = width
		self.layout = [[(h, w) for w in range(width)] for h in range(height)]
		open_points = []
		for x in range(len(self.layout)):
			for y in range(len(self.layout[x])):
				p = self.layout[x][y]
				if p[0] == 0 or p[1] == 0 or p[0] == height-1 or p[1] == width-1:
					self.layout[x][y] = self.wall_char
				else:
					open_points.append((x,y))
		if maze_type == "h":
			s= (1, random.choice(range(1, width-1)))
			del open_points[open_points.index(s)]
			e = (height-2, random.choice(range(1, width-1)))
			del open_points[open_points.index(e)]
		elif maze_type == "v":
			s = (random.choice(range(1, height-1)), 1)
			del open_points[open_points.index(s)]
			e = (random.choice(range(1, height-1)), width-2)
			del open_points[open_points.index(e)]
		elif maze_type == "r":
			s = random.choice(open_points)
			del open_points[open_points.index(s)]
			e = random.choice(open_points)
			del open_points[open_points.index(e)]
		else:
			raise ValueError("Incorrect Maze type. (try h, v, or r)")
		self.layout[s[0]][s[1]] = self.start_char
		self.layout[e[0]][e[1]] = self.end_char
		for i in open_points:
			self.layout[i[0]][i[1]] = random.choice([self.open_char, self.open_char, self.wall_char])
		return self.layout

	def type_info(self):
		print(f"	start point: {self.start_char}\n	end point: {self.end_char}\n	open spaces: {self.open_char}	wall type: {self.wall_char}\n	size: {maze.height} x {maze.width}")

	def view_layout(self):
		x =""
		for i in self.layout:
			x += "".join(i)
			x += "\n"
		print(x)
		return x