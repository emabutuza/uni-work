def is_mountain(subset):
    if len(subset) < 3:
        return False

    peak_found = False
    for index in range(1, len(subset) - 1):
        if subset[index] > subset[index - 1] and subset[index] > subset[index + 1]:
            peak_found = True
            for before_peak in range(1, index):
                if subset[before_peak] <= subset[before_peak - 1]:
                    return False
            for after_peak in range(index + 1, len(subset)):
                if subset[after_peak] >= subset[after_peak - 1]:
                    return False
            return True
    return False

def find_all_mountain_subsets_iterative(given_sequence):
    result = []
    stack = [(0, [])]

    while stack:
        start, path = stack.pop()
        if is_mountain(path):
            result.append(path[:])
        for i in range(start, len(given_sequence)):
            stack.append((i + 1, path + [given_sequence[i]]))

    return result

# Example usage
given_sequence = [10, 16, 27, 18, 14, 7]
mountain_subsets = find_all_mountain_subsets_iterative(given_sequence)
for subset in mountain_subsets:
    print(subset)