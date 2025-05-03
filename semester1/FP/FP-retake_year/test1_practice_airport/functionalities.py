from flight import *


def add_flight(flights, code, duration, departure, destination):
    """
    Adds a new flight to the list of flight
    :param flights: The list of flights to which the new flight is added
    :param code: The code of the new flight
    :param duration: The duration of the new flight
    :param departure: The departure of the new flight
    :param destination: The destination of the new flight
    :return: None
    """
    if len(code) < 3 or len(departure) < 3 or len(destination) < 3:
        raise ValueError("The entered data does not match the requirements.")

    if duration < 20:
        raise ValueError("The flight duration must be at least 20 minutes.")

    new_flight = create_flight(code, duration, departure, destination)
    flights.append(new_flight)


def test_add_flight():
    flights = []
    add_flight(flights, "22AAE", 45, "Cluj-Napoca", "London")
    assert flights == [{'Code': '22AAE', 'Duration': 45, 'Departure_city': 'Cluj-Napoca', 'Destination_city': 'London'}]
    print("Test 1 passed")

    add_flight(flights, "ABC44", 60, "Cluj-Napoca", "Bucharest")
    assert flights == [{'Code': '22AAE', 'Duration': 45, 'Departure_city': 'Cluj-Napoca', 'Destination_city': 'London'},
                       {'Code': 'ABC44', 'Duration': 60, 'Departure_city': 'Cluj-Napoca',
                        'Destination_city': 'Bucharest'}]
    print("Test 2 passed")

    try:
        add_flight(flights, "AB", 60, "Cluj-Napoca", "Bucharest")
        assert False, "Expected ValueError for flight code length less than 3"
    except ValueError:
        print("Test 3 passed")

    try:
        add_flight(flights, "ABC", 15, "Cluj-Napoca", "Bucharest")
        assert False, "Expected ValueError for flight duration less than 20"
    except ValueError:
        print("Test 4 passed")

# test_add_flight()


def delete_flight(flights, code):
    """
    Deletes a flight with a given code from the flight list
    :param flights: the list of flights
    :param code: The code of the flight to delete
    :return:
    """
    for flight in flights:
        if get_code(flight) == code:
            flights.remove(flight)
            break
    else:
        raise ValueError("Flight with the given code does not exist")


def show_all_flights_by_departure_city(flights, departure_city):
    selected_flights = []
    for flight in flights:
        current_flight_departure = get_departure_city(flight)
        if current_flight_departure == departure_city:
            selected_flights.append(flight)

    # Sort the selected flights by destination city
    selected_flights.sort(key=lambda flight: get_destination_city(flight))
    return selected_flights

def increase_duration_of_flights_by_departure_city(flights, given_departure_city, minutes):
    if minutes < 10 or minutes > 60:
        raise ValueError("The given number of minutes is out of bounds.")

    for flight in flights:
        flight_departure_city = get_departure_city(flight)
        if flight_departure_city == given_departure_city:
            flight_duration = int(get_duration(flight))
            flight_duration += minutes
            set_duration(flight, flight_duration)
