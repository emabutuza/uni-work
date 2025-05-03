class Bus:
    def __init__(self, id, route_code, model, times_used):
        self.__id = id
        self.__route_code = route_code
        self.__model = model
        self.__times_used = times_used

    def __str__(self):
        return "Bus ID: " + str(self.__id) + " Route Code: " + str(self.__route_code) + " Model: " + str(self.__model) + " Times Used: " + str(self.__times_used)

    def get_id(self):
        return self.__id

    def get_route_code(self):
        return self.__route_code

    def get_model(self):
        return self.__model

    def get_times_used(self):
        return self.__times_used