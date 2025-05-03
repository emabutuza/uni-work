class ConsoleUI:
    def __init__(self, controller):
        self.__controller = controller

    def run(self):
        print("Assignment Checker App")
        while True:
            print()
            print("1. Add an assignment")
            print("2. Display all assignments sorted increasingly by id")
            print("3. Dishonesty check")
            print("0. Exit")
            print()

            option = input("Choose an option: ")
            if option == '1':
                self.__add_assignment_ui()
            elif option == '2':
                self.__display_assignments_sorted_incresingly_ui()
            elif option == '3':
                self.__dishonesty_check_ui()
            elif option == '0':
                print("Exiting program")
                break
            else:
                print("Invalid option!")

    def __add_assignment_ui(self):
        try:
            id = int(input("ID: "))
            student_name = input("Name: ")
            solution = input("Solution: ")
            self.__controller.add_assignment(id, student_name, solution)
            print("Assignment added successfully")
        except ValueError as e:
            print(f"Error: {e}")


    def __display_assignments_sorted_incresingly_ui(self):
        assignments = self.__controller.get_all_assignments_sorted()
        for assignment in assignments:
            print(assignment)

    def __dishonesty_check_ui(self):
        pairs = self.__controller.dishonesty_check()
        if not pairs:
            print("No assignments with more than 20% common words found.")
        else:
            for pair in pairs:
                assignment1, assignment2, percentage_i, percentage_j = pair
                print(f"{assignment1.get_name()} -> {assignment2.get_name()} ({percentage_i:.2f}% of {assignment1.get_name()}'s solution; {percentage_j:.2f}% of {assignment2.get_name()}'s solution)")