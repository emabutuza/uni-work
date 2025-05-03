def create_flight(code, duration, departure_city, destination_city):
    """
    Creates a flight with the given parameters
    :param code:
    :param duration:
    :param departure_city:
    :param destination_city:
    :return: A dictionary representing the flight
    """
    return {"Code": code, "Duration": duration, "Departure_city": departure_city, "Destination_city": destination_city}


def get_code(flight):
    return flight["Code"]

def set_code(flight, new_code):
    flight["Code"] = new_code

def get_duration(flight):
    return flight["Duration"]

def set_duration(flight, new_duration):
    flight["Duration"] = new_duration

def get_departure_city(flight):
    return flight["Departure_city"]

def set_departure_city(flight, new_city):
    flight["Departure_city"] = new_city

def get_destination_city(flight):
    return flight["Destination_city"]

def set_destination_city(flight, new_city):
    flight["Destination_city"] = new_city

def flight_to_string(flight):
    return (f"Code: {flight['Code']}, Duration: {flight['Duration']}, Departure city: {flight['Departure_city']},"
            f"Destination city: {flight['Destination_city']}")