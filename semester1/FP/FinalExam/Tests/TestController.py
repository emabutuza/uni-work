import unittest

from Controller.Controller import Controller
from Repository.Repository import Repository


class TestController(unittest.TestCase):
    def setUp(self):
        self.repo = Repository('../input.txt')
        self.controller = Controller(self.repo)
        self.controller.sentence = "dream without fear"
        self.controller.scrambled_sentence = "daerm wtuhoit fear"
        self.controller.score = 16

    def test_swap_letters_valid(self):
        result = self.controller.swap_letters(0, 1, 1, 1)
        self.assertEqual(result, ("dterm wauhoit fear", 15))

    def test_swap_letters_invalid_word_index(self):
        result = self.controller.swap_letters(0, 1, 3, 1)
        self.assertEqual(result, "Error: Invalid word index!")

    def test_swap_letters_invalid_letter_index(self):
        result = self.controller.swap_letters(0, 0, 1, 1)
        self.assertEqual(result, "Error: Invalid letter index!")


if __name__ == "__main__":
    unittest.main()
