import random


class Controller:
    def __init__(self, repository):
        self.repository = repository
        self.sentence = ""
        self.scrambled_sentence = ""
        self.score = 0

    def start_new_game(self):
        self.sentence = self.repository.get_random_sentence()
        self.scrambled_sentence = self._scramble_sentence(self.sentence)
        self.score = len(self.sentence.replace(" ", ""))
        return self.scrambled_sentence, self.score


    def _scramble_sentence(self, sentence):
        """
        Scrambles the letters of a given sentence, except for every word's starting and ending letters, which remain
        unchanged
        :param sentence: the sentence to scramble
        :return: the scrambled sentence
        """
        words = sentence.split()
        scrambled_words = []
        for word in words:
            if len(word) > 3:
                middle = list(word[1:-1])
                random.shuffle(middle)
                scrambled_word = word[0] + ''.join(middle) + word[-1]
            else:
                scrambled_word = word
            scrambled_words.append(scrambled_word)
        return ' '.join(scrambled_words)

    def swap_letters(self, word1_idx, letter1_idx, word2_idx, letter2_idx):
        """
        Swapping 2 letters from a word or different words
        :param word1_idx: the index of the first chosen word
        :param letter1_idx: the index of the first chosen letter to swap
        :param word2_idx: the index of the second chosen word
        :param letter2_idx: the index of the second chosen letter to swap
        :return: the new formed word after the swap of the 2 letters and the score decreased by one
        """
        words = self.scrambled_sentence.split()
        if word1_idx >= len(words) or word2_idx >= len(words):
            return "Error: Invalid word index!"
        if letter1_idx <= 0 or letter1_idx >= len(words[word1_idx]) - 1 or letter2_idx <= 0 or letter2_idx >= len(words[word2_idx]) - 1:
            return "Error: Invalid letter index!"

        words[word1_idx] = list(words[word1_idx])
        words[word2_idx] = list(words[word2_idx])

        aux = words[word1_idx][letter1_idx]
        words[word1_idx][letter1_idx] = words[word2_idx][letter2_idx]
        words[word2_idx][letter2_idx] = aux

        self.scrambled_sentence = ' '.join([''.join(word) for word in words])
        self.score -= 1
        return self.scrambled_sentence, self.score

    def check_victory(self):
        return self.scrambled_sentence == self.sentence

