/**
 * pt_BR locale
 * @constructor
 */
T2W.PT_BR = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.PT_BR.DICTIONARY = {
    zero            : "zero",
    ones            : ["", ["um", "uma"], ["dois", "duas"], "três", "quatro", "cinco", "seis", "sete", "oito", "nove"],
    teens           : ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"],
    tens            : ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"],
    hundred         : ["cem", "cento"], // cem pour 100 exact, cento pour 101-199
    radix           : ["", "mil", ["milhão", "milhões"]],
    delimiters      : [" e "]
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.PT_BR.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.PT_BR.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.PT_BR.prototype.translate = function( numbers ) {
    
    // Check max value
    if(numbers.length * T2W.PT_BR.TOKEN_LENGTH > T2W.PT_BR.MAX_NUMBERS){
        throw {
            name : "Error",
            message : "The length of numbers is longer than the maximum value(" + T2W.PT_BR.MAX_NUMBERS + ")."
        };
    }
    
    // Deal with zero value
    if(numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
        return T2W.PT_BR.DICTIONARY.zero;
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
 * It solves exceptions in the Portuguese language.
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.PT_BR.prototype._getTrio = function( numbers, index, max){
    var hundred = '';
    var ten = '';
    var single = '';
    var radix = this._getRadix(numbers, index);
    
    if(numbers[T2W.HUNDRED_INDEX]){
        if(numbers[T2W.HUNDRED_INDEX] === 1){
            // 100 = "cem", 101-199 = "cento"
            hundred = (numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]) 
                ? T2W.PT_BR.DICTIONARY.hundred[1] + ' '  // "cento "
                : T2W.PT_BR.DICTIONARY.hundred[0];       // "cem"
        } else {
            hundred = this._getOnes( numbers[T2W.HUNDRED_INDEX], index, false ) + ' ' + T2W.PT_BR.DICTIONARY.hundred[1];
            if(numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]){
                hundred += ' ';
            }
        }
    }
    
    if( numbers[ T2W.TEN_INDEX ] === 1 ){
        ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);
    }
    
    if( numbers[ T2W.TEN_INDEX ] >= 2 ){
        ten = numbers[T2W.SINGLE_INDEX] 
            ? this._getTens( numbers[T2W.TEN_INDEX]) + T2W.PT_BR.DICTIONARY.delimiters[0] + this._getOnes( numbers[T2W.SINGLE_INDEX], index, true) 
            : this._getTens( numbers[T2W.TEN_INDEX]);
    }
    
    if( !numbers[ T2W.TEN_INDEX ] ){
        single = this._getOnes( numbers[T2W.SINGLE_INDEX], index, true);
    }
    
    if(index+1 < max && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]) ){
        hundred = ' ' + hundred;
    }
    
    if( index === 0 && index+1 < max && !numbers[ T2W.HUNDRED_INDEX ] && (numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] )){
        hundred = ' ';
    }
    
    // Cas spécial pour "mil" (un mille = mil, pas "um mil")
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
 * @param {number} index
 * @param {boolean} isSingle
 * @return {string}
 */
T2W.PT_BR.prototype._getOnes = function( number, index, isSingle ) {
    if (number === 1) {
        // Gestion du genre : masculin par défaut, féminin pour "uma" dans certains cas
        return T2W.PT_BR.DICTIONARY.ones[number][0]; // "um" (masculin)
    }
    if (number === 2) {
        // Gestion du genre : masculin par défaut
        return T2W.PT_BR.DICTIONARY.ones[number][0]; // "dois" (masculin)
    }
    return T2W.PT_BR.DICTIONARY.ones[number];
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.PT_BR.prototype._getTens = function( number ) {
    return T2W.PT_BR.DICTIONARY.tens[ number ];
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.PT_BR.prototype._getTeens = function(number ){
    return T2W.PT_BR.DICTIONARY.teens[ number ];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.PT_BR.prototype._getRadix = function( numbers, index ) {
    var radix = '';
    
    if( index > 0 && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX])){
        if( index === 1 ){
            radix = ' ' + T2W.PT_BR.DICTIONARY.radix[ index ];
        }
        
        if( index === 2 ){
            // Gestion singulier/pluriel pour "milhão/milhões"
            var total = numbers[T2W.HUNDRED_INDEX] * 100 + numbers[T2W.TEN_INDEX] * 10 + numbers[T2W.SINGLE_INDEX];
            if( total === 1 ){
                radix = ' ' + T2W.PT_BR.DICTIONARY.radix[index][0]; // "milhão"
            } else {
                radix = ' ' + T2W.PT_BR.DICTIONARY.radix[index][1]; // "milhões"
            }
        }
    }
    
    return radix;
};