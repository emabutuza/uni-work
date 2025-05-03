from functionalities import *
from flight import *

def add_flight_ui(flight_list):
    code = input("Enter the code: ")
    duration = int(input("Enter the duration: "))
    departure = input("Enter the departure city: ")
    destination = input("Enter the destination city: ")

    try:
        add_flight(flight_list, code, duration, departure, destination)
        print(flight_list)
    except ValueError as ve:
        print(ve)


def remove_flight_ui(flight_list):
    code = input("Enter the code of the flight to delete: ")
    try:
        delete_flight(flight_list, code)
        print(flight_list)
    except ValueError as ve:
        print(ve)


def show_all_flights_by_departure_city_ui(flight_list):
    departure_city = input("Enter the departure city: ")
    matching_flights = show_all_flights_by_departure_city(flight_list, departure_city)
    for flight in matching_flights:
        print(flight)

def increase_duration_of_flights_by_departure_city_ui(flight_list):
    departure_city = input("Enter the departure city: ")
    minutes = int(input("Enter the number of minutes with which flight duration is increased: "))
    try:
        increase_duration_of_flights_by_departure_city(flight_list, departure_city, minutes)
        for flight in flight_list:
            print(flight)
    except ValueError as ve:
        print(ve)

def airport_application():
    flight_list = [
        {'Code': '22AAE', 'Duration': '45', 'Departure_city': 'Cluj-Napoca', 'Destination_city': 'London'},
        {'Code': 'ABC44', 'Duration': '60', 'Departure_city': 'Cluj-Napoca', 'Destination_city': 'Bucharest'},
        {'Code': '11111', 'Duration': '100', 'Departure_city': 'Rome', 'Destination_city': 'Paris'},
        {'Code': '01PFG', 'Duration': '120', 'Departure_city': 'Athens', 'Destination_city': 'Crete'},
        {'Code': 'WMW00', 'Duration': '65', 'Departure_city': 'Rome', 'Destination_city': 'Florence'}
    ]

    while True:
        print("Airport application")
        print("1. Add a flight")
        print("2. Remove a flight")
        print("3. Show all flights by departure city")
        print("4. Increase duration of all flights with the given departure city")
        print("0. Exit")

        choice = input(">")

        if choice == "1":
            add_flight_ui(flight_list)
        if choice == "2":
            remove_flight_ui(flight_list)
        if choice == "3":
            show_all_flights_by_departure_city_ui(flight_list)
        if choice == "4":
            increase_duration_of_flights_by_departure_city_ui(flight_list)
        elif choice == "0":
            print("Exiting program")
            break


airport_application()