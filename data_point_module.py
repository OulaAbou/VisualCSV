class DataPoint:

    def __init__(self, x, y, value, type, color):
        self.x = x
        self.y = y
        self.value = value
        self.type = type
        self.color = color

    def __str__(self):
        return f"DataPoint(x={self.x}, y={self.y}, value={self.value}, type={self.type}, color={self.color})"