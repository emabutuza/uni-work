def find_subsets_with_minimum_difference_iterative(given_sequence):
    from itertools import combinations

    total_sum = sum(given_sequence)
    minimum_difference = float('inf')
    best_partition = ([], [])

    for subset_length in range(len(given_sequence) + 1):
        for subset in combinations(given_sequence, subset_length):
            subset1 = list(subset)
            subset2 = [item for item in given_sequence if item not in subset1]
            current_difference = abs(sum(subset1) - sum(subset2))
            if current_difference < minimum_difference:
                minimum_difference = current_difference
                best_partition = (subset1, subset2)

    return best_partition


# Example usage
given_sequence = [1, 2, 3, 4, 5]
subset1, subset2 = find_subsets_with_minimum_difference_iterative(given_sequence)
print("Subset 1:", subset1)
print("Subset 2:", subset2)