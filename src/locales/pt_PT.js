/**
 * pt_PT locale
 * @constructor
 */
T2W.PT_PT = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.PT_PT.DICTIONARY = {
    zero            : "zero",
    ones            : ["", ["um", "uma"], ["dois", "duas"], "três", "quatro", "cinco", "seis", "sete", "oito", "nove"],
    teens           : ["dez", "onze", "doze", "treze", "catorze", "quinze", "dezasseis", "dezassete", "dezoito", "dezanove"],
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
T2W.PT_PT.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.PT_PT.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.PT_PT.prototype.translate = function( numbers ) {
    
    // Check max value
    if(numbers.length * T2W.PT_PT.TOKEN_LENGTH > T2W.PT_PT.MAX_NUMBERS){
        throw {
            name : "Error",
            message : "The length of numbers is longer than the maximum value(" + T2W.PT_PT.MAX_NUMBERS + ")."
        };
    }
    
    // Deal with zero value
    if(numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
        return T2W.PT_PT.DICTIONARY.zero;
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
T2W.PT_PT.prototype._getTrio = function( numbers, index, max){
    var hundred = '';
    var ten = '';
    var single = '';
    var radix = this._getRadix(numbers, index);
    
    if(numbers[T2W.HUNDRED_INDEX]){
        if(numbers[T2W.HUNDRED_INDEX] === 1){
            // 100 = "cem", 101-199 = "cento"
            hundred = (numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]) 
                ? T2W.PT_PT.DICTIONARY.hundred[1]  // "cento"
                : T2W.PT_PT.DICTIONARY.hundred[0]; // "cem"
        } else {
            hundred = this._getOnes( numbers[T2W.HUNDRED_INDEX], index, false ) + ' ' + T2W.PT_PT.DICTIONARY.hundred[1];
        }
        
        // Ajouter "e" après les centaines si il y a des dizaines ou unités
        if(numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]){
            hundred += ' e ';
        }
    }
    
    if( numbers[ T2W.TEN_INDEX ] === 1 ){
        ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);
    }
    
    if( numbers[ T2W.TEN_INDEX ] >= 2 ){
        ten = numbers[T2W.SINGLE_INDEX] 
            ? this._getTens( numbers[T2W.TEN_INDEX]) + ' e ' + this._getOnes( numbers[T2W.SINGLE_INDEX], index, true) 
            : this._getTens( numbers[T2W.TEN_INDEX]);
    }
    
    if( !numbers[ T2W.TEN_INDEX ] ){
        single = this._getOnes( numbers[T2W.SINGLE_INDEX], index, true);
    }
    
    var result = hundred + ten + single + radix;
    
    // Cas spécial pour "mil" (un mille = mil, pas "um mil")
    if( index === 1 && numbers[T2W.TEN_INDEX] === undefined && numbers[T2W.SINGLE_INDEX] === 1 && !numbers[T2W.HUNDRED_INDEX] ){
        return radix;
    }
    
    // Ajouter des espaces entre les sections
    if(index+1 < max && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]) ){
        // Vérifier si on doit ajouter "e" entre les sections
        var needsConnector = false;
        
        // Ajouter "e" entre sections si la section actuelle (index 0) n'a pas de centaines
        if( index === 0 && !numbers[ T2W.HUNDRED_INDEX ] && (numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] )){
            needsConnector = true;
        }
        
        // Ajouter "e" entre millions et milliers (index 1) - TOUJOURS
        if( index === 1 ){
            needsConnector = true;
        }
        
        // AUSSI ajouter "e" entre milliers et centaines quand milliers ont des centaines (index 0 avec centaines)
        if( index === 0 && numbers[ T2W.HUNDRED_INDEX ] ){
            needsConnector = true;
        }
        
        if( needsConnector ){
            result = ' e ' + result;
        } else {
            result = ' ' + result;
        }
    }
    
    return result;
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
T2W.PT_PT.prototype._getOnes = function( number, index, isSingle ) {
    if (number === 1) {
        // Gestion du genre : masculin par défaut
        return T2W.PT_PT.DICTIONARY.ones[number][0]; // "um" (masculin)
    }
    if (number === 2) {
        // Gestion du genre : masculin par défaut
        return T2W.PT_PT.DICTIONARY.ones[number][0]; // "dois" (masculin)
    }
    return T2W.PT_PT.DICTIONARY.ones[number];
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.PT_PT.prototype._getTens = function( number ) {
    return T2W.PT_PT.DICTIONARY.tens[ number ];
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.PT_PT.prototype._getTeens = function(number ){
    return T2W.PT_PT.DICTIONARY.teens[ number ];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.PT_PT.prototype._getRadix = function( numbers, index ) {
    var radix = '';
    
    if( index > 0 && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX])){
        if( index === 1 ){
            radix = ' ' + T2W.PT_PT.DICTIONARY.radix[ index ];
        }
        
        if( index === 2 ){
            // Calculer le total pour cette section de 3 chiffres
            var total = (numbers[T2W.HUNDRED_INDEX] || 0) * 100 + (numbers[T2W.TEN_INDEX] || 0) * 10 + (numbers[T2W.SINGLE_INDEX] || 0);
            if( total === 1 ){
                radix = ' ' + T2W.PT_PT.DICTIONARY.radix[index][0]; // "milhão"
            } else {
                radix = ' ' + T2W.PT_PT.DICTIONARY.radix[index][1]; // "milhões"
            }
        }
    }
    
    return radix;
};