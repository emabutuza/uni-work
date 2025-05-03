class Assignment:
    def __init__(self, id, name, solution):
        self.__id = id
        self.__name = name
        self.__solution = solution

    def __str__(self):
        return "ID: " + str(self.__id) + " Name: " + str(self.__name) + " Solution: " + str(self.__solution)

    def get_id(self):
        return self.__id

    def get_name(self):
        return self.__name

    def get_solution(self):
        return self.__solution