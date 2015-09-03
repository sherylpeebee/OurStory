// Using the JavaScript language, have the function CaesarCipher(str,num)
// take the str parameter and perform a Caesar Cipher shift on it using
// the num parameter as the shifting number. A Caesar Cipher works by
// shifting each letter in the string N places down in the alphabet
// (in this case N will be num). Punctuation, spaces, and capitalization
// should remain intact. For example if the string is "Caesar Cipher" and
// num is 2, the output should be "Ecguct Ekrjgt".

// Use the Parameter Testing feature in the box below to test your code with different arguments.



function CaesarCipher(str,num) {
  var alphabet = 'abcdefghijklmnopqrstuvwxyz';
  var alphArray = alphabet.split('');
  for(var i = 0; i < str.length; i ++){
    console.log(alphabet.indexOf(str[i]));
  }
  // code goes here
  // return str + num;
}

// keep this function call here
// to see how to enter arguments in JavaScript scroll down
CaesarCipher("i'm all about that base", 2);
