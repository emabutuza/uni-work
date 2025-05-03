class Student:
    def __init__(self, id: int, name: str, group: int):
        if group < 0:
            raise ValueError("Group must have a positive number")
        self.__id = id
        self.__name = name
        self.__group = group

    @property
    def id(self):
        return self.__id

    @id.setter
    def id(self, id):
        self.__id = id

    @property
    def name(self):
        return self.__name

    @name.setter
    def name(self, name):
        self.__name = name

    @property
    def group(self):
        return self.__group

    @group.setter
    def group(self, group):
        if group < 0:
            raise ValueError("Group must have a positive number")
        self.__group = group

    def __str__(self):
        return "Id: " + str(self.__id) + " Name: " + str(self.__name) + " Group: " + str(self.__group)