class Bar:

    def __init__(self, x, y, height, width, color, data = []):
        self.x = x
        self.y = y
        self.height = height
        self.width = width
        self.color = color
        self.data = data

    
    def __str__(self):
        return f"Bar(x={self.x}, y={self.y}, height={self.height}, width={self.width}, color={self.color}, data={self.data})"