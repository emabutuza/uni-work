class Console:
    def __init__(self, controller):
        self.__controller = controller

    def run(self):
        print("Asiignment Checker App")
        while True:
            print()
            print("1. Add assignment")
            print("2. Display all assignments")
            print("3. Dishonesty check")
            print("0. Exit")
            print()
            option = input("Choose an option: ")
            if option == '1':
                self.__add_assignment()
            elif option == '2':
                self.__display_all_assignments()
            elif option == '3':
                self.__dishonesty_check()
            elif option == '0':
                break
            else:
                print("Invalid option!")


    def __add_assignment(self):
        try:
            id = int(input("ID: "))
            name = input("Name: ")
            solution = input("Solution: ")
            self.__controller.add_assignment(id, name, solution)
            print("Assignment added successfully.")
        except ValueError as e:
            print(f"Error: {e}")

    def __display_all_assignments(self):
        assignments = self.__controller.get_all_assignments()
        for assignment in assignments:
            print(assignment)

    def __dishonesty_check(self):
        pairs = self.__controller.dishonesty_check()
        for a1, a2, p1, p2 in pairs:
            print(f"{a1.get_name()} -> {a2.get_name()} ({p1:.2f}% of {a1.get_name()}'s solution, {p2:.2f}% of {a2.get_name()}'s solution)")