from modules.node import Node

class Runner:
	def __init__(self, maze):
		self.open_nodes = []
		self.visited = set()
		self.to_visit = []
		self.start = None
		self.end = None
		self.maze = maze
		self.completed = False
		self.mapped_maze = []
		self.possible_paths = []
		self.path = None
		self.get_open_nodes()
		self.find_end_points()
		
	def get_open_nodes(self):
		p = self.maze.layout
		for x in range(len(p)):
			for y in range(len(p[x])):
				if p[x][y] != self.maze.wall_char:
					self.open_nodes.append(Node((x, y)))
						
	def find_end_points(self):
		def check(node_val):
			if node_val not in [i.value for i in self.open_nodes]:
				node = Node(node_val) 
			else:
				for i in self.open_nodes:
					if i.value == node_val:
						node = i
			return node
			
		for x in range(len(self.maze.layout)):
			for y in range(len(self.maze.layout[x])):
				p = self.maze.layout[x][y]
				if p == self.maze.start_char:
					self.start = check((x, y))
				elif p == self.maze.end_char:
					self.end = check((x, y))

	def look_around(self, node):
		for i in self.open_nodes:
			if i.value[0]-1 == node.value[0] and i.value[1] == node.value[1]:
				node.add_child(i)
			if i.value[0]+1 == node.value[0] and i.value[1] == node.value[1]:
				node.add_child(i)
			if i.value[1]-1 == node.value[1] and i.value[0] == node.value[0]:
				node.add_child(i)
			if i.value[1]+1 == node.value[1] and i.value[0] == node.value[0]:
				node.add_child(i)		
				
	def make_node_paths(self):
		self.to_visit.append(self.start)
		while len(self.to_visit) > 0:
			for point in self.to_visit.copy():
				self.to_visit.remove(point)
				if point not in self.visited:
					self.look_around(point)
					self.visited.add(point)
					new_path = point.path.copy()
					new_path.add(point.value)
					for i in point.children:
						i.set_path(new_path)
						if i.value == self.end.value:
							self.completed = True
						else:
							self.to_visit.append(i)

				
	def view_completed(self):
		x = ""
		for i in self.mapped_maze:
			x += "".join(i)
			x += "\n"
		print(x)
		return x

	def build_path(self, path="x"):
		other_options = set(["x", "o", "+", "*", "p"])
		maze = self.maze	
		if path == maze.start_char or path == maze.end_char or path == maze.wall_char or path == maze.open_char:
			print("Path character is already being used as a maze character trying something else...")
			for i in other_options:
				if i == maze.start_char or i == maze.end_char or i == maze.wall_char or i == maze.open_char:
					pass
				else:
					path = i
					print(f"New path character: {i}")
					break
		self.path = path
		self.mapped_maze = [list(i) for i in maze.layout]
		for i in range(len(self.mapped_maze)):
			for j in range(len(self.mapped_maze[i])):
				if (i, j) in self.end.path and (i, j) != self.start.value:
					self.mapped_maze[i][j] = path
