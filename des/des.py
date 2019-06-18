import des_function

string = input("Введите сообщение: ")
input_key = input("Введите ключ: ")
print("**************************Encrypting*****************************")
blocks = des_function.cut_string_into_blocks(string)
result = ""
for i in range(len(blocks)):
    string = blocks[i]
    key = des_function.correct_key_word(input_key, 7)
    string = des_function.string_to_binary(string)
    key = des_function.string_to_binary(key)
    string = des_function.initial_permutation(string)
    string = des_function.encoder_decoder(string, key, True)
    string = des_function.final_permutation(string)
    string = des_function.binary_to_string(string)
    result += string
data = result
print("Encrypted message:", data)
print("Encryption is done!")


print("**************************Decrypting*****************************")
string = data
blocks = des_function.cut_string_into_blocks(string)
result = ""
for i in range(len(blocks)):
    string = blocks[i]
    key = des_function.correct_key_word(input_key, 7)
    string = des_function.string_to_binary(string)
    key = des_function.string_to_binary(key)
    string = des_function.initial_permutation(string)
    string = des_function.encoder_decoder(string, key, False)
    string = des_function.final_permutation(string)
    string = des_function.binary_to_string(string)
    result += string
data = result
print("Decrypted message:", data)
print("Decryption is done!")
