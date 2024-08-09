class Node:
	def __init__(self, value):
		self.value = value 
		self.children = []
		self.path = set()
		
	def add_visited(self, node):
		self.visited.add(node)
	
	def add_child(self, child_node):
		self.children.append(child_node)
		
	def set_path(self, node_path):
		if not self.path or len(node_path) < len(self.path):
			self.path = node_path
		
	def remove_child(self, child_node):
		self.children.discard(child_node)
		