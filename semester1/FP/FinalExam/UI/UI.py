class UI:
    def __init__(self, controller):
        self.controller = controller

    def start(self):
        scrambled_sentence, score = self.controller.start_new_game()
        print(f"Scrambled Sentence: {scrambled_sentence}")
        print(f"Score: {score}")

        while score > 0:
            user_input = input("Enter swap command: ")
            if user_input.startswith("swap"):
                try:
                    _, word1_id, letter1_id, _, word2_id, letter2_id = user_input.split()
                    word1_id = int(word1_id)
                    letter1_id = int(letter1_id)
                    word2_id = int(word2_id)
                    letter2_id = int(letter2_id)
                    result = self.controller.swap_letters(word1_id, letter1_id, word2_id, letter2_id)
                    if isinstance(result, str):
                        print(result)
                    else:
                        scrambled_sentence, score = result
                        print(f"Scrambled sentence: {scrambled_sentence}")
                        print(f"Score: {score}")
                        if self.controller.check_victory():
                            print("Victory! You have unscrambled the sentence!")
                            break
                except ValueError:
                    print("Error! Invalid command!")
            else:
                print("Error: Invalid command!")

        if score == 0:
            print("Defeat! Your score has reached 0!")
