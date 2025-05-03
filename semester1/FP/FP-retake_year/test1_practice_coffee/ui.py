from coffee import *
from functionalities import *

def add_coffee_ui(coffee_list):
    name = input("Enter coffee name: ")
    country_of_origin = input("Enter country of origin: ")
    price = float(input("Enter the price: "))

    try:
        add_coffee(coffee_list, name, country_of_origin, price)
    except ValueError as ve:
        print(ve)


def display_all_coffees_sorted_ui(coffee_list):
    sorted_coffee_list = display_all_coffees_sorted(coffee_list)
    for coffee in sorted_coffee_list:
        print(coffee)


def filter_coffees_ui(coffee_list):
    country_of_origin = input("Enter country of origin: ")
    price = float(input("Enter price: "))
    filtered_coffees = filter_coffees(coffee_list, country_of_origin, price)
    for coffee in filtered_coffees:
        print(coffee)


def coffee_shop():
    coffee_list = [
        create_coffee("Arabica", "Brazil", 3.5),
        create_coffee("Robusta", "Vietnam", 2.5),
        create_coffee("Liberica", "Philippines", 4.0),
        create_coffee("Excelsa", "Sierra Leone", 3.0),
        create_coffee("Arabica", "Costa Rica", 4.5)
    ]

    while True:
        print("Coffee shop")
        print("1. Add a coffee")
        print("2. Display all coffees sorted alphabetically by country of origin.")
        print("3. Filter coffees based on country of origin and price")
        print("0. Exit")

        choice = input(">")

        if choice == "1":
            add_coffee_ui(coffee_list)
        if choice == "2":
            display_all_coffees_sorted_ui(coffee_list)
        if choice == "3":
            filter_coffees_ui(coffee_list)
        elif choice == "0":
            print("Exiting program")
            break


coffee_shop()
