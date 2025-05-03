from Domain.Assignment import Assignment


class AppController:
    def __init__(self, repo):
        self.__repo = repo

    def get_all_assignments(self):
        return self.__repo.get_all()

    def add_assignment(self, id, name, solution):
        """
        Function that checks the parameters of an assignment and adds the assignment to the text file
        in case the parameters correspond to the criteria
        :param id: the id of the assignment
        :param name: the name of the student who did the assignment
        :param solution: the solution of the assignment
        :return: -

        """
        if not isinstance(id, int) or id <= 0:
            raise ValueError("Invalid ID")
        if not isinstance(name, str) or len(name) < 3:
            raise ValueError("Invalid student name")
        if not isinstance(solution, str) or len(solution) == 0:
            raise ValueError("Invalid solution")
        for assignment in self.get_all_assignments():
            if assignment.get_id() == id:
                raise ValueError("ID must be unique")

        new_assignment = Assignment(id, name, solution)
        self.__repo.add_assignment(new_assignment)

    def get_all_assignments_sorted(self):
        assignments = self.__repo.get_all()
        return sorted(assignments, key=lambda assignment: int(assignment.get_id()))

    def dishonesty_check(self):
        pairs = []
        assignments = self.__repo.get_all()
        for i in range(len(assignments)):
            for j in range(i+1, len(assignments)):
                common_words = self.__words_in_common(assignments[i].get_solution(), assignments[j].get_solution())
                percentage_i = len(common_words) / len(assignments[i].get_solution().split()) * 100
                percentage_j = len(common_words) / len(assignments[j].get_solution().split()) * 100
                if percentage_i > 20 or percentage_j > 20:
                    pairs.append((assignments[i], assignments[j], percentage_i, percentage_j))
        return pairs


    def __words_in_common(self, solution1, solution2):
        words1 = solution1.split()
        words2 = solution2.split()
        return set(words1).intersection(set(words2))