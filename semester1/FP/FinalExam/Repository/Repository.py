import random

class Repository:
    def __init__(self, file_path):
        self.file_path = file_path
        self.sentences = self._load_sentences()

    def _load_sentences(self):
        """
        Loading the sentences from the input file
        :return: the sentences from the file
        """
        with open(self.file_path, 'r') as file:
            return [line.strip() for line in file]

    def get_random_sentence(self):
        """
        Selects a random sentence from the file
        :return: a random sentence from the file
        """
        return random.choice(self.sentences)
