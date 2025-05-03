from phone import *

def add_phone(phones, manufacturer, model, price):
    """
    Adds a new phone to the list of phones. Raises an exception if a field is invalid
    :param phones: The list of phones to which the new phone is added
    :param manufacturer:
    :param model:
    :param price:
    :return:
    """
    if len(manufacturer) < 3 or len(model) < 3:
        raise ValueError("Manufacturer and model must be at least 3 characters long.")

    new_phone = create_phone(manufacturer, model, price)
    phones.append(new_phone)


def test_add_phone():
    list = []
    add_phone(list, "Apple", "Iphone 13", 1200)
    assert list == [{"Manufacturer": "Apple", "Model": "Iphone 13", "Price": 1200}]
    print("Test 1 done")
    add_phone(list, "Samsung", "S24", 800)
    assert list == [{"Manufacturer": "Apple", "Model": "Iphone 13", "Price": 1200}, {"Manufacturer": "Samsung", "Model": "S24", "Price": 800}]
    print("Test 2 done")
# test_add_phone()


def find_all_phones_by_manufacturer(phones, manufacturer):
    matching_phones = []
    for phone in phones:
        if manufacturer.lower() in get_manufacturer(phone).lower():
            matching_phones.append(phone)
    return matching_phones


def increase_phone_price(phones, manufacturer, model, amount):
    for phone in phones:
        if get_manufacturer(phone) == manufacturer and get_model(phone) == model:
            new_phone_price = get_price(phone)
            new_phone_price += amount
            set_price(phone, new_phone_price)
            return phone
    raise ValueError("No phone found with the given manufacturer and model.")


def increase_all_phone_prices_with_percent(phones, percent):
    if percent < -50 or percent > 100:
        raise ValueError("The given percent value is not within the required bounds.")

    for phone in phones:
        phone_price = get_price(phone)
        percent_value = percent/100 * phone_price
        phone_price += percent_value
        set_price(phone, phone_price)
