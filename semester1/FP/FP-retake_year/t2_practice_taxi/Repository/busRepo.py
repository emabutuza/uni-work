from Domain.bus import Bus


class BusRepository(object):
    def __init__(self, filename):
        self.__filename = filename
        self.__buses = self.load_buses()

    def load_buses(self):
        buses = []
        with open(self.__filename, 'r') as file:
            for line in file:
                bus_id, route_code, model, times_used = line.strip().split(',')
                buses.append(Bus(int(bus_id), int(route_code), model, int(times_used)))
        return buses

    def getAll(self):
        return self.__buses[:]

    """
    def get_buses_by_route(self, route_code):
        for bus in self.__buses:
            if bus.get_route_code() == route_code:
                return bus
    """

    def get_bus_by_id(self, bus_id):
        for bus in self.__buses:
            if bus.get_id() == bus_id:
                return bus
