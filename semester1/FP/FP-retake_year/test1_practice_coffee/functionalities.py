from coffee import *

def add_coffee(coffee_list, name, country_of_origin, price):
    """
    Adds a coffee to the list of coffees
    :param coffee_list:
    :param name:
    :param country_of_origin:
    :param price:
    :return:
    """
    if price <= 0:
        raise ValueError("Price must be greater than 0.")
    new_coffee = create_coffee(name, country_of_origin, price)
    coffee_list.append(new_coffee)


def display_all_coffees_sorted(coffee_list):
    # Sort alphabetically by country of origin and if countries are equal, sort increasingly by price
    coffee_list.sort(key=lambda coffee: (get_country(coffee), get_price(coffee)))
    return coffee_list

def filter_coffees(coffee_list, country_of_origin, price):
    filtered_coffees = []
    for coffee in coffee_list:
        coffee_country = get_country(coffee)
        coffee_price = get_price(coffee)
        if coffee_country == country_of_origin and coffee_price <= price:
            filtered_coffees.append(coffee)

    return filtered_coffees