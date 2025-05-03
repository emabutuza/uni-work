from Domain.Assignment import Assignment


class AssignmentRepo:
    def __init__(self, filename):
        self.__filename = filename
        self.__assignments = self.load_assignments()

    def load_assignments(self):
        assignments = []
        with open(self.__filename, 'r') as file:
            for line in file:
                id, name, solution = line.strip().split(',')
                assignments.append(Assignment(int(id), name, solution))
        return assignments

    def get_all(self):
        return self.__assignments[:]

    def save_assignments(self):
        with open(self.__filename, 'w') as file:
            for assignment in self.__assignments:
                file.write(f"{assignment.get_id()},{assignment.get_name()},{assignment.get_solution()}\n")

    def add_assignment(self, assignment):
        self.__assignments.append(assignment)
        self.save_assignments()