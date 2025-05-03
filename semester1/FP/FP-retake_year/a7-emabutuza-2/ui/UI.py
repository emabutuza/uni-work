from services.Services import Services, get_StudentsMemoryRepo, get_TextFileRepo, get_BinaryFileRepo

def print_menu():
    print("1. Add a student")
    print("2. Display the student list")
    print("3. Filter the students")
    print("4. Undo last operation")
    print("5. Generate a random number of students ")
    print("0. Exit")


class UI:
    def __init__(self, services):
        self.services = services

    def run(self):
        while True:
            print_menu()
            choice = input("Enter your option: ").strip()
            try:
                if choice == '1':
                    id = int(input("Enter the student's id: "))
                    name = input("Enter the student's name: ")
                    group = int(input("Enter the student's group: "))
                    self.services.add_students(id, name, group)
                elif choice == '2':
                    self.services.display_student_list()
                elif choice == '3':
                    group = int(input("Enter the group: "))
                    self.services.filter_students(group)
                elif choice == '4':
                    self.services.undo()
                elif choice == '5':
                    number_of_students = int(input("Select the number of students to be added: "))
                    self.services.get_students(number_of_students)
                elif choice == '0':
                    exit()
                else:
                    print("Invalid option")
            except ValueError as ve:
                print(ve)


if __name__ == '__main__':
    while True:
        try:
            history = []
            print("Choose the repository: ")
            print("1. Memory Repository")
            print("2. Binary Repository")
            print("3. Text Repository")
            option = input("Your option : ")
            if option == "1":
                repository = get_StudentsMemoryRepo()
            elif option == "2":
                repository = get_BinaryFileRepo()
            elif option == "3":
                repository = get_TextFileRepo()
            else:
                raise ValueError("Invalid input for repository selection!")
            services = Services(repository, history)
            ui = UI(services)
            ui.run()
        except ValueError as ve:
            print(ve)