from texttable import Texttable
from functions import *


# This is the program's UI module. The user interface and all interaction with the user (print and input statements) are found here


def print_expenses(family_expenses):
    for expense in family_expenses:
        print(family_expenses[expense]["type"])
        print(f"  day:  {family_expenses[expense]["day"]}")
        print(f"  money:  {family_expenses[expense]["money"]}")
        print()


def print_command_table():
    table = Texttable()
    header = ["number", "command"]
    table.header(header)
    options = [
        ["1", "Add a new expense\n add <sum> <category>\n insert <day> <sum> <category>"],
        ["2", "Modify expenses\n remove <day> \n remove <start day> to <end day>\n remove <type>"],
        ["3", "Display expenses with different properties\n list\n list <category>\n list <category> [ < | = | > ] <value>"],
        ["4", "Filter expenses\n filter <category>\n filter <category> [ < | = | > ] <value>"],
        ["5", " Undo"],
        ["0", "Exit"]
    ]
    for option in options:
        table.add_row(option)
    print(table.draw())


def start_ui():
    backup_expenses = []
    current_day = 18
    family_expense = generate_random_expenses(current_day)
    add_a_new_expense = "add"
    insert_a_new_expense = "insert"
    remove_expense = "remove"
    list_expense_with_different_properties = "list"
    filter_expense = "filter"
    undo = "undo"
    exit = "exit"
    program_is_running = True
    while program_is_running:
        print_command_table()
        command = input("choose a command: ")
        if add_a_new_expense in command:
            previous_expenses = family_expense.copy()
            add_a_new_expense_function(family_expense, command, current_day)
            backup_expenses.append(previous_expenses)
            #print(family_expense)
            print("Expense added successfully!")
        if insert_a_new_expense in command:
            previous_expenses = family_expense.copy()
            insert_a_new_expense_function(family_expense, command, current_day)
            backup_expenses.append(previous_expenses)

            print("Expense inserted successfully!")
        elif remove_expense in command:
            backup_expenses.append(family_expense.copy())
            holding_new_data = remove_function(family_expense, command, current_day)
            if type(holding_new_data) != str:
                family_expense = holding_new_data
                print("Expense removed successfully!")
            else:
                print(f"Error: {holding_new_data}")

        elif list_expense_with_different_properties in command:
            if command == list_expense_with_different_properties:
                print_expenses(family_expense)
            else:
                new_data = custom_list_filter(family_expense, command, 5)
                if type(new_data) != str:
                    print(f"expense: {new_data["expense_1"]["type"]} - ({len(new_data)} expenses found)")
                    print()
                    for expense in new_data:
                        current_index = expense[-1]
                        print(f"  {current_index}")
                        print(f"  - day: {new_data[expense]["day"]}")
                        print(f"  - amount: {new_data[expense]["money"]}")
                        print()
                else:
                    print(f"Error: {new_data}")
        elif filter_expense in command:
            backup_expenses.append(family_expense.copy())
            new_data = custom_list_filter(family_expense, command, 7)
            if type(new_data) != str:
                family_expense = new_data
                print("Expenses filtered successfully!")
                print()
                print("The new data is: ")
                for expense in new_data:
                    print(new_data[expense])
            else:
                print(f"Error: {new_data}")
                backup_expenses.pop()
        elif command == undo:
            if len(backup_expenses) != 0:
                family_expense = backup_expenses[-1]
                backup_expenses.pop()
                print("Successful undo!")
            else:
                print("No more undo's left")
        elif command == exit:
            break
        else:
            pass