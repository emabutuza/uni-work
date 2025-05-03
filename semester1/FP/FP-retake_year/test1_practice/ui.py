from functionalities import *
from phone import *


def add_phone_ui(phone_list):
    manufacturer = input("Enter the manufacturer: ")
    model = input("Enter the model: ")
    price = int(input("Enter the price: "))
    try:
        add_phone(phone_list, manufacturer, model, price)
    except ValueError as ve:
        print(ve)


def find_all_phones_by_manufacturer_ui(phone_list):
    manufacturer = input("Enter the manufacturer: ")
    matching_phones = find_all_phones_by_manufacturer(phone_list, manufacturer)
    for phone in matching_phones:
        print(phone)


def increase_phone_price_ui(phone_list):
    manufacturer = input("Enter the manufacturer: ")
    model = input("Enter the model: ")
    amount = int(input("Enter the amount with which you want to increase the price: "))
    try:
        phone = increase_phone_price(phone_list, manufacturer, model, amount)
        print(phone_to_string(phone))
    except ValueError as ve:
        print(ve)
    #print(phone_list)

def increase_all_phone_prices_with_percent_ui(phone_list):
    percent = int(input("Enter the percent with which you want to increase the prices: "))
    try:
        increase_all_phone_prices_with_percent(phone_list, percent)
        print(phone_list)
    except ValueError as ve:
        print(ve)


def phone_store():
    phone_list = [
        {'Manufacturer': 'Apple', 'Model': 'Iphone 13', 'Price': 1300},
        {'Manufacturer': 'Apple', 'Model': 'Iphone 15pro', 'Price': 1500},
        {'Manufacturer': 'Samsung', 'Model': 'S24', 'Price': 800},
        {'Manufacturer': 'Google', 'Model': 'Pixel 8', 'Price': 600},
        {'Manufacturer': 'Samsung', 'Model': 'Galaxy Note 20', 'Price': 1000}
    ]

    while True:
        print("Phone Store")
        print("1. Add a phone")
        print("2. Find all phones by a given manufacturer")
        print("3. Increase the price of a phone by a given amount")
        print("4. Increase the price of all phones with a given percent.")
        print("0. Exit")

        option = input(">")

        if option == "1":
            add_phone_ui(phone_list)
            print(phone_list)
        if option == "2":
            find_all_phones_by_manufacturer_ui(phone_list)
        if option == "3":
            increase_phone_price_ui(phone_list)
        if option == "4":
            increase_all_phone_prices_with_percent_ui(phone_list)
        elif option == "0":
            print("Exiting program")
            break


phone_store()
