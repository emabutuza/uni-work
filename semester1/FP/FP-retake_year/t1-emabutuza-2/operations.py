from flight import *


def add_flight(flights, code, duration, departure_city, destination_city):
    """
    Function that adds a flight to the flight list if the code, departure city and destination city have lengths longer
    than 3 characters and the duration is longer than 20 minutes
    :param flights: the list of flights to which we add the new flight
    :param code: the code of the new flight
    :param duration: the duration of the new flight
    :param departure_city: the departure city of the new flight
    :param destination_city: the destination city of the new flight
    :return: None
    """
    if len(code) < 3 or len(departure_city) < 3 or len(destination_city) < 3:
        raise ValueError("The given parameters do not respect the requirements.")
    if duration < 20:
        raise ValueError("The flight duration must be longer than 20 minutes.")

    new_flight = create_flight(code, duration, departure_city, destination_city)
    flights.append(new_flight)


def test_add_flight():
    test_list = []
    add_flight(test_list, "AA201", 50, "Cluj-Napoca", "Madrid")
    assert test_list == [{'code': "AA201", 'duration': 50, 'departure_city': 'Cluj-Napoca', 'destination_city': 'Madrid'}]
    print("Test 1 done")

    add_flight(test_list, "34RR1", 100, "Rome", "Paris")
    assert test_list == [{'code': "AA201", 'duration': 50, 'departure_city': 'Cluj-Napoca', 'destination_city': 'Madrid'},
                    {'code': "34RR1", 'duration': 100, 'departure_city': 'Rome', 'destination_city': 'Paris'}]
    print("Test 2 done")

    try:
        add_flight(test_list, "AB", 50, "Cluj-Napoca", "Madrid")
        assert False, "The length of the code must have more than 3 characters"
    except ValueError:
        assert True
        print("Test 3 done")

    try:
        add_flight(test_list, "ABCDE", 50, "Cl", "Madrid")
        assert False, "The length of the departure city must have more than 3 characters"
    except ValueError:
        assert True
        print("Test 4 done")

    try:
        add_flight(test_list, "ABCDE", 50, "Cluj-Napoca", "M")
        assert False, "The length of the destination city must have more than 3 characters"
    except ValueError:
        assert True
        print("Test 3 done")

    try:
        add_flight(test_list, "AB123", 15, "Cluj-Napoca", "Madrid")
        assert False, "The duration must be over 15 minutes"
    except ValueError:
        assert True
        print("Test 6 done")

# test_add_flight()


def modify_duration_of_flight(flights, given_code, new_duration):
    for flight in flights:
        flight_code = get_code(flight)
        if flight_code == given_code:
            set_duration(flight, new_duration)
            return flight


def change_flight_destination(flights, initial_destination_city, new_destination_city):
    if len(new_destination_city) < 3:
        raise ValueError("The new destination city does not have length over 3 characters.")

    for flight in flights:
        current_flight_destination = get_destination_city(flight)
        if current_flight_destination == initial_destination_city:
            set_destination_city(flight, new_destination_city)


def show_all_flights_with_given_departure_city(flights, given_departure_city):
    selected_flights = []
    for flight in flights:
        flight_departure_city = get_departure_city(flight)
        if flight_departure_city == given_departure_city:
            selected_flights.append(flight)

    selected_flights.sort(key=lambda flight :(get_duration(flight)))
    return selected_flights
