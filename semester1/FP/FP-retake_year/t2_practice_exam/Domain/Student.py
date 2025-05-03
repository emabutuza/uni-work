class Student:
    def __init__(self, id, name, attendance_count, grade):
        self.__id =id
        self.__name = name
        self.__attendance = attendance_count
        self.__grade = grade

    def __str__(self):
        return "ID: " + str(self.__id) + " Name: " + str(self.__name) + " Attendance count: " + str(self.__attendance) + " Grade: " + str(self.__grade)

    def get_id(self):
        return self.__id

    def get_name(self):
        return self.__name

    def get_attendance_count(self):
        return int(self.__attendance)

    def get_grade(self):
        return int(self.__grade)