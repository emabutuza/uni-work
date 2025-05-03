from domain.students import Student
from random import randint
import pickle


def getId():
    return randint(1000, 10000)


def getName():
    names = ["John", "Margot", "Jane", "Stella", "Matthew", "Leonardo", "Angie"]
    return names[randint(0,6)]


def getGroup():
    return randint(1, 15)


class StudentsMemoryRepo:
    def __init__(self):
        #students are stored in this list
        self.__data = []

    def add(self, student: Student):
        """
        Add a new student to the repo
        :param student: to be added
        :return:
        """
        self.__data.append(student)

    def add_student(self, id, name, group):
        self.__data.append(Student(id, name, group))

    def remove_last(self):
        """
        Removes the last Student in the repo
        :return:
        """
        if len(self.__data) > 0:
            self.__data.pop()
        else:
            raise ValueError("The repository is empty!")

    def remove(self, stud):
        for student in self.__data:
            if stud == student:
                self.__data.remove(stud)

    def restore(self, history):
        """
        Removes the last state of the repo
        :param history:
        :return:
        """
        self.__data = history
    def getStudents(self, n):
        """
        Generates n random students and adds them to the Repository
        :param n: number of students to be added
        :return:
        """
        for i in range(n):
            self.__data.append(Student(getId(), getName(), getGroup()))

    @property
    def all(self):
        return self.__data

    def __len__(self):
        return len(self.__data)

    def __iter__(self):
        for student in self.__data:
            yield student

def return_student_list(repo):
    """
    Returns the list of students
    :param repo: Our repo
    :return: The list of students
    """
    result = []
    for student in repo.all:
        result.append(student)
    return result

def display_repo_state(repo):
    """
    Displays the current state of the repo
    :param repo:
    :return:
    """
    print(f"Repository {repo.__class__.__name__} - Total Number of Students: {len(repo)}")
    for student in repo.all:
        print(student)



class TextFileRepository(StudentsMemoryRepo):
    def __init__(self, filename):
        super().__init__()
        self.filename = filename

    def load_file(self):
        """
        loads the students from the file
        :return:
        """
        try:
            with open(self.filename, 'r') as file:
                for line in file:
                    id, name, group = line.strip().split(',')
                    self.add_student(int(id), name, int(group))
        except FileNotFoundError:
            # If the file doesn't exist, it's okay; it will be created when saving
            pass

    def save_file(self):
        """
        saves the students to the file
        :return:
        """
        with open(self.filename, 'w') as file:
            for student in self.all:
                file.write(f"{student.id},{student.name},{student.group}\n")


class BinaryFileRepo(StudentsMemoryRepo):
    """
    RepoBinaryFile inherits from StudentRepoMemory
        1. all methods in StudentsRepoMemory are also in RepoBinaryFile
        2. we need to add the loadFile() and saveFile() methods
    """

    def __init__(self, filename):
        super().__init__()
        self.filename = filename

    def load_file(self):
        """
        loads the expenses from the file
        :return:
        """
        try:
            with open(self.filename, 'rb') as file:
                while True:
                    students = pickle.load(file)
                    self.add(students)
        except FileNotFoundError:
            # If the file doesn't exist, it's okay; it will be created when saving
            pass
        except EOFError:
            # End of file reached, loading is complete
            pass

    def save_file(self):
        """
        saves the expenses to the file
        :return:
        """
        with open(self.filename, 'wb') as file:
            for exp in self.all:
                pickle.dump(exp, file)
