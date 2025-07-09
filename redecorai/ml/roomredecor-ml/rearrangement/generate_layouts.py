import random
import copy

def generate_rearranged_layouts(layout, num_versions=4):
    versions = []
    for _ in range(num_versions):
        new_layout = copy.deepcopy(layout)
        random.shuffle(new_layout)
        versions.append(new_layout)
    return versions
