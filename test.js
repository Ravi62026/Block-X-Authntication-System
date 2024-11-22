const encodedNumber = 491260504386;

const decodedText = Buffer.from(
  encodedNumber.toString(16),
  "hex"
).toString();

// Reverse the string
function reverseString(str) {
  return str.split("").reverse().join("");
}
console.log(decodedText)
console.log(reverseString(decodedText));
