from Console.ui import Console
from Repository.AssignmentRepo import AssignmentRepo
from Service.service import AssignmentController

repo = AssignmentRepo('assignments.txt')
controller = AssignmentController(repo)
ui = Console(controller)
ui.run()