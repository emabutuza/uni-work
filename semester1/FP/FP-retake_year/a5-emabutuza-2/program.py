#
# Write the implementation for A5 in this file
#

#
# Write below this comment
# Functions to deal with complex numbers -- list representation
# -> There should be no print or input statements in this section
# -> Each function should do one thing only
# -> Functions communicate using input parameters and their return values
#

REAL = 0
IMAGINARY = 1


def create_complex_list(real, imaginary):
    return [real, imaginary]

def get_real_part_list(complex_number):
    return complex_number[REAL]

def get_imaginary_part_list(complex_number):
    return complex_number[IMAGINARY]

def set_real_part_list(complex_number, real):
    complex_number[REAL] = real

def set_imaginary_part_list(complex_number, imaginary):
    complex_number[IMAGINARY] = imaginary

def to_string_list(complex_number):
    return f"{complex_number[REAL]} + {complex_number[IMAGINARY]}i"


#
# Write below this comment
# Functions to deal with complex numbers -- dict representation
# -> There should be no print or input statements in this section
# -> Each function should do one thing only
# -> Functions communicate using input parameters and their return values
#

def create_complex_dictionary(real, imaginary):
    return {'real': real, 'imaginary': imaginary}

def get_real_part_dictionary(complex_number):
    return complex_number['real']

def get_imaginary_part_dictionary(complex_number):
    return complex_number['imaginary']

def set_real_part_dictionary(complex_number, real):
    complex_number['real'] = real

def set_imaginary_part_dictionary(complex_number, imaginary):
    complex_number['imaginary'] = imaginary

def to_string_dictionary(complex_number):
    return f"{complex_number['real']} + {complex_number['imaginary']}i"


#
# Write below this comment
# Functions that deal with subarray/subsequence properties
# -> There should be no print or input statements in this section
# -> Each function should do one thing only
# -> Functions communicate using input parameters and their return values
#

#Set A
def longest_subarray_where_number_real_part_has_mountain_form(complex_list):
    length_of_initial_list = len(complex_list)
    if length_of_initial_list == 0:
        return 0, []

    max_length = 0
    start_index = 0

    for i in range(1, length_of_initial_list - 1):
        if complex_list[i - 1].real < complex_list[i].real > complex_list[i + 1].real:
            left = i - 1
            while left > 0 and complex_list[left - 1].real < complex_list[left].real:
                left -= 1

            right = i + 1
            while right < length_of_initial_list - 1 and complex_list[right].real > complex_list[right + 1].real:
                right += 1

            current_length = right - left + 1
            if current_length > max_length:
                max_length = current_length
                start_index = left

    if max_length == 0:
        return 0, []

    return max_length, complex_list[start_index:start_index + max_length]


#Set B - Dynamic programming
def longest_increasing_subsequence_by_numbers_real_part(given_sequence):
    if not given_sequence:
        return 0, []

    length = len(given_sequence)
    longest_increasing_subsequence_lengths = [1] * length  # Initializing LIS lengths with 1
    previous_indices = [-1] * length  # To track indices of previous elements in LIS

    for i in range(1, length):
        for j in range(i):
            if given_sequence[i].real > given_sequence[j].real and longest_increasing_subsequence_lengths[i] < longest_increasing_subsequence_lengths[j] + 1:
                longest_increasing_subsequence_lengths[i] = longest_increasing_subsequence_lengths[j] + 1
                previous_indices[i] = j

    maximum_length = max(longest_increasing_subsequence_lengths)
    maximum_index = longest_increasing_subsequence_lengths.index(maximum_length)

    longest_increasing_subsequence_elements = []
    while maximum_index != -1:
        longest_increasing_subsequence_elements.insert(0, given_sequence[maximum_index])
        maximum_index = previous_indices[maximum_index]

    return maximum_length, longest_increasing_subsequence_elements

#
# Write below this comment
# UI section
# Write all functions that have input or print statements here
# Ideally, this section should not contain any calculations relevant to program functionalities
#

def read_complex_number():
    real = int(input("Enter the real part: "))
    imaginary = int(input("Enter the imaginary part: "))
    return real, imaginary

def write_complex_number(complex_number, representation):
    if representation == "list":
        print("Complex Number (List):", to_string_list(complex_number))
    elif representation == "dict":
        print("Complex Number (Dict):", to_string_dictionary(complex_number))


def read_complex_list():
    complex_list = []
    number_count = int(input("Enter the number of complex numbers: "))

    for i in range(number_count):
        real = int(input(f"Enter real part of complex number {i + 1}: "))
        imaginary = int(input(f"Enter imaginary part of complex number {i + 1}: "))
        complex_list.append((real, imaginary))

    return complex_list

def write_complex_list_as_list(complex_list):
    print("Complex numbers (List representation):")
    for index, number in enumerate(complex_list):
        print(f"Complex number {index + 1}: {number[REAL]} + {number[IMAGINARY]}i")

def write_complex_list_as_dictionary(complex_list):
    print("Complex numbers (Dictionary representation):")
    for index, number in enumerate(complex_list):
        complex_dictionary = {"Real": number[REAL], "Imaginary": number[IMAGINARY]}
        print(f"Complex number {index + 1}: {complex_dictionary}")



def start():
    list_of_complex_numbers = []
    complex_list = [2+3j, 4+8j, 1+1j, 5+20j, 7+3j, 6+6j, 2+2j, 0+72j, 1+9j, 7+5j]

    while True:
        print("1. Enter a list of complex numbers")
        print("2. View the list of complex numbers")
        print("3. View length and elements of a longest subarray of numbers where their real part is in the form of a mountain.")
        print("4. View the length and elements of a longest increasing subsequence, when considering each number's real part ")
        print("0. Exit")

        enter_list = 1
        view_list = 2
        find_length_and_elements_of_longest_subarray_where_number_real_part_has_mountain_form = 3
        find_length_and_elements_of_longest_increasing_subsequence_considering_each_number_real_part = 4
        exit_program = 0


        option = int(input(">"))

        if option == enter_list:
            print("Reading a list of complex numbers:")
            list_of_complex_numbers = read_complex_list()
        elif option == view_list:
            write_complex_list_as_list(list_of_complex_numbers)
            #write_complex_list_as_dictionary(list_of_complex_numbers)
        elif option == find_length_and_elements_of_longest_subarray_where_number_real_part_has_mountain_form:
            print("Show the length and elements of a longest subarray of numbers where their "
                  "real part is in the form of a mountain.")
            length, subarray = longest_subarray_where_number_real_part_has_mountain_form(complex_list)
            print(f"Length of the longest subarray: {length}")
            print(f"Elements of the longest subarray: {subarray}")
        elif option == find_length_and_elements_of_longest_increasing_subsequence_considering_each_number_real_part:
            print("Show the length and elements of a longest increasing subsequence, "
                  "when considering each number's real part")
            length, the_longest_increasing_subsequence = longest_increasing_subsequence_by_numbers_real_part(complex_list)
            print(f"Length of the longest increasing subsequence: {length}")
            print(f"Elements of the longest increasing subsequence: {the_longest_increasing_subsequence}")
        elif option == exit_program:
            print("Program ended")
            break


start()
