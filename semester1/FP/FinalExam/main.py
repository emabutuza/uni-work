from Controller.Controller import Controller
from Repository.Repository import Repository
from UI.UI import UI

if __name__ == "__main__":
    repository = Repository('input.txt')
    controller = Controller(repository)
    ui = UI(controller)
    ui.start()
