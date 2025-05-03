class AppController(object):
    """
    Class for the app controller
    """
    def __init__(self, busRepo, routeRepo):
        self.__busRepo = busRepo
        self.__routeRepo = routeRepo

    def get_bus_routes(self):
        """
        Method that gets all the routes from the routes repository
        :return: a list containing all the routes from the routes repository
        """
        return self.__routeRepo.getAll()

    def get_buses_on_route(self, route_code):
        buses_on_route = []
        all_buses = self.__busRepo.getAll()
        for bus in all_buses:
            if bus.get_route_code() == route_code:
                buses_on_route.append(bus)
        return buses_on_route[:]

    def computeDistance(self, bus_id):
        total_distance = 0
        searched_bus = None
        searched_bus = self.__busRepo.get_bus_by_id(bus_id)
        route = self.__routeRepo.get_route_by_code(searched_bus.get_route_code())
        route_length = route.get_length()
        total_distance += route_length * searched_bus.get_times_used()
        return (total_distance, searched_bus)

    def get_routes_sorted_by_mileage(self):
        route_mileage = {}
        for route in self.__routeRepo.getAll():
            for bus in self.__busRepo.getAll():
                if bus.get_route_code() == route.get_route_code():
                    total_mileage = sum(bus.get_times_used() * route.get_length())
            route_mileage[route] = total_mileage
        return sorted(route_mileage.items(), key=lambda x: x[1], reverse=True)