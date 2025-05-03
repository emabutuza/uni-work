class Route:
    def __init__(self, route_code, length):
        self.__route_code = route_code
        self.__length = length

    def __str__(self):
        return "Route Code: " + str(self.__route_code) + " Length: " + str(self.__length)+ " km"

    def get_route_code(self):
        return self.__route_code

    def get_length(self):
        return self.__length
