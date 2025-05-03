#Implementation of the insertion sort algorithm
def insertSort(list_to_sort, step: int):
    step_counter = 0
    number_of_steps = 1
    for i in range(1, len(list_to_sort)):
        comparison_key = list_to_sort[i]
        position = i - 1

        while position >= 0 and comparison_key < list_to_sort[position]:
            list_to_sort[position + 1] = list_to_sort[position]
            position -= 1
        list_to_sort[position + 1] = comparison_key
        step_counter += 1
        if (step_counter == step):
            print("(List sorted after:", step * number_of_steps, "steps.)")
            print(list_to_sort)
            number_of_steps += 1
            step_counter = 0


#Implementation of the stooge sort algorithm
def stoogeSort(list_to_sort: list, start, end, step: int, number_of_steps: int, step_counter: int):
    if step_counter == step:
        print("(List sorted after:", step * number_of_steps, "steps.)")
        print(list_to_sort)
        number_of_steps += 1
        step_counter = 0
    else:
        step_counter += 1

    if start >= end:
        return

    # If first element is smaller than last, swap them
    if list_to_sort[start] > list_to_sort[end]:
        interchange = list_to_sort[start]
        list_to_sort[start] = list_to_sort[end]
        list_to_sort[end] = interchange

    # If there are more than 2 elements in the array
    if end - start + 1 > 2:
        third = (int)((end - start + 1) / 3)

        # Recursively sort first 2 / 3 elements
        stoogeSort(list_to_sort, start, (end - third), step, number_of_steps, step_counter)

        # Recursively sort last 2 / 3 elements
        stoogeSort(list_to_sort, start + third, end, step, number_of_steps, step_counter)

        # Recursively sort first 2 / 3 elements again to confirm
        stoogeSort(list_to_sort, start, (end - third), step, number_of_steps, step_counter)


#Check if a list is sorted
def is_sorted(list_to_sort):
    length_of_list = len(list_to_sort)
    for i in range(0, length_of_list - 1):
        if (list_to_sort[i] > list_to_sort[i + 1]):
            return False
    return True


#Do a binary search
def binarySearch(list_to_search, value: int):
    error = -1
    start = 0
    end = len(list_to_search) - 1
    while start <= end:
        middle = start + (end - start) // 2

        if list_to_search[middle] == value:
            return middle
        elif list_to_search[middle] < value:
            start = middle + 1
        else:
            end = middle - 1
    return error


while True:
    generate_list = '1'
    search_binary = '2'
    insert_sort = '3'
    stooge_sort = '4'
    exit = '0'

    print(generate_list + ". Generate a list of n random natural numbers.")
    print(search_binary + ". Search for an item in the list using binary search.")
    print(insert_sort + ". Sort the list using insert sort.")
    print(stooge_sort + ". Sort the list using stooge sort.")
    print(exit + ". Exit")

    command = input(">>>")
    command = command.strip()
    if command == generate_list:
        number_of_elements = int(input("Enter the number of elements: "))
        import random

        list_to_sort = []
        copy_list_for_second_sort = []

        for i in range(0, number_of_elements):
            random_number = random.randint(1, 100)
            list_to_sort.append(random_number)
            copy_list_for_second_sort.append(random_number)
        print("The random unsorted list: ")
        print(list_to_sort)
    elif command == search_binary:
        if is_sorted(list_to_sort):
            value_insert = int(input("Enter the value you want to search for: "))
            if binarySearch(list_to_sort, value_insert):
                print("Element found")
            else:
                print("Element not found")
        else:
            print("List must be sorted first")
    elif command == insert_sort:
        step_insert = int(input("Enter step for the Insertion Sort: "))
        insertSort(list_to_sort, step_insert)
        print("The sorted list with Insertion Sort:")
        print(list_to_sort)
    elif command == stooge_sort:
        list_to_sort = copy_list_for_second_sort
        step_stooge = int(input("Enter step for Stooge Sort: "))
        length_of_list = len(list_to_sort)
        stoogeSort(list_to_sort, 0, length_of_list - 1, step_stooge, 1, 0)
        print("The sorted list with Stooge Sort:")
        print(list_to_sort)
    elif command == exit:
        break


