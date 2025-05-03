from Domain.Student import Student


class StudentRepo:
    def __init__(self, filename):
        self.__filename = filename
        self.__students = self.load_students()

    def load_students(self):
        students = []
        with open(self.__filename, 'r') as file:
            for line in file:
                id, name, attendance, grade = line.strip().split(',')
                students.append(Student(id, name, attendance, grade))
        return students

    def get_all(self):
        return self.__students[:]

    def save_students(self):
        with open(self.__filename, 'w') as file:
            for student in self.__students:
                file.write(f"{student.get_id()},{student.get_name()},{student.get_attendance_count()},{student.get_grade()}\n")


    def add_student(self, student):
        self.__students.append(student)
        self.save_students()
