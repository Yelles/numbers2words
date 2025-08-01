/**
 * Number.isInteger() polyfill
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 */
if (!Number.isInteger) {
  Number.isInteger = function isInteger (nVal) {
    return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
  };
}
/**
 * It converts a numeric value to words.
 * @class
 * @public
 * @constructor
 * @param {String} localeName 
 */
var T2W = function( localeName ) {	
	var type = localeName, translator;
	
	// error if the constructor doesn't exist
	if( typeof T2W[ type ] !== "function" ) {
		throw {
			name : "Error",
			message : "Locale with name '" + type + "' doesn't exist."		
		};
	}
		
	translator = new T2W[ type ]();
	translator._tokenLength = T2W[ type ].TOKEN_LENGTH | T2W.DEFAULT_TOKEN_LENGTH;
	
	// Extends
	// Copy prototype methods from T2W to translator object 
	for (var key in T2W.prototype) {
		if( T2W.prototype.hasOwnProperty( key ) ) {
			if( translator[key] !== 'function' ){
				T2W[ type ].prototype[key] = T2W.prototype[key];
			}			
		}				
	}
	
	return translator;	
};

/**
 * Numeral system
 * @constant
 * @type {number}
 */
T2W.RADIX = 10;

/**
 * Default token length
 * @constant
 * @type {number}
 */
T2W.DEFAULT_TOKEN_LENGTH = 1;


/**
 * Single index
 * @constant
 * @type {number}
 */
T2W.SINGLE_INDEX = 0;

/**
 * Ten index
 * @constant
 * @type {number}
 */
T2W.TEN_INDEX = 1;

/**
 * Hundred index
 * @constant
 * @type {number}
 */
T2W.HUNDRED_INDEX = 2;

/**
 * Translate number to words
 * @public
 * @param {integer} value
 * @return{string}
 * @example 
 * this.toWords( 1234 )
 * // one thousand two hundred thirty four
 */
T2W.prototype.toWords = function( number ){
	
	if(typeof this.translate != 'function'){
		throw {
			name:"Error",
			message: "The function 'translate' is not implemented."			
		};
	}
				
	return this.translate( this.tokenize(number, this._tokenLength));
};

/**
 * Split number to tokens
 * @param {number} number
 * @param {number} tokenLength - count of numbers in one token
 * @return {Array}
 * @example 
 * this.tokenize( 1234, 1 ); // [4,3,2,1]
 * this.tokenize( 1234, 2 ); // [34,12]
 * this.tokenize( 1234, 3 ); // [234,1]
 */
T2W.prototype.tokenize = function( number, tokenLength ){
	
	if(!Number.isInteger(number)){
		throw {
			name:"NumberFormatExceprion",
			message: "'" + number + "' is not Integer."	
		};
	}
	
	if(number === 0){
		return [0];
	}
	
	var tokens = [];
	var base = Math.pow( T2W.RADIX, tokenLength );
	while( number ){    
    	tokens.push( number % base );
    	number = parseInt( number / base, T2W.RADIX );    
	}
	return tokens;
};



/**
 * ar_AR locale
 * @constructor
 */
T2W.AR_AR = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.AR_AR.DICTIONARY = {
	zero		:"صفر",
	ones		:[ "", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة" ],
	teens		:[ "عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر" ],
	tens		:[ "", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستة وعشرون", "سبعة وعشرون", "ثمانية وعشرون", "تسعة وعشرون" ],
	hundred		:"مائة",
	radix		:["", "ألف", "مليون"],
	delimiters	:["-", "و"]
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.AR_AR.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.AR_AR.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.AR_AR.prototype.translate = function( numbers ) {	
	
	// Check max value	
	if(numbers.length * T2W.AR_AR.TOKEN_LENGTH > T2W.AR_AR.MAX_NUMBERS){
		throw {
			name : "Error",
			message : "The length of numbers is longer than the maximum value(" + T2W.AR_AR.MAX_NUMBERS + ")."		
		};	
	}		
	
	// Deal with zero value	
	if(numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
		return T2W.AR_AR.DICTIONARY.zero;
	}
	
	var words = [];
	for(var idx = 0, max = numbers.length; idx < max; idx++){				
		words.unshift( this._getTrio( this.tokenize( numbers[idx], 1 ), idx, max));	
	}
	
	return words.join("");								
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the English language.
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.AR_AR.prototype._getTrio = function( numbers, index, max){																				
	var hundred = '';
	var ten = '';
	var single = '';
	var radix = this._getRadix(numbers, index);
	
	if(numbers[T2W.HUNDRED_INDEX]){
		hundred = numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] 
			? this._getOnes( numbers[ T2W.HUNDRED_INDEX ] ) + " " + T2W.EN_US.DICTIONARY.hundred + ' ' + T2W.EN_US.DICTIONARY.delimiters[1] + ' '
			: this._getOnes( numbers[ T2W.HUNDRED_INDEX ] ) + " " + T2W.EN_US.DICTIONARY.hundred;
	}
	
	if( numbers[ T2W.TEN_INDEX ] ){			
		ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);			
	}
						
	if( numbers[ T2W.TEN_INDEX ] >=2 ){
		ten = numbers[T2W.SINGLE_INDEX] 
			? this._getTens( numbers[T2W.TEN_INDEX]) + T2W.EN_US.DICTIONARY.delimiters[0] + this._getOnes( numbers[T2W.SINGLE_INDEX]) 
			: this._getTens( numbers[T2W.TEN_INDEX]); 	
	}
							
	if( !numbers[ T2W.TEN_INDEX ] ){
		single = this._getOnes( numbers[T2W.SINGLE_INDEX]);
	}
				
	if(index+1 < max && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]) ){
		hundred = ' ' + hundred;
	}
	
	if( index === 0 && index+1 < max && !numbers[ T2W.HUNDRED_INDEX ] && (numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] )){
		hundred	 = ' ' + T2W.AR_AR.DICTIONARY.delimiters[1] + ' ';		
	}
								
	return hundred + ten + single + radix;		
};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} index
 * @return {string}
 */
T2W.AR_AR.prototype._getOnes = function( number) {			
	return T2W.AR_AR.DICTIONARY.ones[ number ];			
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.AR_AR.prototype._getTens = function( number ) {		
	return T2W.AR_AR.DICTIONARY.tens[ number ];				
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.AR_AR.prototype._getTeens = function(number ){
	return T2W.AR_AR.DICTIONARY.teens[ number ];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.AR_AR.prototype._getRadix = function( numbers, index ) {		
	var radix = '';
	if( index > 0 && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX])){	
		radix = ' ' + T2W.AR_AR.DICTIONARY.radix[ index ];			
	}
			
	return radix;
};

/**
 * cs_CZ locale
 * @constructor
 */
T2W.CS_CZ = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.CS_CZ.DICTIONARY = {	
	ones		:[
					[ "", "jedna", "dva", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět" ],
					[ "", "jedentisíc", "dvatisíce", "třitisíce", "čtyřitisíce", "pěttisíc", "šesttisíc", "sedmtisíc", "osmtisíc", "devěttisíc" ],
					[ "", "jedenmilión", "dvamilióny", "třimilióny", "čtyřimilióny", "pětmiliónů", "šestmiliónů", "sedmmiliónů", "osmmiliónů", "devěmiliónů"]					
				],
	teens		:[ "deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct" ],
	tens		:[ "", "", "dvacet", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát", "devadesát" ],
	hundreds	:[ "", "sto", "dvěstě", "třista", "čtyřista", "pětset", "šestset", "sedmset", "osmset", "devětset" ],

	radix:["", "tisíc", "miliónů"],
	exceptions	:["nula", "", "dvě"]	
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.CS_CZ.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.CS_CZ.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.CS_CZ.prototype.translate = function( numbers ) {	
	
	// Check max value	
	if(numbers.length * T2W.CS_CZ.TOKEN_LENGTH > T2W.CS_CZ.MAX_NUMBERS){
		throw {
			name : "Error",
			message : "The length of numbers is longer than the maximum value(" + T2W.CS_CZ.MAX_NUMBERS + ")."		
		};	
	}		
	
	// Deal with exceptions - zero	
	if( numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
		return T2W.CS_CZ.DICTIONARY.exceptions[numbers[T2W.SINGLE_INDEX]];
	}
		
	var words = [];
	for(var idx = 0, max = numbers.length; idx < max; idx++){				
		words.unshift( this._getTrio( this.tokenize( numbers[idx], 1 ), idx) );	
	}
	
	return words.join("");								
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the Czech language.
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.CS_CZ.prototype._getTrio = function(numbers, index){																				
	var hundred = '';
	var ten = '';
	var single = '';
	var radix = this._getRadix( index );
	
	if(numbers[T2W.HUNDRED_INDEX]){
		hundred = this._getHundreds(numbers[T2W.HUNDRED_INDEX]);
	}
	
	if( numbers[ T2W.TEN_INDEX ] ){			
		ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);			
	}
						
	if( numbers[ T2W.TEN_INDEX ] >=2 ){		
		ten = this._getTens( numbers[T2W.TEN_INDEX]) + this._getOnes( numbers[T2W.SINGLE_INDEX], T2W.SINGLE_INDEX);	
	}
							
	if( !numbers[ T2W.TEN_INDEX ] ){
		single = this._getOnes( numbers[T2W.SINGLE_INDEX], T2W.SINGLE_INDEX );
	}
	
	// Deal with exceptions	- dvě | dva
	if(!numbers[T2W.HUNDRED_INDEX] && !numbers[ T2W.TEN_INDEX ] && numbers[T2W.SINGLE_INDEX] === 2){
		single = T2W.CS_CZ.DICTIONARY.exceptions[numbers[T2W.SINGLE_INDEX]];
	}
	
	if(index > 0 && numbers.length === 1){
		single = this._getOnes( numbers[T2W.SINGLE_INDEX], index);
		radix = '';	
	}
								
	return hundred + ten + single + radix;		
};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} index 
 * @return {string}
 */
T2W.CS_CZ.prototype._getOnes = function( number, index ) {			
	return T2W.CS_CZ.DICTIONARY.ones[index][ number ];			
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.CS_CZ.prototype._getTens = function( number ) {		
	return T2W.CS_CZ.DICTIONARY.tens[ number ];				
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.CS_CZ.prototype._getTeens = function(number ){
	return T2W.CS_CZ.DICTIONARY.teens[ number ];
};

/**
 * Get hundreds
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.CS_CZ.prototype._getHundreds = function( number ) {		
	return T2W.CS_CZ.DICTIONARY.hundreds[ number ];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {number} index
 * @return {string}
 */
T2W.CS_CZ.prototype._getRadix = function( index ) {		
	return T2W.CS_CZ.DICTIONARY.radix[ index ];
};

/**
 * de_DE locale
 * @constructor
 */
T2W.DE_DE = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.DE_DE.DICTIONARY = {
    zero            : "null",
    ones            : ["", ["eins", "ein", "eine"], "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"],
    teens           : ["zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn"],
    tens            : ["", "", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"],
    hundred         : "hundert",
    radix           : ["", "tausend", ["Million", "Millionen"]],
    delimiters      : ["-", "und"]
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.DE_DE.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.DE_DE.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.DE_DE.prototype.translate = function( numbers ) {

    // Check max value
    if (numbers.length * T2W.DE_DE.TOKEN_LENGTH > T2W.DE_DE.MAX_NUMBERS){
        throw {
            name : "Error",
            message : "The length of numbers is longer than the maximum value(" + T2W.DE_DE.MAX_NUMBERS + ")."
        };
    }

    // Deal with zero value
    if (numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1) {
        return T2W.DE_DE.DICTIONARY.zero;
    }

    var words = [];
    for (var idx = 0, max = numbers.length; idx < max; idx++) {
        words.unshift( this._getTrio( this.tokenize( numbers[idx], 1 ), idx, max, words));
    }

    return words.join("");
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the English language.
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.DE_DE.prototype._getTrio = function( numbers, index, max, formerWords){
    var hundred = '';
    var ten = '';
    var single = '';
    var radix = this._getRadix(numbers, index);
    var result = '';

    if (numbers[T2W.HUNDRED_INDEX]) {
        hundred = this._getOnes( numbers[T2W.HUNDRED_INDEX], index, numbers[T2W.TEN_INDEX], false) + T2W.DE_DE.DICTIONARY.hundred;
    }

    if (numbers[T2W.TEN_INDEX]) {
        ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);
    }

    if (numbers[T2W.TEN_INDEX] >= 2) {
        ten = numbers[T2W.SINGLE_INDEX]
            ? this._getOnes( numbers[T2W.SINGLE_INDEX], index, numbers[T2W.TEN_INDEX], false) + T2W.DE_DE.DICTIONARY.delimiters[1] + this._getTens( numbers[T2W.TEN_INDEX])
            : this._getTens( numbers[T2W.TEN_INDEX]);
    }

    if (!numbers[T2W.TEN_INDEX]) {
        single = this._getOnes( numbers[T2W.SINGLE_INDEX], index, numbers[T2W.TEN_INDEX], true);
    }

    if (index >= 2) {
        single += ' ';
    }


    result = hundred + ten + single + radix;

    //  && index >= 1
    if (index > 1 && formerWords.join('').length > 0) {
        result += ' ';
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
T2W.DE_DE.prototype._getOnes = function( number, index, tensOfNumber, isSingle) {
    if (number === 1) {
        if (index === 0 && isSingle && (tensOfNumber === 0 || tensOfNumber === undefined)) {
            return T2W.DE_DE.DICTIONARY.ones[number][0];
        }

        if (index >= 2 && isSingle && tensOfNumber === undefined) {
            return T2W.DE_DE.DICTIONARY.ones[number][2];
        }

        return T2W.DE_DE.DICTIONARY.ones[number][1];
    }
    return T2W.DE_DE.DICTIONARY.ones[number];
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.DE_DE.prototype._getTens = function( number ) {
    return T2W.DE_DE.DICTIONARY.tens[number];
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.DE_DE.prototype._getTeens = function(number) {
    return T2W.DE_DE.DICTIONARY.teens[number];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.DE_DE.prototype._getRadix = function( numbers, index ) {
    var radix = '';

    if (index > 0 && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX])) {
        if (index === 1) {
            radix = T2W.DE_DE.DICTIONARY.radix[index];
        }

        if (index > 1 && numbers.length === 1 && numbers[T2W.SINGLE_INDEX]) {
            radix = T2W.DE_DE.DICTIONARY.radix[index][0];
        } else if (index > 1) {
            radix = T2W.DE_DE.DICTIONARY.radix[index][1];
        }
    }

    return radix;
};

/**
 * en_US locale
 * @constructor
 */
T2W.EN_US = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.EN_US.DICTIONARY = {
	zero		:"zero",
	ones		:[ "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ],
	teens		:[ "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen" ],
	tens		:[ "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety" ],
	hundred		:"hundred",
	radix		:["", "thousand", "million"],
	delimiters	:["-", "and"]
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.EN_US.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.EN_US.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.EN_US.prototype.translate = function( numbers ) {	
	
	// Check max value	
	if(numbers.length * T2W.EN_US.TOKEN_LENGTH > T2W.EN_US.MAX_NUMBERS){
		throw {
			name : "Error",
			message : "The length of numbers is longer than the maximum value(" + T2W.EN_US.MAX_NUMBERS + ")."		
		};	
	}		
	
	// Deal with zero value	
	if(numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
		return T2W.EN_US.DICTIONARY.zero;
	}
	
	var words = [];
	for(var idx = 0, max = numbers.length; idx < max; idx++){				
		words.unshift( this._getTrio( this.tokenize( numbers[idx], 1 ), idx, max));	
	}
	
	return words.join("");								
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the English language.
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.EN_US.prototype._getTrio = function( numbers, index, max){																				
	var hundred = '';
	var ten = '';
	var single = '';
	var radix = this._getRadix(numbers, index);
	
	if(numbers[T2W.HUNDRED_INDEX]){
		hundred = numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] 
			? this._getOnes( numbers[ T2W.HUNDRED_INDEX ] ) + " " + T2W.EN_US.DICTIONARY.hundred + ' ' + T2W.EN_US.DICTIONARY.delimiters[1] + ' '
			: this._getOnes( numbers[ T2W.HUNDRED_INDEX ] ) + " " + T2W.EN_US.DICTIONARY.hundred;
	}
	
	if( numbers[ T2W.TEN_INDEX ] ){			
		ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);			
	}
						
	if( numbers[ T2W.TEN_INDEX ] >=2 ){
		ten = numbers[T2W.SINGLE_INDEX] 
			? this._getTens( numbers[T2W.TEN_INDEX]) + T2W.EN_US.DICTIONARY.delimiters[0] + this._getOnes( numbers[T2W.SINGLE_INDEX]) 
			: this._getTens( numbers[T2W.TEN_INDEX]); 	
	}
							
	if( !numbers[ T2W.TEN_INDEX ] ){
		single = this._getOnes( numbers[T2W.SINGLE_INDEX]);
	}
				
	if(index+1 < max && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]) ){
		hundred = ' ' + hundred;
	}
	
	if( index === 0 && index+1 < max && !numbers[ T2W.HUNDRED_INDEX ] && (numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] )){
		hundred	 = ' ' + T2W.EN_US.DICTIONARY.delimiters[1] + ' ';		
	}
								
	return hundred + ten + single + radix;		
};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} index
 * @return {string}
 */
T2W.EN_US.prototype._getOnes = function( number) {			
	return T2W.EN_US.DICTIONARY.ones[ number ];			
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.EN_US.prototype._getTens = function( number ) {		
	return T2W.EN_US.DICTIONARY.tens[ number ];				
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.EN_US.prototype._getTeens = function(number ){
	return T2W.EN_US.DICTIONARY.teens[ number ];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.EN_US.prototype._getRadix = function( numbers, index ) {		
	var radix = '';
	if( index > 0 && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX])){	
		radix = ' ' + T2W.EN_US.DICTIONARY.radix[ index ];			
	}
			
	return radix;
};

/**
 * es_ES locale
 * @constructor
 */
T2W.ES_ES = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.ES_ES.DICTIONARY = {
	zero		:"cero",
	ones		:[ "", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve" ],
	teens		:[ "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve" ],
	tens		:[ "", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa" ],
	hundreds		:["ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"],
    radix: ["", ["mil"], ["millón"]],
	delimiters	:[" ", " y "]
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.ES_ES.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.ES_ES.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.ES_ES.prototype.translate = function( numbers ) {	
	
	// Check max value	
	if(numbers.length * T2W.ES_ES.TOKEN_LENGTH > T2W.ES_ES.MAX_NUMBERS){
		throw {
			name : "Error",
			message : "The length of numbers is longer than the maximum value(" + T2W.ES_ES.MAX_NUMBERS + ")."		
		};	
	}		
	
	// Deal with zero value	
	if(numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
		return T2W.ES_ES.DICTIONARY.zero;
	}
	
	var words = [];
	for(var idx = 0, max = numbers.length; idx < max; idx++){				
		words.unshift( this._getTrio( this.tokenize( numbers[idx], 1 ), idx, max));	
	}
	
	if(words.join(""))
	return words.join("").trim();								
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the French language.
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.ES_ES.prototype._getTrio = function( numbers, index, max){																				
	var hundred = '';
	var ten = '';
	var single = '';
	var radix = this._getRadix(numbers, index);
	

	if(numbers[T2W.HUNDRED_INDEX]){
		hundred = numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] 
			? this._getOnes( numbers[ T2W.HUNDRED_INDEX ] ) + " " + T2W.ES_ES.DICTIONARY.hundred + " "
			: this._getOnes( numbers[ T2W.HUNDRED_INDEX ] ) + " " + T2W.ES_ES.DICTIONARY.hundred;
	}

	if(numbers[T2W.HUNDRED_INDEX] == 1){
		hundred = numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] 
			? T2W.ES_ES.DICTIONARY.hundred + ' '
			: T2W.ES_ES.DICTIONARY.hundred;
	}

	
	if( numbers[ T2W.TEN_INDEX ] ){			
		ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);			
	}
						
	if( numbers[ T2W.TEN_INDEX ] >=2 ){
		ten = numbers[T2W.SINGLE_INDEX] 
			? this._getTens( numbers[T2W.TEN_INDEX]) + T2W.ES_ES.DICTIONARY.delimiters[1] + this._getOnes( numbers[T2W.SINGLE_INDEX]) 
			: this._getTens( numbers[T2W.TEN_INDEX]); 	
	}
						
	if( numbers[ T2W.TEN_INDEX ] >=2 && numbers[ T2W.SINGLE_INDEX ] ==1 ){
		ten = this._getTens( numbers[T2W.TEN_INDEX]) + T2W.ES_ES.DICTIONARY.delimiters[1] + this._getOnes( numbers[T2W.SINGLE_INDEX]);
	}
			
							
	if( !numbers[ T2W.TEN_INDEX ] ){
		single = this._getOnes( numbers[T2W.SINGLE_INDEX]);
	}

	
	if( numbers[ T2W.HUNDRED_INDEX ] ){			
		hundred = this._getHundreds( numbers[T2W.HUNDRED_INDEX]);			
	}
				
	if( index+1 < max && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]) ){
		hundred = ' ' + hundred;
	}

	if(index > 0 && numbers[T2W.TEN_INDEX] > 0 && numbers[T2W.SINGLE_INDEX] === 1)
		single = "";

	if( index === 0 && index+2 < max && !numbers[ T2W.HUNDRED_INDEX ] && (numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] )){
		hundred	 = ' ';		
	}

	if( numbers[T2W.HUNDRED_INDEX] === 1 && (  numbers[T2W.TEN_INDEX] == undefined || numbers[T2W.TEN_INDEX] < 1 ) && numbers[T2W.SINGLE_INDEX] < 1 )
		hundred = "cien";

	if( numbers[T2W.HUNDRED_INDEX] > 0 && ( numbers[T2W.TEN_INDEX] > 0 || numbers[T2W.SINGLE_INDEX] > 0  ) )
		hundred = hundred + ' ';

	if( index === 1 && numbers[T2W.TEN_INDEX] == undefined && numbers[T2W.SINGLE_INDEX] === 1 )
	{
		return radix;
	}
	if( index > 0 && numbers[T2W.SINGLE_INDEX] === 1 && single == "uno")
		single = "un";
	if( index === 1 && numbers[T2W.SINGLE_INDEX] === 1)
		single = "";
	if( index === 0 && numbers[T2W.TEN_INDEX] === 2 && numbers[T2W.SINGLE_INDEX] === 1)
		return T2W.ES_ES.DICTIONARY.delimiters[0] + "veintiuno";
	if( index > 0 && numbers[T2W.TEN_INDEX] === 2 && numbers[T2W.SINGLE_INDEX] === 1)
		return T2W.ES_ES.DICTIONARY.delimiters[0] + "veintiún" + radix;
	else							
		return hundred + ten + single + radix;		
};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} index
 * @return {string}
 */
T2W.ES_ES.prototype._getOnes = function( number) {			
	return T2W.ES_ES.DICTIONARY.ones[ number ];			
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.ES_ES.prototype._getTens = function( number ) {	
	return T2W.ES_ES.DICTIONARY.tens[ number ];				
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.ES_ES.prototype._getTeens = function(number ){
	return T2W.ES_ES.DICTIONARY.teens[ number ];
};

/**
 * Get hundreds
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}	
 */
T2W.ES_ES.prototype._getHundreds = function(number ){
	return T2W.ES_ES.DICTIONARY.hundreds[ number - 1 ];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.ES_ES.prototype._getRadix = function( numbers, index ) {	
	var radix = '';
	if( index > 0 && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]))
		radix = ' ' + T2W.ES_ES.DICTIONARY.radix[ index ];			
	
	if( index === 1 && numbers[T2W.TEN_INDEX] == undefined && numbers[T2W.SINGLE_INDEX] === 1 )
		radix = T2W.ES_ES.DICTIONARY.radix[ index ];			
	
	if( index === 2 && ( numbers[T2W.TEN_INDEX] > 0 || numbers[T2W.SINGLE_INDEX] > 1 ) )
	{
		radix = radix + 'es';
		radix = radix.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	}

	return radix;
};

/**
 * fr_FR locale
 * @constructor
 */
T2W.FR_FR = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.FR_FR.DICTIONARY = {
	zero		:"zéro",
	ones		:[ "", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf" ],
	teens		:[ "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf" ],
	tens		:[ "", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix" ],
	hundred		:"cent",
    radix: ["", ["mille"], ["million"]],
	delimiters	:["-", "et", "-et-"]
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.FR_FR.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.FR_FR.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.FR_FR.prototype.translate = function( numbers ) {	
	
	// Check max value	
	if(numbers.length * T2W.FR_FR.TOKEN_LENGTH > T2W.FR_FR.MAX_NUMBERS){
		throw {
			name : "Error",
			message : "The length of numbers is longer than the maximum value(" + T2W.FR_FR.MAX_NUMBERS + ")."		
		};	
	}		
	
	// Deal with zero value	
	if(numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
		return T2W.FR_FR.DICTIONARY.zero;
	}
	
	var words = [];
	for(var idx = 0, max = numbers.length; idx < max; idx++){				
		words.unshift( this._getTrio( this.tokenize( numbers[idx], 1 ), idx, max));	
	}
	
	return words.join("");								
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the French language.
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.FR_FR.prototype._getTrio = function( numbers, index, max){																				
	var hundred = '';
	var ten = '';
	var single = '';
	var radix = this._getRadix(numbers, index);
	

	if(numbers[T2W.HUNDRED_INDEX]){
		hundred = numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] 
			? this._getOnes( numbers[ T2W.HUNDRED_INDEX ] ) + " " + T2W.FR_FR.DICTIONARY.hundred + " "
			: this._getOnes( numbers[ T2W.HUNDRED_INDEX ] ) + " " + T2W.FR_FR.DICTIONARY.hundred;
	}

	if(numbers[T2W.HUNDRED_INDEX] == 1){
		hundred = numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] 
			? T2W.FR_FR.DICTIONARY.hundred + ' '
			: T2W.FR_FR.DICTIONARY.hundred;
	}

	if(numbers[T2W.HUNDRED_INDEX] == 1 && numbers[T2W.TEN_INDEX] == 0 && numbers[T2W.SINGLE_INDEX] == 1){
		hundred = numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] 
			? T2W.FR_FR.DICTIONARY.hundred + T2W.FR_FR.DICTIONARY.delimiters[2]
			: T2W.FR_FR.DICTIONARY.hundred;
	}
	
	if( numbers[ T2W.TEN_INDEX ] ){			
		ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);			
	}
						
	if( numbers[ T2W.TEN_INDEX ] >=2 ){
		ten = numbers[T2W.SINGLE_INDEX] 
			? this._getTens( numbers[T2W.TEN_INDEX]) + T2W.FR_FR.DICTIONARY.delimiters[0] + this._getOnes( numbers[T2W.SINGLE_INDEX]) 
			: this._getTens( numbers[T2W.TEN_INDEX]); 	
	}
						
	if( numbers[ T2W.TEN_INDEX ] >=2 && numbers[ T2W.SINGLE_INDEX ] ==1 ){
		ten = this._getTens( numbers[T2W.TEN_INDEX]) + T2W.FR_FR.DICTIONARY.delimiters[2] + this._getOnes( numbers[T2W.SINGLE_INDEX]);
	}
			
							
	if( !numbers[ T2W.TEN_INDEX ] ){
		single = this._getOnes( numbers[T2W.SINGLE_INDEX]);
	}
				
	if(index+1 < max && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]) ){
		hundred = ' ' + hundred;
	}
	
	if( index === 0 && index+2 < max && !numbers[ T2W.HUNDRED_INDEX ] && (numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] )){
		hundred	 = ' ';		
	}

	if( index === 1 && numbers[T2W.TEN_INDEX] == undefined && numbers[T2W.SINGLE_INDEX] === 1 )
	{
		return radix;
	}
	else							
		return hundred + ten + single + radix;		
};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} index
 * @return {string}
 */
T2W.FR_FR.prototype._getOnes = function( number) {			
	return T2W.FR_FR.DICTIONARY.ones[ number ];			
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.FR_FR.prototype._getTens = function( number ) {	
	return T2W.FR_FR.DICTIONARY.tens[ number ];				
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.FR_FR.prototype._getTeens = function(number ){
	return T2W.FR_FR.DICTIONARY.teens[ number ];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.FR_FR.prototype._getRadix = function( numbers, index ) {	
	var radix = '';
	if( index > 0 && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]))
		radix = ' ' + T2W.FR_FR.DICTIONARY.radix[ index ];			
	
	if( index === 1 && numbers[T2W.TEN_INDEX] == undefined && numbers[T2W.SINGLE_INDEX] === 1 )
		radix = T2W.FR_FR.DICTIONARY.radix[ index ];			
	
	if( index === 2 && ( numbers[T2W.TEN_INDEX] > 0 || numbers[T2W.SINGLE_INDEX] > 1 ) )
		radix = radix + 's';

	return radix;
};

/**
 * id_ID locale
 * @constructor
 */
T2W.ID_ID = function(){};

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.ID_ID.DICTIONARY = {
	zero		:"nol",
	ones		:[ "", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan" ],
	teens		:[ "sepuluh", "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas", "enam belas", "tujuh belas", "delapan belas", "sembilan belas" ],
	tens		:[ "", "", "dua puluh", "tiga puluh", "empat puluh", "lima puluh", "enam puluh", "tujuh puluh", "delapan puluh", "sembilan puluh" ],
	hundred		:"ratus",
	radix		:["", "ribu", "juta"],
	delimiters	:[" ", '']
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.ID_ID.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.ID_ID.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.ID_ID.prototype.translate = function( numbers ) {	
	
	// Check max value	
	if(numbers.length * T2W.ID_ID.TOKEN_LENGTH > T2W.ID_ID.MAX_NUMBERS){
		throw {
			name : "Error",
			message : "The length of numbers is longer than the maximum value(" + T2W.ID_ID.MAX_NUMBERS + ")."		
		};	
	}		
	
	// Deal with zero value	
	if(numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1){
		return T2W.ID_ID.DICTIONARY.zero;
	}
	
	var words = [];
	for(var idx = 0, max = numbers.length; idx < max; idx++){				
		words.unshift( this._getTrio( this.tokenize( numbers[idx], 1 ), idx, max));	
	}
	
	return words.join("");								
};

/**
 * Converts first three numbers to words.
 * @private
 * It solves exceptions in the English language.
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.ID_ID.prototype._getTrio = function( numbers, index, max){																				
	var hundred = '';
	var ten = '';
	var single = '';
	var radix = this._getRadix(numbers, index);
	
	if(numbers[T2W.HUNDRED_INDEX]){
        hundredPrefix = numbers[T2W.HUNDRED_INDEX] > 1 ? this._getOnes( numbers[ T2W.HUNDRED_INDEX ] ) + " " : "se";

		hundred = numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] 
			? hundredPrefix + T2W.ID_ID.DICTIONARY.hundred + ' '
			: hundredPrefix + T2W.ID_ID.DICTIONARY.hundred;
	}
	
	if( numbers[ T2W.TEN_INDEX ] ){			
		ten = this._getTeens( numbers[T2W.SINGLE_INDEX]);			
	}
						
	if( numbers[ T2W.TEN_INDEX ] >=2 ){
		ten = numbers[T2W.SINGLE_INDEX] 
			? this._getTens( numbers[T2W.TEN_INDEX]) + T2W.ID_ID.DICTIONARY.delimiters[0] + this._getOnes( numbers[T2W.SINGLE_INDEX]) 
			: this._getTens( numbers[T2W.TEN_INDEX]); 	
	}
							
	if( !numbers[ T2W.TEN_INDEX ] ){
        if (index == max-1 && max == 2) {
			if (numbers[T2W.SINGLE_INDEX] == 1) {
				single = 'se';
				radix = radix.replace(' ', '');
			}
			else single = this._getOnes( numbers[T2W.SINGLE_INDEX]);
		} else {
			single = this._getOnes( numbers[T2W.SINGLE_INDEX]);
		}
	}
				
	if(index+1 < max && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]) ){
		hundred = ' ' + hundred;
	}
	
	if( index === 0 && index+1 < max && !numbers[ T2W.HUNDRED_INDEX ] && (numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX] )){
		hundred	 = ' ';		
	}
								
	return hundred + ten + single + radix;		
};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @param {number} index
 * @return {string}
 */
T2W.ID_ID.prototype._getOnes = function( number) {			
	return T2W.ID_ID.DICTIONARY.ones[ number ];			
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.ID_ID.prototype._getTens = function( number ) {		
	return T2W.ID_ID.DICTIONARY.tens[ number ];				
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.ID_ID.prototype._getTeens = function(number ){
	return T2W.ID_ID.DICTIONARY.teens[ number ];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.ID_ID.prototype._getRadix = function( numbers, index ) {		
	var radix = '';
	if( index > 0 && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX])){	
		radix = ' ' + T2W.ID_ID.DICTIONARY.radix[ index ];			
	}
			
	return radix;
};
/**
 * it_IT locale
 * @constructor
 */
T2W.IT_IT = function () { };

/**
 * Translator dictionary
 * @constant
 * @type {Object}
 */
T2W.IT_IT.DICTIONARY = {
    zero: "zero",
    ones: ["", ["uno", "", "un"], "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove"],
    teens: ["dieci", "undici", "dodici", "tredici", "quattordici", "quindici", "sedici", "diciassette", "diciotto", "diciannove"],
    tens: ["", "", ["venti", "vent"], ["trenta", "trent"], ["quaranta", "quarant"], ["cinquanta", "cinquant"], ["sessanta", "sessant"], ["settanta", "settant"], ["ottanta", "ottant"], ["novanta", "novant"]],
    hundred: "cento",
    radix: ["", ["mille", "mila"], ["milione", "milioni"]]
};

/**
 * Token length
 * @constant
 * @type {number}
 */
T2W.IT_IT.TOKEN_LENGTH = 3;

/**
 * Max numbers for this locale
 * @constant
 * @type {number}
 */
T2W.IT_IT.MAX_NUMBERS = 9;

/**
 * Translate numbers to words
 * @public
 * @param {array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.IT_IT.prototype.translate = function (numbers) {

    // Check max value
    if (numbers.length * T2W.IT_IT.TOKEN_LENGTH > T2W.IT_IT.MAX_NUMBERS) {
        throw {
            name: "Error",
            message: "The length of numbers is longer than the maximum value(" + T2W.IT_IT.MAX_NUMBERS + ")."
        };
    }

    // Deal with zero value
    if (numbers[T2W.SINGLE_INDEX] === 0 && numbers.length === 1) {
        return T2W.IT_IT.DICTIONARY.zero;
    }

    var words = [];
    for (var idx = 0, max = numbers.length; idx < max; idx++) {
        words.unshift(this._getTrio(this.tokenize(numbers[idx], 1), idx, max, words));
    }

    return words.join("");
};

/**
 * Converts first three numbers to words.
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @param {number} max - length of tokens
 * @return {string}
 */
T2W.IT_IT.prototype._getTrio = function (numbers, index, max, formerWords) {
    var hundred = "";
    var ten = "";
    var single = "";
    var radix = this._getRadix(numbers, index);
    var result = "";

    if (numbers[T2W.HUNDRED_INDEX]) {
        hundred = this._getOnes(numbers[T2W.HUNDRED_INDEX], index, numbers[T2W.TEN_INDEX], false) + T2W.IT_IT.DICTIONARY.hundred;
    }

    if (numbers[T2W.TEN_INDEX]) {
        ten = this._getTeens(numbers[T2W.SINGLE_INDEX]);
    }

    if (numbers[T2W.TEN_INDEX] >= 2) {
        ten = numbers[T2W.SINGLE_INDEX]
            ? this._getTens(numbers[T2W.TEN_INDEX], numbers[T2W.SINGLE_INDEX]) + this._getOnes(numbers[T2W.SINGLE_INDEX])
            : this._getTens(numbers[T2W.TEN_INDEX]);
    }

    if (!numbers[T2W.TEN_INDEX]) {
        single = this._getOnes(numbers[T2W.SINGLE_INDEX], index, numbers[T2W.TEN_INDEX], true);
    }

    if (index >= 2) {
        single += " ";
    }

    result = hundred + ten + single + radix;

    if (index > 1 && formerWords.join("").length > 0) {
        result += " e ";
    }

    return result;
};

/**
 * Get ones
 * helper method to access the dictionary
 * @private
 * It solves exceptions in the Italian language.
 * @param {number} number
 * @param {number} index
 * @param {boolean} isSingle
 * @return {string}
 */
T2W.IT_IT.prototype._getOnes = function (number, index, tensOfNumber, isSingle) {
    if (number === 1) {
        if (index === 0 && isSingle) {
            return T2W.IT_IT.DICTIONARY.ones[number][0];
        } else if (index === 0) {
            return T2W.IT_IT.DICTIONARY.ones[number][1];
        }

        if (index === 1) {
            return T2W.IT_IT.DICTIONARY.ones[number][1];
        }

        if (index >= 2 && isSingle && tensOfNumber === undefined) {
            return T2W.IT_IT.DICTIONARY.ones[number][2];
        }

        return T2W.IT_IT.DICTIONARY.ones[number][0];
    }
    return T2W.IT_IT.DICTIONARY.ones[number];
};

/**
 * Get tens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.IT_IT.prototype._getTens = function (number, unit) {
    if (unit === 1 || unit == 8) {
        return T2W.IT_IT.DICTIONARY.tens[number][1];
    }
    return T2W.IT_IT.DICTIONARY.tens[number][0];
};

/**
 * Get teens
 * helper method to access the dictionary
 * @private
 * @param {number} number
 * @return {string}
 */
T2W.IT_IT.prototype._getTeens = function (number) {
    return T2W.IT_IT.DICTIONARY.teens[number];
};

/**
 * Get radix
 * convert radix to words
 * @private
 * @param {Array} numbers
 * @param {number} index
 * @return {string}
 */
T2W.IT_IT.prototype._getRadix = function (numbers, index) {
    var radix = "";

    if (index > 0 && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX])) {
        if (index === 1 && numbers.length === 1 && numbers[T2W.SINGLE_INDEX] === 1) {
            radix = T2W.IT_IT.DICTIONARY.radix[index][0];
        } else if (index === 1) {
            radix = T2W.IT_IT.DICTIONARY.radix[index][1];
        }

        if (index > 1 && numbers.length === 1 && numbers[T2W.SINGLE_INDEX] === 1) {
            radix = T2W.IT_IT.DICTIONARY.radix[index][0];
        } else if (index > 1) {
            radix = T2W.IT_IT.DICTIONARY.radix[index][1];
        }
    }

    return radix;
};

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
    radix           : ["", "duizend", "miljoen"],
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
            // En néerlandais: "drieëntwintig" -> "drieentwintig" (sans ë pour simplifier)
            ten = this._getOnes( numbers[T2W.SINGLE_INDEX] ) + T2W.NL_NL.DICTIONARY.delimiters[1] + this._getTens( numbers[T2W.TEN_INDEX]);
        } else {
            ten = this._getTens( numbers[T2W.TEN_INDEX]);
        }
    }
    
    if( !numbers[ T2W.TEN_INDEX ] ){
        single = this._getOnes( numbers[T2W.SINGLE_INDEX]);
    }
    
    var result = hundred + ten + single + radix;
    
    // Cas spécial pour "duizend" (un mille = duizend, pas "een duizend")
    if( index === 1 && numbers[T2W.TEN_INDEX] === undefined && numbers[T2W.SINGLE_INDEX] === 1 && !numbers[T2W.HUNDRED_INDEX] ){
        return radix;
    }
    
    // En néerlandais : logique spéciale pour les espaces
    if(index+1 < max && (numbers[T2W.HUNDRED_INDEX] || numbers[T2W.TEN_INDEX] || numbers[T2W.SINGLE_INDEX]) ){
        if( index === 0 ){
            // Unités : espace avant seulement si pas milliers directs
            result = ' ' + result;
        } else if( index === 1 ){
            // Milliers : espace avant SEULEMENT s'il y a des millions
            if( max > 2 ){
                result = ' ' + result;
            }
        } else if( index === 2 ){
            // Millions : espace avant
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
            // Milliers : pas d'espace avant "duizend"
            radix = T2W.NL_NL.DICTIONARY.radix[ index ];
        }
        
        if( index === 2 ){
            // Millions : espace avant "miljoen" 
            radix = ' ' + T2W.NL_NL.DICTIONARY.radix[index];
        }
    }
    
    return radix;
};
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
                ? T2W.PT_BR.DICTIONARY.hundred[1]  // "cento"
                : T2W.PT_BR.DICTIONARY.hundred[0]; // "cem"
        } else {
            hundred = this._getOnes( numbers[T2W.HUNDRED_INDEX], index, false ) + ' ' + T2W.PT_BR.DICTIONARY.hundred[1];
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
            // Calculer le total pour cette section de 3 chiffres
            var total = (numbers[T2W.HUNDRED_INDEX] || 0) * 100 + (numbers[T2W.TEN_INDEX] || 0) * 10 + (numbers[T2W.SINGLE_INDEX] || 0);
            if( total === 1 ){
                radix = ' ' + T2W.PT_BR.DICTIONARY.radix[index][0]; // "milhão"
            } else {
                radix = ' ' + T2W.PT_BR.DICTIONARY.radix[index][1]; // "milhões"
            }
        }
    }
    
    return radix;
};
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
// Node exports
if(typeof module !== 'undefined' && module.exports){
	module.exports = T2W;
}
