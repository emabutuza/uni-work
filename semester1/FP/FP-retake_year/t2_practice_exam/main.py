from Console.ui import ConsoleUI
from Repository.studentRepo import StudentRepo
from Service.service import AppController

repo = StudentRepo('students.txt')
controller = AppController(repo)
ui = ConsoleUI(controller)
ui.run()