from repository.Repository import return_student_list
from repository.Repository import BinaryFileRepo, TextFileRepository, StudentsMemoryRepo
from unittest import TestCase


class Services():
    def __init__(self, repository, history):
        self. repository = repository
        self.history = history

    def add_students(self, id, name, group):
        """
        Adds a student to the list
        :param id: the student's id
        :param name: the student's name
        :param group: the student's group
        :return:
        """
        students = return_student_list(self.repository)
        self.history.append(students)
        self.repository.add_student(id, name, group)
        try:
            self.repository.save_file()
        except:
            pass

    def display_student_list(self):
        """
        Displays the list of students
        :return:
        """
        student_list = self.repository.all
        for students in student_list:
            print(students)

    def filter_students(self, chosen_group):
        """
        Filters the list of students by group
        :return: If a student is in a certain group it's deleted
        """
        students = return_student_list(self.repository)
        self.history.append(students)
        student_list = self.repository.all
        for stud in student_list:
            if stud.group == chosen_group:
                self.repository.remove(stud)
        try:
            self.repository.save_file()
        except:
            pass

    def undo(self):
        """
        Undo the last operation that the user made
        :return:
        """
        if len(self.history) > 0:
            self.repository.restore(self.history[-1])
            self.history.pop()
            try:
                self.repository.save_file()
            except:
                pass
        else:
            print("Cant undo any further.")

    def get_students(self, number_of_students):
        """
        Generate number_of_students students and adds them to the repo
        :param self:
        :param number_of_students: The number of students to be added
        :return:
        """
        self.repository.getStudents(number_of_students)
        try:
            self.repository.save_file()
        except:
            pass


def get_StudentsMemoryRepo():
    return StudentsMemoryRepo()


def get_BinaryFileRepo():
    repository = BinaryFileRepo('students_binary.bin')
    repository.load_file()
    return repository


def get_TextFileRepo():
    repository = TextFileRepository('students_text.txt')
    repository.load_file()
    return repository


class TestServices(TestCase):
    """
    Contains all the tests that we perform over our program
    """
    def test_students_operations(self):
        # Create an instance of the StudentsMemoryRepo and Services
        students_repo = StudentsMemoryRepo()
        history = []
        services = Services(students_repo, history)

        #Test adding a student
        id = 2831
        name = 'Catherine'
        group = 15
        services.add_students(id, name, group)
        self.assertEqual(len(services.repository), 1)

        # Test getting students
        number_of_students = 5
        services.get_students(number_of_students)
        self.assertEqual(len(services.repository), number_of_students)

        # Test undo after getting students
        services.undo()
        self.assertEqual(len(services.repository), 0)

        # Test undo when history is empty
        services.undo()
        self.assertEqual(len(services.repository), 0)

        # Test undo after adding student after getting students
        services.add_students(id, name, group)
        services.undo()
        self.assertEqual(len(services.repository), 0)