class ConsoleUI:
    def __init__(self, controller):
        self.__controller = controller

    def run(self):
        print("Student App")
        while True:
            print()
            print("1. Add a new student")
            print("2. Display all students in decreasing order by grade")
            print("3. Give bonuses")
            print("4. Display all students whose names include a given string")
            print("0. Exit")
            print()

            option = input("Choose an option: ")
            if option == '1':
                self.add_student()
            elif option == '2':
                self.display_students_sorted_by_grade()
            elif option == '3':
                self.give_bonuses()
            elif option == '4':
                self.display_students_by_name_includes()
            elif option == '0':
                break
            else:
                print("Invalid option")

    def add_student(self):
        try:
            id = int(input("ID: "))
            name = input("Name: ")
            attendance = int(input("Attendance count: "))
            grade = int(input("Grade: "))
            self.__controller.add_student(id, name, attendance, grade)
            print("Student added successfully")

        except ValueError as e:
            print(e)

    def display_students_sorted_by_grade(self):
        students = self.__controller.get_all_students_by_grade()
        for student in students:
            print(student)

    def give_bonuses(self):
        try:
            p = int(input("Minimum attendance: "))
            b = int(input("Bonus: "))
            self.__controller.give_bonuses(p, b)
            print("Bonuses given successfully")
        except ValueError:
            print("Invalid input")


    def display_students_by_name_includes(self):
        substring = input("Enter substring: ")
        students = self.__controller.get_students_by_name_includes(substring)
        for student in students:
            print(student)