#
# The program's functions are implemented here. There is no user interaction in this file, therefore no input/print statements. Functions here
# communicate via function parameters, the return statement and raising of exceptions.
#
from random import randint
from random import choice


def create_expense(family_expenses, day, money, expense_type):
    """
    the function creates a new expense
    :param family_expenses: dictionary containing every expense with its type, day and cost
    :param day: day in which the expense took place
    :param money: the cost of the expense
    :param expense_type: the category of the expense, ex: food, travel, internet
    """
    next_index = len(family_expenses) + 1
    family_expenses[f"expense_{next_index}"] = {
        "day": day,
        "money": int(money),
        "type": expense_type
    }


def generate_random_expenses(current_day):
    """
    the function generates a dictionary with 10 expenses, containing the type, day and cost
    :param current_day: day of the month in which the user is
    :return: a dictionary with 10 expenses, containing the type, day and cost
    """
    family_expenses = {}
    expense_types = [
        "food",
        "clothing",
        "housekeeping",
        "internet",
        "transport",
        "holidays",
        "maintenance"
    ]
    first_day = 1
    lowest_sum = 1
    maximum_amount_of_money = 1000
    number_of_initial_expenses = 10
    for i in range(number_of_initial_expenses):
        day = randint(first_day, current_day)
        money = randint(lowest_sum, maximum_amount_of_money)
        expense_type = choice(expense_types)
        create_expense(family_expenses, day, money, expense_type)

    return family_expenses


def add_a_new_expense_function(family_expenses, command, current_day):
    """
    the function adds a new expense at the end of the dictionary
    :param family_expenses: dictionary containing every expense with its type, day and cost
    :param command: command given by the user, the instruction the function has to follow
    :param current_day: day of the month in which the user is
    """
    keyword_position = 4
    command = command[keyword_position:]
    sum_and_category = command.split()
    money = int(sum_and_category[0])
    expense_type = sum_and_category[1]
    create_expense(family_expenses, current_day, money, expense_type)


def insert_a_new_expense_function(family_expense, command, current_day):
    """
    the function inserts a new expense in the dictionary, in a certain position
    :param family_expense: dictionary containing every expense with its type, day and cost
    :param command: command given by the user, the instruction the function has to follow
    :param current_day: day of the month in which the user is
    :return: returns a string containing the error, only if there is one
    """
    try:
        lowest_money_value = lowest_day = 1
        keyword_position = 7
        command = command[keyword_position:]
        day_sum_category = command.split()
        number_of_required_words = 3
        if len(day_sum_category) != number_of_required_words:
            raise ValueError("invalid command")
        day = int(day_sum_category[0])
        money = int(day_sum_category[1])
        expense_type = day_sum_category[2]
        if day > current_day or day < lowest_day:
            raise ValueError("invalid day")
        if money < lowest_money_value:
            raise ValueError("invalid sum")
        create_expense(family_expense, day, money, expense_type)
    except ValueError as error:
        return f"{error}"


def eliminate_expenses_from_dictionary(family_expense, to_remove, elimination_day_or_type):
    """
    the function creates a new dictionary with the correct data, without the expenses from a certain day or category
    imputed by the user
    :param family_expense: dictionary containing every expense with its type, day and cost
    :param to_remove: the day or category belonging to the expenses that will be removed
    :param elimination_day_or_type: day or type
    :return: updated dictionary after eliminating expenses
    """
    updated_data = {}
    start_original_expense = 1
    end_original_expense = len(family_expense) + 1
    for i in range(start_original_expense, end_original_expense):
        if family_expense[f"expense_{i}"][elimination_day_or_type] != to_remove:
            create_expense(updated_data, family_expense[f"expense_{i}"]["day"], family_expense[f"expense_{i}"]["money"], family_expense[f"expense_{i}"]["type"])
    return updated_data


def eliminate_expenses_from_dictionary_start_to_end(family_expense, start_index_day, end_index_day):
    """
    eliminates all expenses from dictionary between the start day and the end day
    :param family_expense: dictionary containing every expense with its type, day and cost
    :param start_index_day: first day from which to remove expenses from dictionary
    :param end_index_day: last day from which to remove expenses from dictionary
    :return: the updated dictionary after eliminating expenses
    """
    updated_data = {}
    start_original_expense = 1
    end_original_expense = len(family_expense)+1
    for i in range(start_original_expense, end_original_expense):
        if start_index_day > family_expense[f"expense_{i}"]["day"] or family_expense[f"expense_{i}"]["day"]  > end_index_day:
            create_expense(updated_data, family_expense[f"expense_{i}"]["day"], family_expense[f"expense_{i}"]["money"], family_expense[f"expense_{i}"]["type"])
    return updated_data


def remove_function(family_expense, command, current_day):
    """
    the function removes the expenses from a certain day or category imputed by the user
    :param family_expense: dictionary containing every expense with its type, day and cost
    :param command: command given by the user, the instruction the function has to follow
    :param current_day: day of the month in which the user is
    :return: returns a string containing the error, only if there is one
    """
    try:
        length_day_or_type = 1
        length_interval = 3
        keyword_position = 7
        command = command[keyword_position:]
        day_type_or_interval = command.split()
        if len(day_type_or_interval) == length_day_or_type:
            to_remove = day_type_or_interval[0]
            to_remove.strip()
            if to_remove.isdigit():
                to_remove = int(to_remove)
                if to_remove <= current_day:
                    family_expense = eliminate_expenses_from_dictionary(family_expense, to_remove, "day")
                else:
                    raise ValueError("day must be lower then the current day")
            else:
                family_expense = eliminate_expenses_from_dictionary(family_expense, to_remove, "type")
        elif len(day_type_or_interval) == length_interval:
            start_day = day_type_or_interval[0]
            end_day = day_type_or_interval[2]
            connecting_word = day_type_or_interval[1]
            to_word = "to"
            if start_day.isdigit() and end_day.isdigit() and connecting_word == to_word:
                start_day = int(start_day)
                end_day = int(end_day)
                family_expense = eliminate_expenses_from_dictionary_start_to_end(family_expense, start_day, end_day)
            else:
                raise ValueError("invalid command")
        else:
            raise ValueError("invalid command")
        return family_expense
    except ValueError as error:
        return f"{error}"


def custom_list_filter(family_expenses, command, keyword_position_length):
    """
    the function filters the list according to the user input
    :param family_expenses: dictionary containing every expense with its type, day and cost
    :param command: command given by the user, the instruction the function has to follow
    :param keyword_position_length: the length of the key words of the "filter" and "list"
    :return: returns a string containing the error, only if there is one
    """
    try:
        possible_signs = "< > ="
        exists_expense_type = False
        new_expense_data = {}
        command = command[keyword_position_length:]
        filter_parts = command.split()
        there_is_1_element_in_the_list_filter_parts = 1
        there_are_3_elements_in_the_list_filter_parts = 3
        if len(filter_parts) == there_is_1_element_in_the_list_filter_parts:
            to_keep = filter_parts[0]
            to_keep.strip()
            for expenses in family_expenses:
                if family_expenses[expenses]["type"] == to_keep:
                    exists_expense_type = True
                    new_element_number = len(new_expense_data)+1
                    create_expense(new_expense_data,
                                   family_expenses[expenses]["day"],
                                   family_expenses[expenses]["money"],
                                   family_expenses[expenses]["type"])
            if not exists_expense_type:
                raise ValueError("no such expense")

        elif len(filter_parts) == there_are_3_elements_in_the_list_filter_parts:
            maximum_or_minimum_expense = filter_parts[2]
            sign = filter_parts[1]
            type_of_expense = filter_parts[0]
            if maximum_or_minimum_expense.isdigit() and sign in possible_signs:
                maximum_or_minimum_expense = int(maximum_or_minimum_expense)
                for expense in family_expenses:
                    if family_expenses[expense]["type"] == type_of_expense:
                        if sign == "<":
                            if family_expenses[expense]["money"] < maximum_or_minimum_expense:
                                create_expense(new_expense_data,
                                               family_expenses[expense]["day"],
                                               family_expenses[expense]["money"],
                                               family_expenses[expense]["type"])
                        elif sign == ">":
                            if family_expenses[expense]["money"] > maximum_or_minimum_expense:
                                create_expense(new_expense_data,
                                               family_expenses[expense]["day"],
                                               family_expenses[expense]["money"],
                                               family_expenses[expense]["type"])
                        elif sign == "=":
                            if family_expenses[expense]["money"] == maximum_or_minimum_expense:
                                create_expense(new_expense_data,
                                               family_expenses[expense]["day"],
                                               family_expenses[expense]["money"],
                                               family_expenses[expense]["type"])
                        else:
                            raise ValueError("Not a valid operand")
            else:
                raise ValueError("invalid command")
        else:
            raise ValueError("invalid command")
        return new_expense_data
    except ValueError as error:
        return f"{error}"
