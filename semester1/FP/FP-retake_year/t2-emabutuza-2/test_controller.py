import unittest

from Service.service import AppController
from Domain.Assignment import Assignment
from Repository.AssignmentRepository import AssignmentRepo


class TestAppController(unittest.TestCase):
    def setUp(self):
        self.repo = AssignmentRepo('test_assignments.txt')
        self.repo.assignments = []
        self.controller = AppController(self.repo)

    def test_add_assignment_success(self):
        self.controller.add_assignment(1, "John Doe", "This is a solution")
        assignments = self.repo.get_all()
        self.assertEqual(len(assignments), 1)
        self.assertEqual(assignments[0].get_id(), 1)
        self.assertEqual(assignments[0].get_name(), "John Doe")
        self.assertEqual(assignments[0].get_solution(), "This is a solution")

    def test_add_assignment_invalid_id(self):
        with self.assertRaises(ValueError) as context:
            self.controller.add_assignment(-1, "John Doe", "This is a solution")
        self.assertEqual(str(context.exception), "Invalid ID")

    def test_add_assignment_invalid_name(self):
        with self.assertRaises(ValueError) as context:
            self.controller.add_assignment(1, "JD", "This is a solution")
        self.assertEqual(str(context.exception), "Invalid student name")

    def test_add_assignment_invalid_solution(self):
        with self.assertRaises(ValueError) as context:
            self.controller.add_assignment(1, "John Doe", "")
        self.assertEqual(str(context.exception), "Invalid solution")

    def test_add_assignment_duplicate_id(self):
        self.controller.add_assignment(1, "Jane Doe", "Another solution")
        with self.assertRaises(ValueError) as context:
            self.controller.add_assignment(1, "John Doe", "This is a solution")
        self.assertEqual(str(context.exception), "ID must be unique")

if __name__ == '__main__':
    unittest.main()