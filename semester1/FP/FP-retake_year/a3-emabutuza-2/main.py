import timeit
import random
import copy

"""
Insert Sort Complexity:
    Best Case : O(N) - The best-case time complexity of Insertion Sort occurs when the input array is already sorted.
                     - each element is compared with its preceding elements until no swaps are needed, resulting in a linear time complexity.
    Average Case : O(N^2)
    Worst Case : O(N^2) - each element needs to be compared and possibly swapped with every preceding element, resulting in a quadratic time complexity.
                        - it occurs when the input array is in reverse sorted order.
"""

def insertSort(list_to_sort):
    for i in range(1, len(list_to_sort)):
        comparison_key = list_to_sort[i]
        position = i - 1

        while position >= 0 and comparison_key < list_to_sort[position]:
            list_to_sort[position + 1] = list_to_sort[position]
            position -= 1
        list_to_sort[position + 1] = comparison_key


"""
Stooge Sort Complexity:
    Stooge sort is independent of input data as it justs checks if first element is greater than the last element,
    It will check for every array position as long as the array size is 3 or greater.
    Even if the array is sorted stooge sort will run on it, hence it's time complexity remains same for every iteration of stooge sort.

    Best Case : O(N^2.709)
    Average Case : O(N^2.709)
    Worst Case : O(N^2.709)
"""

def stoogesort(list_to_sort, start, end):
    # Check if there are elements in the list
    if start >= end:
        return

    # Check first element with the last element
    if list_to_sort[start] > list_to_sort[end]:
        interchange = list_to_sort[start]
        list_to_sort[start] = list_to_sort[end]
        list_to_sort[end] = interchange

    # Check if the number of elements are more than 2
    if end - start + 1 > 2:
        third_of_list = (int)((end - start + 1) / 3)
        # Recursively call the parts of array to be sorted
        stoogesort(list_to_sort, start, (end - third_of_list))
        stoogesort(list_to_sort, start + third_of_list, (end))
        stoogesort(list_to_sort, start, (end - third_of_list))


def generate_random_list(random_list_length: int) -> list:
    random_list_generated = []

    for i in range(random_list_length):
        random_list_generated.append(random.randint(0, 100))

    return random_list_generated


def menu_application():
    while True:
        generate_list = '1'
        insert_sort = '2'
        stooge_sort = '3'
        best_case = '4'
        average_case = '5'
        worst_case = '6'
        exit = '0'

        print("\n    Sorting Algorithms")
        print(generate_list + ". Generate 5 lists of random numbers between 0 and 100.")
        print(insert_sort + ". Sort the first list using Insert Sort.")
        print(stooge_sort + ". Sort the first list using Stooge Sort.")
        print(best_case + ". Best case.")
        print(average_case + ". Average case.")
        print(worst_case + ". Worst case.")
        print(exit + ". Exit the program.")

        option = input("\n Choose an option from the list above: ")

        if option == generate_list:
            first_list_length = int(input("\n Enter the length of the first list: "))
            random_list_1 = generate_random_list(first_list_length)
            random_list_2 = generate_random_list(first_list_length * 2)
            random_list_3 = generate_random_list(first_list_length * 4)
            random_list_4 = generate_random_list(first_list_length * 8)
            random_list_5 = generate_random_list(first_list_length * 16)
            number_elements_1 = len(random_list_1)
            number_elements_2 = len(random_list_2)
            number_elements_3 = len(random_list_3)
            number_elements_4 = len(random_list_4)
            number_elements_5 = len(random_list_5)

            number_of_elements = [copy.deepcopy(number_elements_1),
                           copy.deepcopy(number_elements_2),
                           copy.deepcopy(number_elements_3),
                           copy.deepcopy(number_elements_4),
                           copy.deepcopy(number_elements_5)]

            print(f"\n    5 lists have been created, each list having twice as many elements as the previous one."
                  f"\n    Therefore, their lengths are "
                  f"{number_elements_1}, {number_elements_2}, {number_elements_3}, {number_elements_4} and {number_elements_5}.\n"
                  "\n List 1: ", random_list_1,
                  "\n List 2: ", random_list_2,
                  "\n List 3: ", random_list_3,
                  "\n List 4: ", random_list_4,
                  "\n List 5: ", random_list_5)

            copy_random_list_1 = copy.deepcopy(random_list_1)

        if option == exit:
            print("\n Exiting the program...")
            break

        elif option == insert_sort:
            sorted_list = insertSort(copy_random_list_1)
            print("\n The first list sorted by Insert Sort method is: ", sorted_list)
            copy_random_list_1 = copy.deepcopy(random_list_1)

        elif int(option) == stooge_sort:
            sorted_list = stoogesort(copy_random_list_1)
            print("\n The first list sorted by Stooge Sort method is: ", sorted_list)
            copy_random_list_1 = copy.deepcopy(random_list_1)

        elif option == best_case:
            print("\n\n     Best Case Complexity:\n")

            random_lists = [copy.deepcopy(random_list_1),
                            copy.deepcopy(random_list_2),
                            copy.deepcopy(random_list_3),
                            copy.deepcopy(random_list_4),
                            copy.deepcopy(random_list_5)]

            for i in range(5):
                random_lists[i].sort()

                start_timer_insert = timeit.default_timer()
                insertSort(random_lists[i])
                end_timer_insert = timeit.default_timer()
                best_sorting_time_insert = int((end_timer_insert - start_timer_insert) * (10 * 7)) / (10 * 4)

                print(f" Insert Sort: the list no. {i + 1}, having {number_of_elements[i]} elements, "
                      f"was sorted in {best_sorting_time_insert} milliseconds.")

                start_timer_stooge = timeit.default_timer()
                list_to_sort = random_lists[i]
                length_of_list = len(list_to_sort)
                stoogesort(list_to_sort, 0, length_of_list-1)
                end_timer_stooge = timeit.default_timer()
                best_sorting_time_heap = int((end_timer_stooge - start_timer_stooge) * (10 * 7)) / (10 * 4)

                print(f"     Stooge Sort: the list no. {i + 1}, having {number_of_elements[i]} elements, "
                      f"was sorted in {best_sorting_time_heap} milliseconds.")

        elif option == average_case:
            print("\n\n     Average Case Complexity:\n")

            random_lists = [copy.deepcopy(random_list_1),
                            copy.deepcopy(random_list_2),
                            copy.deepcopy(random_list_3),
                            copy.deepcopy(random_list_4),
                            copy.deepcopy(random_list_5)]

            for i in range(5):

                start_timer_insert = timeit.default_timer()
                insertSort(random_lists[i])
                end_timer_insert = timeit.default_timer()
                average_sorting_time_insert = int((end_timer_insert - start_timer_insert) * (10 * 7)) / (10 * 4)

                print(f" Insert Sort: the list no. {i + 1}, having {number_of_elements[i]} elements, "
                      f"was sorted in {average_sorting_time_insert} milliseconds.")

                start_timer_stooge = timeit.default_timer()
                list_to_sort = random_lists[i]
                length_of_list = len(list_to_sort)
                stoogesort(list_to_sort, 0, length_of_list-1)
                end_timer_stooge = timeit.default_timer()
                average_sorting_time_stooge = int((end_timer_stooge - start_timer_stooge) * (10 * 7)) / (10 * 4)

                print(f"     Stooge Sort: the list no. {i + 1}, having {number_of_elements[i]} elements, "
                      f"was sorted in {average_sorting_time_stooge} milliseconds.")

        elif option == worst_case:
            print("\n\n     Worst Case Complexity:\n")

            random_lists = [copy.deepcopy(random_list_1),
                            copy.deepcopy(random_list_2),
                            copy.deepcopy(random_list_3),
                            copy.deepcopy(random_list_4),
                            copy.deepcopy(random_list_5)]

            for i in range(5):
                random_lists[i].sort(reverse=True)

                start_timer_insert = timeit.default_timer()
                insertSort(random_lists[i])
                end_timer_insert = timeit.default_timer()
                worst_sorting_time_insert = int((end_timer_insert - start_timer_insert) * (10 * 7)) / (10 * 4)

                print(f" Insert Sort: the list no. {i + 1}, having {number_of_elements[i]} elements, "
                      f"was sorted in {worst_sorting_time_insert} milliseconds.")

                start_timer_stooge = timeit.default_timer()
                list_to_sort = random_lists[i]
                length_of_list = len(list_to_sort)
                stoogesort(list_to_sort, 0, length_of_list-1)
                end_timer_stooge = timeit.default_timer()
                worst_sorting_time_stooge = int((end_timer_stooge - start_timer_stooge) * (10 * 7)) / (10 * 4)

                print(f"     Stooge Sort: the list no. {i + 1}, having {number_of_elements[i]} elements, "
                      f"was sorted in {worst_sorting_time_stooge} milliseconds.")

"""
def main():
    generate_list = '1'
    insert_sort = '2'
    stooge_sort = '3'
    best_case = '4'
    average_case = '5'
    worst_case = '6'
    exit = '0'

    print("\n    Sorting Algorithms")
    print(generate_list + ". Generate 5 lists of random numbers between 0 and 100.")
    print(insert_sort + ". Sort the first list using Insert Sort.")
    print(stooge_sort + ". Sort the first list using Stooge Sort.")
    print(best_case + ". Best case.")
    print(average_case + ". Average case.")
    print(worst_case + ". Worst case.")
    print(exit + ". Exit the program.")
    
    menu_application()

main()
"""


menu_application()
