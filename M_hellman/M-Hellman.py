import random
from math import sqrt
from math import gcd


def generate_key(N):
    w = []
    for i in range(0, N):
        if i == 0:
            w.append(random.randint(2, 10))
        elif i == 1:
            w.append(random.randint(w[i-1]+1, w[i-1]+10))
        else:
            thesum = 0
            for i in w:
                thesum = thesum + i

            w.append(random.randint(thesum + 1, thesum + 10))
    print("Generated key W: " + str(w))
    # находим сумму
    sum_w = 0
    for i in w:
        sum_w += i
    print("Sum key W: " + str(sum_w))
    # находим простое число бльше sum_w
    q = sum_w
    while simple_numbers(q) != True:
        q = q + 1
    print("Q: " + str(q))

    while True:
        r = random.randint(2, q)
        if gcd(r, q) == 1:  # находим наибольший общий делитель
            r = r
            break

    print("R: " + str(r))
    # открытый ключ
    beta = []
    for i in range(0, 8):
        beta.append(w[i] * r % q)
    print("Open key Betta: " + str(beta))
    return w, q, r, beta


def simple_numbers(n):

    for i in range(2, int(sqrt(n))):
        if (n % i) == 0:
            return False
    return True


def encryption():
    print("***********************encrypting*******************************")
    message = input("Enter data: ")
    N = len(message)
    message_bin = []
    message = list(message)
    message = [bin(ord(message)) for message in message]
    for i in message:
        if len(i) < 9:
            message_bin.append(i.replace("0b", "00"))
        else:
            message_bin.append(i.replace("b", ""))
    message_bin = [list(message_bin) for message_bin in message_bin]

    print("Input data binary: " + str(message_bin))

    w, q, r, beta = generate_key(8)
    #кодируем символы
    result = []
    res = 0
    for i in range(0, N):
        for j in range(0, 8):
            res = res + int(message_bin[i][j]) * beta[j]
        result.append(res)
        res = 0
    print("Cryptotext array" + str(result))
    return result, w, q, r, N

#мультипликативное обратное число по модулю
def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    else:
        g, x, y = egcd(b % a, a)
        return (g, y - (b // a) * x, x)


# x = mulinv(b) mod n, (x * b) % n == 1
def mulinv(b, n):
    g, x, _ = egcd(b, n)
    if g == 1:
        return x % n


def decryption(result, w, q, r):
    print("***********************decrypting*****************************")
    mult = mulinv(r, q)

    mult = int(mult)

    print("Inverse number r: " + str(mult))
    decrypt = []
    for i in range(N):
        decrypt.append(result[i] * mult % q)
    print("DecryptoTextArray: " + str(decrypt))

    tmp = []
    for i in range(N):
        tmp.append(w[:])

    for j in range(0, N):
        for i in range(7, -1, -1):
            if decrypt[j] >= w[i]:
                decrypt[j] = decrypt[j] - w[i]
                tmp[j][i] = 1
            else:
                tmp[j][i] = 0

    for i in range(N):
        for j in range(8):
            tmp[i][j] = str(tmp[i][j])
        tmp[i] = ''.join(tmp[i])
    res_str = ""
    print("DecryptoBinaryArray: ", tmp)
    for i in range(N):
        res_str = res_str + chr((int(tmp[i], 2)))
    print("Исходный текст: ", res_str)


enc, w, q, r, N = encryption()


decryption(enc, w, q, r)
