def create_coffee(name, country_of_origin, price):
    return {"name": name, "country_of_origin": country_of_origin, "price": price}


def get_name(coffee_list):
    return coffee_list["name"]


def set_name(coffee_list, new_name):
    coffee_list["name"] = new_name


def get_country(coffee_list):
    return coffee_list["country_of_origin"]


def set_country(coffee_list, new_country):
    coffee_list["coountry_of_origin"] = new_country


def get_price(coffee_list):
    return coffee_list["price"]


def set_price(coffee_list, new_price):
    coffee_list["price"] = new_price


def coffee_to_string(coffee_list):
    return f"Name: {coffee_list['name']}, Country: {coffee_list['country_of_origin']}, Price: {coffee_list['price']}"