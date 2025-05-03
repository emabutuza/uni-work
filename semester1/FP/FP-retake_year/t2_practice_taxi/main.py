from Console.ui import Console
from Repository.busRepo import BusRepository
from Repository.routeRepo import RouteRepo
from Service.service import AppController

routeRepo = RouteRepo("routes.txt")
busRepo = BusRepository("buses.txt")

controller = AppController(busRepo, routeRepo)

console = Console(controller)
console.run()
