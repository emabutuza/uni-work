class Console(object):
    def __init__(self, controller):
        self.__controller = controller
        self.__commands = {"1": self.__uiCertainRoute, "2": self.__uiPrintRoutes, "3": self.__uiComputeTravelled, "4": self.__uiRoutesSortedByMileage}

    def __uiCertainRoute(self):
        print("Input the route you wish to see all buses travelling across: ")
        route_code = int(input())
        buses_across = self.__controller.get_buses_on_route(route_code)
        if buses_across == []:
            print("No buses exist on the given route")
        for bus in buses_across:
            print(bus)

    def __uiPrintRoutes(self):
        routes = self.__controller.get_bus_routes()
        for route in routes:
            print(route)

    def __uiComputeTravelled(self):
        print("Input the bus id you want to calculate the travelled distance for: ")
        bus_id = int(input())
        distance_and_bus = self.__controller.computeDistance(bus_id)
        print("The distance is: " + str(distance_and_bus[0]))
        print("The info about the bus: ")
        print(distance_and_bus[1])

    def __uiRoutesSortedByMileage(self):
        routes = self.__controller.get_routes_sorted_by_mileage()
        for route, mileage in routes:
            print(route)
            print(f'Total Mileage: {mileage} km')
            buses = self.__controller.get_buses_on_route(route.get_route_code())
            for bus in buses:
                print(f'  {bus}')

    def __print_menu(self):
        print("\nCommands you can use:")
        print("1 - to display all buses travelling across a certain route")
        print("2 - to display all bus routes")
        print("3 - to compute how many kilometres a bus has travelled in total")
        print("4 - to display all bus routes sorted by total mileage")
        print("\n")

    def run(self):
        print("Bus Tycoon")
        while True:
            self.__print_menu()
            print(">>")
            command = input()
            if command == "0":
                print("Goodbye")
                return
            elif command in self.__commands:
                try:
                    self.__commands[command]()
                except ValueError:
                    print("Invalid numerical value")
            else:
                print("Invalid command")
