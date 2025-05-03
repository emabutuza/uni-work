from Domain.route import Route


class RouteRepo(object):
    def __init__(self, filename):
        self.__filename = filename
        self.__bus_routes = self.load_bus_routes()

    def load_bus_routes(self):
        bus_routes = []
        with open(self.__filename, 'r') as file:
            for line in file:
                route_code, length = line.strip().split(',')
                bus_routes.append(Route(int(route_code), int(length)))
        return bus_routes

    def getAll(self):
        return self.__bus_routes[:]

    def get_route_by_code(self, route_code):
        routes = self.getAll()
        for route in self.__bus_routes:
            if route.get_route_code() == route_code:
                return route
