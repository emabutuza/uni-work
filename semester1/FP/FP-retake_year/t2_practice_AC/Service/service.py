from Domain.Assignment import Assignment


class AssignmentController:
    def __init__(self, repo):
        self.__repo = repo

    def get_all_assignments(self):
        return self.__repo.get_all()

    def add_assignment(self, id, name, solution):
        if not isinstance(id, int) or id <= 0:
            raise ValueError("ID must be a positive integer.")
        if not isinstance(name, str) or len(name) < 3:
            raise ValueError("Name must be a string with at least 3 characters.")
        if not isinstance(solution, str) or len(solution) == 0:
            raise ValueError("Solution must be a non-empty string.")
        for assignment in self.__repo.get_all():
            if assignment.get_id() == id:
                raise ValueError("ID must be unique.")

        new_assignment = Assignment(id, name, solution)
        self.__repo.add_assignment(new_assignment)

    def dishonesty_check(self):
        assignments = self.__repo.get_all()
        pairs = []
        for i in range(len(assignments)):
            for j in range(i + 1, len(assignments)):
                common_words = self.__common_words(assignments[i].get_solution(), assignments[j].get_solution())
                percentage_i = len(common_words) / len(assignments[i].get_solution().split()) * 100
                percentage_j = len(common_words) / len(assignments[j].get_solution().split()) * 100
                if percentage_i >= 20 or percentage_j >= 20:
                    pairs.append((assignments[i], assignments[j], percentage_i, percentage_j))
        return pairs

    def __common_words(self, solution1, solution2):
        words1 = set(solution1.split())
        words2 = set(solution2.split())
        return words1.intersection(words2)

