def create_flight(code, duration, departure_city, destination_city):
    """
    Function that creates a flight with the given parameters
    :param code: code of the flight
    :param duration: duration of the flight
    :param departure_city: departure city of the flight
    :param destination_city: destination city of the flight
    :return: A dictionary that contains the created flight
    """
    return {"code": code, "duration": duration, "departure_city": departure_city, "destination_city":destination_city}


def get_code(flight):
    return flight["code"]


def set_code(flight, new_code):
    flight["code"] = new_code


def get_duration(flight):
    return flight["duration"]


def set_duration(flight, new_duration):
    flight["duration"] = new_duration


def get_departure_city(flight):
    return flight["departure_city"]


def set_departure_city(flight, new_city):
    flight["departure_city"] = new_city


def get_destination_city(flights):
    return flights["destination_city"]


def set_destination_city(flight, new_city):
    flight["destination_city"] = new_city


def flight_to_string(flight):
    return f"Code: {flight['code']}, Duration: {flight['duration']}, Departure city: {flight['departure_city']}, Destination city: {flight['destination_city']}"
