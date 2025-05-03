from Domain.Student import Student


class AppController:
    def __init__(self, repo):
        self.__repo = repo

    def add_student(self, id, name, attendance, grade):
        if not isinstance(id, int) or id <=0:
            raise ValueError("ID must be a positive integer")
        if not isinstance(name, str) or len(name.split()) < 2 or any(len(word) < 3 for word in name.split()):
            raise ValueError("Invalid name")
        if not isinstance(attendance, int) or attendance <= 0:
            raise ValueError("Attendances must be a positive integer.")
        if not isinstance(grade, int) or not (0 <= grade <= 10):
            raise ValueError("Invalid grade.")

        student = Student(id, name, attendance, grade)
        self.__repo.add_student(student)

    def get_all_students_by_grade(self):
        students = self.__repo.get_all()
        return sorted(students, key=lambda s: (-int(s.get_grade()), s.get_name()))

    def give_bonuses(self, p, b):
        students = self.__repo.get_all()
        for student in students:
            if student.get_attendance_count() >= p:
                new_grade = min(student.get_grade() + b, 10)
                student._Student__grade = new_grade
        self.__repo.save_students()

    def get_students_by_name_includes(self, substring):
        students = self.__repo.get_all()
        filtered_students = [s for s in students if substring in s.get_name()]
        sorted_students = sorted(filtered_students, key=lambda student: student.get_name())
        return sorted_students

