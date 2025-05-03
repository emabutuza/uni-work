from Console.ui import ConsoleUI
from Repository.AssignmentRepository import AssignmentRepo
from Service.service import AppController

repo = AssignmentRepo('assignments.txt')
controller = AppController(repo)
ui = ConsoleUI(controller)
ui.run()
