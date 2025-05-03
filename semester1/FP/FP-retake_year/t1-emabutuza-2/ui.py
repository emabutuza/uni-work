from flight import *
from operations import *

def add_flight_ui(flight_list):
    code = input("Enter the code: ")
    duration = int(input("Enter the duration: "))
    departure_city = input("Enter the departure city: ")
    destination_city = input("Enter the destination city: ")

    try:
        add_flight(flight_list, code, duration, departure_city, destination_city)
        for flight in flight_list:
            print(flight_to_string(flight))
    except ValueError as ve:
        print(ve)


def modify_duration_of_flight_ui(flight_list):
    code = input("Enter the code of the flight: ")
    new_duration = int(input("Enter the new duration: "))
    modified_flight = modify_duration_of_flight(flight_list, code, new_duration)
    print(flight_to_string(modified_flight))


def change_flight_destination_ui(flight_list):
    initial_destination_city = input("Enter the destination city for which flights are rerouted: ")
    new_destination_city = input("Enter the new destination city: ")
    try:
        # rerouted_flights =
        change_flight_destination(flight_list, initial_destination_city, new_destination_city)
        for flight in flight_list:
            print(flight_to_string(flight))
    except ValueError as ve:
        print(ve)


def show_all_flights_with_given_departure_city_ui(flight_list):
    departure_city = input("Enter departure city: ")
    selected_flights = show_all_flights_with_given_departure_city(flight_list, departure_city)
    for flight in selected_flights:
        print(flight_to_string(flight))



def airport_application():
    flight_list = [
        {'code': "AA201", 'duration': 80, 'departure_city': 'Cluj-Napoca', 'destination_city': 'Madrid'},
        {'code': "34RR1", 'duration': 100, 'departure_city': 'Rome', 'destination_city': 'Paris'},
        {'code': "100YT", 'duration': 60, 'departure_city': 'Cluj-Napoca', 'destination_city': 'Florence'},
        {'code': "99B13", 'duration': 50, 'departure_city': 'Rome', 'destination_city': 'Athens'},
        {'code': "EET13", 'duration': 150, 'departure_city': 'London', 'destination_city': 'New York'}
    ]

    while True:
        print("Airport application")
        print("1. Add a flight")
        print("2. Modify the duration of a flight")
        print("3. Change destination city")
        print("4. Show all flights with a given departure city, sorted increasingly by their duration.")
        print("0. Exit")

        choice = input(">")

        if choice == "1":
            add_flight_ui(flight_list)
        if choice == "2":
            modify_duration_of_flight_ui(flight_list)
        if choice == "3":
            change_flight_destination_ui(flight_list)
        if choice == "4":
            show_all_flights_with_given_departure_city_ui(flight_list)
        elif choice == "0":
            print("Exiting program")
            break


airport_application()