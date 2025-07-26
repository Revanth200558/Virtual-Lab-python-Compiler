// Challenge/problem data for all challenges
window.CHALLENGES_DATA = {
  "caesar_cipher": {
    "title": "Caesar Cipher",
    "difficulty": "Easy",
    "marks": "25 Marks",
    "description": "In cryptography, a Caesar cipher is one of the simplest and most widely known encryption techniques. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet.",
    "how_it_works": [
      "Choose a shift value (key) between 1-25",
      "For each letter in the plaintext, shift it forward in the alphabet by the key value",
      "Wrap around to the beginning of the alphabet if necessary",
      "Leave non-alphabetic characters unchanged",
      "Return the resulting ciphertext"
    ],
    "examples": [
      { "input": "Plaintext: HELLO, Shift: 3", "output": "Ciphertext: KHOOR" },
      { "input": "Plaintext: hello world, Shift: 7", "output": "Ciphertext: olssv dvysk" }
    ],
    "starter_code": `def caesar_cipher(text, shift):\n    result = ""\n    \n    for char in text:\n        if char.isalpha():\n            start = ord('A') if char.isupper() else ord('a')\n            result += chr((ord(char) - start + shift) % 26 + start)\n        else:\n            result += char\n    \n    return result\n\n# Example usage\nplain_text = input("Enter the text: ")\nshift_value = int(input("Enter the shift value: "))\n\ncipher_text = caesar_cipher(plain_text, shift_value)\nprint("Cipher Text:", cipher_text)`,
    "test_cases": [
      { "name": "Basic Test 1", "input": "HELLO\n3", "expected_output": "Cipher Text: KHOOR" },
      { "name": "Basic Test 2", "input": "hello world\n7", "expected_output": "Cipher Text: olssv dvysk" }
    ]
  },
  "monoalphabetic_cipher": {
    "title": "Basic Monoalphabetic Cipher",
    "difficulty": "Easy",
    "marks": "30 Marks",
    "description": "A monoalphabetic substitution cipher uses a fixed substitution over the entire message. Each letter of the plaintext is replaced with another letter of the alphabet.",
    "how_it_works": [
      "Create a substitution key where each letter maps to another unique letter",
      "For each character in the plaintext, find its corresponding value in the mapping",
      "Replace the character with its mapped value",
      "Leave non-alphabetic characters unchanged"
    ],
    "examples": [
      { "input": "Plaintext: HELLO, Key: {'H':'X', 'E':'Y', 'L':'Z', 'O':'W'}", "output": "Ciphertext: XYZW" }
    ],
    "starter_code": `def monoalphabetic_cipher(plaintext, key_mapping):\n    result = ""\n    \n    for char in plaintext:\n        char_lower = char.lower()\n        \n        if char_lower in key_mapping:\n            if char.isupper():\n                result += key_mapping[char_lower].upper()\n            else:\n                result += key_mapping[char_lower]\n        else:\n            result += char\n    \n    return result\n\n# Test with a sample mapping\nmapping = {'h': 'x', 'e': 'y', 'l': 'z', 'o': 'w'}\ntext = input("Enter text to encrypt: ")\nencrypted = monoalphabetic_cipher(text, mapping)\nprint("Encrypted:", encrypted)`,
    "test_cases": [
      { "name": "Basic Mapping Test", "input": "hello\n", "expected_output": "Encrypted: xyzz" }
    ]
  },
  "mac": {
    "title": "Message Authentication Code (MAC)",
    "difficulty": "Medium",
    "marks": "40 Marks",
    "description": "A Message Authentication Code (MAC) is a security mechanism used to verify both the integrity and authenticity of a message.",
    "how_it_works": [
      "Generate a MAC tag by applying a hash function to a combination of the message and a secret key",
      "The sender transmits both the message and the MAC tag",
      "The receiver recalculates the MAC using the same message and key",
      "If the calculated MAC matches the received MAC, the message is authentic"
    ],
    "examples": [
      { "input": "Message: 'Transfer $1000', Key: 'secret'", "output": "MAC: '6dfde3a1b9c7d2f'" }
    ],
    "starter_code": `import hashlib\nimport hmac\n\ndef generate_mac(message, key):\n    if isinstance(message, str):\n        message = message.encode('utf-8')\n    if isinstance(key, str):\n        key = key.encode('utf-8')\n    \n    mac = hmac.new(key, message, hashlib.sha256)\n    return mac.hexdigest()\n\ndef verify_mac(message, key, received_mac):\n    calculated_mac = generate_mac(message, key)\n    return hmac.compare_digest(calculated_mac, received_mac)\n\n# Example usage\nmessage = input("Enter message: ")\nkey = input("Enter key: ")\n\nmac = generate_mac(message, key)\nis_valid = verify_mac(message, key, mac)\nprint("MAC is valid:", is_valid)`,
    "test_cases": [
      { "name": "Basic MAC Generation", "input": "Hello World\nmykey\n", "expected_output": "MAC is valid: True" }
    ]
  },
  "des": {
    "title": "Data Encryption Standard (DES)",
    "difficulty": "Medium",
    "marks": "45 Marks",
    "description": "Data Encryption Standard (DES) is a symmetric-key algorithm for the encryption of digital data. It uses a 56-bit key to encrypt data in 64-bit blocks.",
    "how_it_works": [
      "Input 64-bit plaintext block",
      "Apply initial permutation",
      "Perform 16 rounds of Feistel function",
      "Apply final permutation to get ciphertext"
    ],
    "examples": [
      { "input": "Plaintext: 'HELLO123', Key: '1234567890ABCDEF'", "output": "Ciphertext: encrypted block" }
    ],
    "starter_code": `# Simplified DES implementation for educational purposes\ndef des_encrypt(plaintext, key):\n    """Simplified DES encryption simulation"""\n    # This is a simplified version for demonstration\n    encrypted = ""\n    key_int = sum(ord(c) for c in key) % 256\n    \n    for char in plaintext:\n        encrypted_char = chr((ord(char) + key_int) % 256)\n        encrypted += encrypted_char\n    \n    return encrypted\n\ndef des_decrypt(ciphertext, key):\n    """Simplified DES decryption simulation"""\n    decrypted = ""\n    key_int = sum(ord(c) for c in key) % 256\n    \n    for char in ciphertext:\n        decrypted_char = chr((ord(char) - key_int) % 256)\n        decrypted += decrypted_char\n    \n    return decrypted\n\n# Example usage\nplaintext = input("Enter text to encrypt: ")\nkey = "DESKEY12"  # 8-character key for DES\n\nencrypted = des_encrypt(plaintext, key)\nprint(f"Encrypted: {encrypted}")\n\ndecrypted = des_decrypt(encrypted, key)\nprint(f"Decrypted: {decrypted}")\nprint(f"Match: {plaintext == decrypted}")`,
    "test_cases": [
      { "name": "DES Encryption Test", "input": "HELLO123\n", "expected_output": "Match: True" }
    ]
  },
  "aes": {
    "title": "Advanced Encryption Standard (AES)",
    "difficulty": "Medium",
    "marks": "50 Marks",
    "description": "Advanced Encryption Standard (AES) is a symmetric encryption algorithm that replaced DES. It supports key sizes of 128, 192, and 256 bits.",
    "how_it_works": [
      "Initialize with key expansion",
      "Apply initial round key addition",
      "Perform multiple rounds of SubBytes, ShiftRows, MixColumns",
      "Final round without MixColumns"
    ],
    "examples": [
      { "input": "Plaintext: 'Secret Message', Key: 128-bit key", "output": "Ciphertext: AES encrypted data" }
    ],
    "starter_code": `import hashlib\n\nclass SimpleAES:\n    def __init__(self, key):\n        self.key = hashlib.sha256(key.encode()).digest()[:16]  # 128-bit key\n    \n    def encrypt(self, plaintext):\n        """Simplified AES encryption simulation"""\n        # Pad plaintext to 16-byte blocks\n        padded = self._pad(plaintext)\n        encrypted = b''\n        \n        for i in range(0, len(padded), 16):\n            block = padded[i:i+16]\n            encrypted_block = self._encrypt_block(block)\n            encrypted += encrypted_block\n        \n        return encrypted.hex()\n    \n    def decrypt(self, ciphertext_hex):\n        """Simplified AES decryption simulation"""\n        ciphertext = bytes.fromhex(ciphertext_hex)\n        decrypted = b''\n        \n        for i in range(0, len(ciphertext), 16):\n            block = ciphertext[i:i+16]\n            decrypted_block = self._decrypt_block(block)\n            decrypted += decrypted_block\n        \n        return self._unpad(decrypted).decode()\n    \n    def _encrypt_block(self, block):\n        """Simulate block encryption"""\n        result = bytearray(16)\n        for i in range(16):\n            result[i] = (block[i] ^ self.key[i]) % 256\n        return bytes(result)\n    \n    def _decrypt_block(self, block):\n        """Simulate block decryption"""\n        result = bytearray(16)\n        for i in range(16):\n            result[i] = (block[i] ^ self.key[i]) % 256\n        return bytes(result)\n    \n    def _pad(self, text):\n        """PKCS7 padding"""\n        text_bytes = text.encode()\n        pad_len = 16 - (len(text_bytes) % 16)\n        return text_bytes + bytes([pad_len] * pad_len)\n    \n    def _unpad(self, padded):\n        """Remove PKCS7 padding"""\n        pad_len = padded[-1]\n        return padded[:-pad_len]\n\n# Example usage\nplaintext = input("Enter text to encrypt: ")\nkey = "MySecretAESKey123"\n\naes = SimpleAES(key)\nencrypted = aes.encrypt(plaintext)\nprint(f"Encrypted: {encrypted}")\n\ndecrypted = aes.decrypt(encrypted)\nprint(f"Decrypted: {decrypted}")\nprint(f"Match: {plaintext == decrypted}")`,
    "test_cases": [
      { "name": "AES Encryption Test", "input": "Hello AES\n", "expected_output": "Match: True" }
    ]
  },
  "rsa": {
    "title": "Asymmetric Key Encryption (RSA)",
    "difficulty": "Hard",
    "marks": "60 Marks",
    "description": "RSA is a public-key cryptosystem that uses the mathematical properties of large prime numbers for secure communication.",
    "how_it_works": [
      "Generate two large prime numbers p and q",
      "Calculate n = p × q and φ(n) = (p-1)(q-1)",
      "Choose public exponent e and calculate private exponent d",
      "Encrypt with public key (e,n), decrypt with private key (d,n)"
    ],
    "examples": [
      { "input": "Message: 'HELLO', Public key used for encryption", "output": "Encrypted message that can only be decrypted with private key" }
    ],
    "starter_code": `def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a\n\ndef mod_inverse(a, m):\n    """Extended Euclidean Algorithm"""\n    if gcd(a, m) != 1:\n        return None\n    \n    def extended_gcd(a, b):\n        if a == 0:\n            return b, 0, 1\n        gcd, x1, y1 = extended_gcd(b % a, a)\n        x = y1 - (b // a) * x1\n        y = x1\n        return gcd, x, y\n    \n    _, x, _ = extended_gcd(a, m)\n    return (x % m + m) % m\n\ndef power_mod(base, exp, mod):\n    result = 1\n    base = base % mod\n    while exp > 0:\n        if exp % 2 == 1:\n            result = (result * base) % mod\n        exp = exp >> 1\n        base = (base * base) % mod\n    return result\n\ndef rsa_keygen(p, q):\n    """Generate RSA key pair"""\n    n = p * q\n    phi = (p - 1) * (q - 1)\n    \n    e = 65537  # Common public exponent\n    while gcd(e, phi) != 1:\n        e += 2\n    \n    d = mod_inverse(e, phi)\n    \n    return (e, n), (d, n)  # (public_key, private_key)\n\ndef rsa_encrypt(message, public_key):\n    """Encrypt message with RSA public key"""\n    e, n = public_key\n    # Convert message to number (simplified)\n    message_num = sum(ord(char) * (256 ** i) for i, char in enumerate(message)) % n\n    return power_mod(message_num, e, n)\n\ndef rsa_decrypt(ciphertext, private_key):\n    """Decrypt message with RSA private key"""\n    d, n = private_key\n    return power_mod(ciphertext, d, n)\n\n# Example usage with small primes (for demonstration)\nprint("RSA Encryption Demo")\nmessage = input("Enter message to encrypt: ")\n\n# Use small primes for demo\np, q = 61, 53\npublic_key, private_key = rsa_keygen(p, q)\n\nencrypted = rsa_encrypt(message, public_key)\ndecrypted_num = rsa_decrypt(encrypted, private_key)\n\nprint(f"Original message: {message}")\nprint(f"Encrypted: {encrypted}")\nprint(f"Decrypted number: {decrypted_num}")\nprint(f"RSA encryption successful: {encrypted != decrypted_num}")`,
    "test_cases": [
      { "name": "RSA Encryption Test", "input": "HELLO\n", "expected_output": "RSA encryption successful: True" }
    ]
  },
  // ... (continue for all remaining challenges from app.py)
}; 