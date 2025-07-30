/**
 * nl_NL locale
 * @constructor
 */
T2W.NL_NL = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.NL_NL.DICTIONARY = {
    zero            : "nul",
    ones            : ["", "een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen"],
    teens           : ["tien", "elf", "twaalf", "dertien", "veertien", "vijftien", "zestien", "zeventien", "achttien", "negentien"],
    tens            : ["", "", "twintig", "dertig", "veertig", "vijftig", "zestig", "zeventig", "tachtig", "negentig"],
    hundred         : "honderd",
    radix           : ["", "duizend", ["miljoen", "miljoen"]],
    delimiters      : ["", "en"]
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.NL_NL.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.NL_NL.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.NL_NL.prototype.translate = function( numbers ) {
    
    // Check max value
    if(numbers.length * T2W.NL_NL.TOKEN_LENGTH > T2W.NL_NL.MAX_NUMBERS){
        throw {
            name : "Error",
            message : "The length of numbers is longer than the maximum value(" + T2W.NL_NL.MAX_NUMBERS + ")."
        };
    }
    
    // Deal with zero value
    if(numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
        return T2W.NL_NL.DICTIONARY.zero;
    }
    
    var words = [];
    for(var idx = 0, max = numbers.length; idx < max; idx++){
        words.unshift( this._getTrio( this.tokenize( numbers[idx], 1 ), idx, max));
    }
    
    return words.join("").trim();
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the Dutch language.
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.NL_NL.prototype._getTrio = function( numbers, index, max){
    var hundred = '';
    var ten = '';
    var single = '';
    var radix = this._getRadix(numbers, index);
    
    if(numbers[T2W.HUNDRED_INDEX]){
        if(numbers[T2W.HUNDRED_INDEX] === 1){
            hundred = T2W.NL_NL.DICTIONARY.hundred;
        } else {
            hundred = this._getOnes( numbers[T2W.HUNDRED_INDEX] ) + T2W.NL_NL.DICTIONARY.hundred;
        }
        if(numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]){
            hundred += ' ';
        }
    }
    
    if( numbers[ T2W.TEN_INDEX ] === 1 ){
        ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);
    }
    
    if( numbers[ T2W.TEN_INDEX ] >= 2 ){
        if(numbers[T2W.SINGLE_INDEX]){
            // En néerlandais: "drieëntwintig" (23 = trois-et-vingt)
            if(numbers[T2W.SINGLE_INDEX] === 3 && numbers[T2W.TEN_INDEX] >= 2){
                ten = "drie" + T2W.NL_NL.DICTIONARY.delimiters[1] + this._getTens( numbers[T2W.TEN_INDEX]);
            } else {
                ten = this._getOnes( numbers[T2W.SINGLE_INDEX] ) + T2W.NL_NL.DICTIONARY.delimiters[1] + this._getTens( numbers[T2W.TEN_INDEX]);
            }
        } else {
            ten = this._getTens( numbers[T2W.TEN_INDEX]);
        }
    }
    
    if( !numbers[ T2W.TEN_INDEX ] ){
        single = this._getOnes( numbers[T2W.SINGLE_INDEX]);
    }
    
    if(index+1 < max && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]) ){
        hundred = ' ' + hundred;
    }
    
    if( index === 0 && index+1 < max && !numbers[ T2W.HUNDRED_INDEX ] && (numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] )){
        hundred = ' ';
    }
    
    // Cas spécial pour "duizend" (un mille = duizend, pas "een duizend")
    if( index === 1 && numbers[T2W.TEN_INDEX] === undefined && numbers[T2W.SINGLE_INDEX] === 1 && !numbers[T2W.HUNDRED_INDEX] ){
        return radix;
    }
    
    return hundred + ten + single + radix;
};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.NL_NL.prototype._getOnes = function( number ) {
    return T2W.NL_NL.DICTIONARY.ones[number];
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.NL_NL.prototype._getTens = function( number ) {
    return T2W.NL_NL.DICTIONARY.tens[number];
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.NL_NL.prototype._getTeens = function(number ){
    return T2W.NL_NL.DICTIONARY.teens[number];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.NL_NL.prototype._getRadix = function( numbers, index ) {
    var radix = '';
    
    if( index > 0 && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX])){
        if( index === 1 ){
            radix = ' ' + T2W.NL_NL.DICTIONARY.radix[index];
        }
        
        if( index === 2 ){
            // En néerlandais, "miljoen" ne change pas au pluriel dans ce contexte
            radix = ' ' + T2W.NL_NL.DICTIONARY.radix[index][0];
        }
    }
    
    return radix;
};