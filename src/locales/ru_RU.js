/**
 * ru_RU locale
 * @constructor
 */
T2W.RU_RU = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.RU_RU.DICTIONARY = {
    zero            : "ноль",
    ones            : [
        ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"], // masculin
        ["", "одна", "две", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"]  // féminin
    ],
    teens           : ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"],
    tens            : ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"],
    hundreds        : ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"],
    thousands       : ["тысяча", "тысячи", "тысяч"],
    millions        : ["миллион", "миллиона", "миллионов"]
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.RU_RU.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.RU_RU.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.RU_RU.prototype.translate = function( numbers ) {
    
    // Check max value
    if(numbers.length * T2W.RU_RU.TOKEN_LENGTH > T2W.RU_RU.MAX_NUMBERS){
        throw {
            name : "Error",
            message : "The length of numbers is longer than the maximum value(" + T2W.RU_RU.MAX_NUMBERS + ")."
        };
    }
    
    // Deal with zero value
    if(numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
        return T2W.RU_RU.DICTIONARY.zero;
    }
    
    var words = [];
    for(var idx = 0, max = numbers.length; idx < max; idx++){
        var trio = this._getTrio( this.tokenize( numbers[idx], 1 ), idx, max);
        if(trio.trim()) {
            words.unshift(trio);
        }
    }
    
    return words.join(" ").replace(/\s+/g, ' ').trim();
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the Russian language.
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.RU_RU.prototype._getTrio = function( numbers, index, max){
    var hundred = '';
    var ten = '';
    var single = '';
    var radix = this._getRadix(numbers, index);
    
    if(numbers[T2W.HUNDRED_INDEX]){
        hundred = this._getHundreds(numbers[T2W.HUNDRED_INDEX]);
    }
    
    if( numbers[ T2W.TEN_INDEX ] === 1 ){
        ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);
    }
    
    if( numbers[ T2W.TEN_INDEX ] >= 2 ){
        ten = this._getTens( numbers[T2W.TEN_INDEX]);
    }
    
    if( !numbers[ T2W.TEN_INDEX ] || numbers[ T2W.TEN_INDEX ] >= 2 ){
        if( numbers[T2W.SINGLE_INDEX] ){
            // Genre féminin pour les milliers, masculin pour le reste
            var gender = (index === 1) ? 1 : 0;
            single = this._getOnes( numbers[T2W.SINGLE_INDEX], gender);
        }
    }
    
    var parts = [];
    if(hundred) parts.push(hundred);
    if(ten) parts.push(ten);
    if(single) parts.push(single);
    if(radix) parts.push(radix);
    
    return parts.join(' ');
};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} gender 0=masculin, 1=féminin
 * @return {string}
 */
T2W.RU_RU.prototype._getOnes = function( number, gender ) {
    gender = gender || 0;
    return T2W.RU_RU.DICTIONARY.ones[gender][number];
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.RU_RU.prototype._getTens = function( number ) {
    return T2W.RU_RU.DICTIONARY.tens[number];
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.RU_RU.prototype._getTeens = function(number ){
    return T2W.RU_RU.DICTIONARY.teens[number];
};

/**
 * Get hundreds
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.RU_RU.prototype._getHundreds = function( number ) {
    return T2W.RU_RU.DICTIONARY.hundreds[number];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.RU_RU.prototype._getRadix = function( numbers, index ) {
    var radix = '';
    
    if( index > 0 && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX])){
        var total = (numbers[T2W.HUNDRED_INDEX] || 0) * 100 + (numbers[T2W.TEN_INDEX] || 0) * 10 + (numbers[T2W.SINGLE_INDEX] || 0);
        
        if( index === 1 ){
            // Milliers - forme dépend du nombre
            radix = this._getThousandsForm(total);
        }
        
        if( index === 2 ){
            // Millions - forme dépend du nombre  
            radix = this._getMillionsForm(total);
        }
    }
    
    return radix;
};

/**
 * Get correct thousands form based on number
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.RU_RU.prototype._getThousandsForm = function(number) {
    var lastDigit = number % 10;
    var lastTwoDigits = number % 100;
    
    // Cas spéciaux pour 11-14
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return T2W.RU_RU.DICTIONARY.thousands[2]; // "тысяч"
    }
    
    // Règles générales
    if (lastDigit === 1) {
        return T2W.RU_RU.DICTIONARY.thousands[0]; // "тысяча"
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        return T2W.RU_RU.DICTIONARY.thousands[1]; // "тысячи"
    } else {
        return T2W.RU_RU.DICTIONARY.thousands[2]; // "тысяч"
    }
};

/**
 * Get correct millions form based on number
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.RU_RU.prototype._getMillionsForm = function(number) {
    var lastDigit = number % 10;
    var lastTwoDigits = number % 100;
    
    // Cas spéciaux pour 11-14
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return T2W.RU_RU.DICTIONARY.millions[2]; // "миллионов"
    }
    
    // Règles générales
    if (lastDigit === 1) {
        return T2W.RU_RU.DICTIONARY.millions[0]; // "миллион"
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        return T2W.RU_RU.DICTIONARY.millions[1]; // "миллиона"
    } else {
        return T2W.RU_RU.DICTIONARY.millions[2]; // "миллионов"
    }
};