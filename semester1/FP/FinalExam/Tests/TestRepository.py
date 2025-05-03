import unittest

from Repository.Repository import Repository


class TestRepository(unittest.TestCase):
    def setUp(self):
        self.repo = Repository('../input.txt')

    def test_get_random_sentence(self):
        sentence = self.repo.get_random_sentence()
        self.assertIn(sentence, self.repo.sentences)

if __name__ == "__main__":
    unittest.main()
