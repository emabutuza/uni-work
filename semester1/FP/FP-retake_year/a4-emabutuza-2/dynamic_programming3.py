def find_subsets_with_minimum_difference_dynamic(given_sequence):
    total_sum = sum(given_sequence)
    number_of_elements = len(given_sequence)
    sum_matrix = [[False for _ in range(total_sum // 2 + 1)] for _ in range(number_of_elements + 1)]

    for element in range(number_of_elements + 1):
        sum_matrix[element][0] = True

    for element in range(1, number_of_elements + 1):
        for step_sum in range(1, total_sum // 2 + 1):
            sum_matrix[element][step_sum] = sum_matrix[element - 1][step_sum]
            if given_sequence[element - 1] <= step_sum:
                sum_matrix[element][step_sum] = sum_matrix[element][step_sum] or sum_matrix[element - 1][step_sum - given_sequence[element - 1]]
        #print(sum_matrix)

    for row in sum_matrix:
        print(row)

    # find the elements that form the subsets
    subset1 = []
    subset2 = given_sequence[:]
    subset_sum = step_sum
    for element in range(number_of_elements, 0, -1):
        if not sum_matrix[element - 1][subset_sum] and (subset_sum == 0 or sum_matrix[element - 1][subset_sum - given_sequence[element - 1]]):
            subset1.append(given_sequence[element - 1])
            subset2.remove(given_sequence[element - 1])
            subset_sum -= given_sequence[element - 1]

    return subset1, subset2


# Example usage
given_sequence = [1, 2, 3, 4, 5]
subset1, subset2 = find_subsets_with_minimum_difference_dynamic(given_sequence)
print("")
print("Subset 1:", subset1)
print("Subset 2:", subset2)
