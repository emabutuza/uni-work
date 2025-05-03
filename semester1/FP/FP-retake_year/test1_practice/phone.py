def create_phone(manufacturer, model, price):
    """
    Creates a phone entity with the given parameters
    :param manufacturer:
    :param model:
    :param price:
    :return: A dictionary representing the phone
    """
    return {"Manufacturer": manufacturer, "Model": model, "Price": price}


def get_manufacturer(phone):
    """
    Retrieves the manufacturer of the phone
    """
    return phone["Manufacturer"]


def set_manufacturer(phone, new_manufacturer):
    """
    Sets the manufacturer of the phone
    """
    phone["Manufacturer"] = new_manufacturer


def get_model(phone):
    """
    Retrieves the model of the phone
    """
    return phone["Model"]


def set_model(phone, new_model):
    """
    Sets the model of the phone
    """
    phone["Model"] = new_model


def get_price(phone):
    """
    Retrieves the price of the phone
    :param phone:
    :return:
    """
    return phone["Price"]


def set_price(phone, new_price):
    """
    Sets the price of the phone to <new_price>
    """
    phone["Price"] = new_price


def phone_to_string(phone):
    """
    Converts the phone entity to a string format
    """
    return f"Manufacturer: {phone['Manufacturer']}, Model: {phone['Model']}, Price: {phone['Price']}"