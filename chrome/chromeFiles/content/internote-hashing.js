/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 1.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Code also contributed by Greg Holt
 * See http://pajhome.org.uk/site/legal.html for details.
 */

var internoteHashFunctions = {

	hash_safe_add : function(x, y)
	{
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return (msw << 16) | (lsw & 0xFFFF);
	},

	hash_rol : function(num, cnt)
	{
	  return (num << cnt) | (num >>> (32 - cnt));
	},

	hash_cmn : function(q, a, b, x, s, t)
	{
	  return this.hash_safe_add(this.hash_rol(this.hash_safe_add(this.hash_safe_add(a, q), this.hash_safe_add(x, t)), s), b);
	},
	
	hash_ff : function(a, b, c, d, x, s, t)
	{
	  return this.hash_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	},
	
	hash_gg : function(a, b, c, d, x, s, t)
	{
	  return this.hash_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	},
	
	hash_hh : function(a, b, c, d, x, s, t)
	{
	  return this.hash_cmn(b ^ c ^ d, a, b, x, s, t);
	},
	
	hash_ii : function(a, b, c, d, x, s, t)
	{
	  return this.hash_cmn(c ^ (b | (~d)), a, b, x, s, t);
	},

	hash_coreMD5 : function(x)
	{
	  var a =  1732584193;
	  var b = -271733879;
	  var c = -1732584194;
	  var d =  271733878;
	
	  for(var i = 0; i < x.length; i += 16)
	  {
	    var olda = a;
	    var oldb = b;
	    var oldc = c;
	    var oldd = d;
	
	    a = this.hash_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
	    d = this.hash_ff(d, a, b, c, x[i+ 1], 12, -389564586);
	    c = this.hash_ff(c, d, a, b, x[i+ 2], 17,  606105819);
	    b = this.hash_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
	    a = this.hash_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
	    d = this.hash_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
	    c = this.hash_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
	    b = this.hash_ff(b, c, d, a, x[i+ 7], 22, -45705983);
	    a = this.hash_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
	    d = this.hash_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
	    c = this.hash_ff(c, d, a, b, x[i+10], 17, -42063);
	    b = this.hash_ff(b, c, d, a, x[i+11], 22, -1990404162);
	    a = this.hash_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
	    d = this.hash_ff(d, a, b, c, x[i+13], 12, -40341101);
	    c = this.hash_ff(c, d, a, b, x[i+14], 17, -1502002290);
	    b = this.hash_ff(b, c, d, a, x[i+15], 22,  1236535329);
	
	    a = this.hash_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
	    d = this.hash_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
	    c = this.hash_gg(c, d, a, b, x[i+11], 14,  643717713);
	    b = this.hash_gg(b, c, d, a, x[i+ 0], 20, -373897302);
	    a = this.hash_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
	    d = this.hash_gg(d, a, b, c, x[i+10], 9 ,  38016083);
	    c = this.hash_gg(c, d, a, b, x[i+15], 14, -660478335);
	    b = this.hash_gg(b, c, d, a, x[i+ 4], 20, -405537848);
	    a = this.hash_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
	    d = this.hash_gg(d, a, b, c, x[i+14], 9 , -1019803690);
	    c = this.hash_gg(c, d, a, b, x[i+ 3], 14, -187363961);
	    b = this.hash_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
	    a = this.hash_gg(a, b, c, d, x[i+13], 5 , -1444681467);
	    d = this.hash_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
	    c = this.hash_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
	    b = this.hash_gg(b, c, d, a, x[i+12], 20, -1926607734);
	
	    a = this.hash_hh(a, b, c, d, x[i+ 5], 4 , -378558);
	    d = this.hash_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
	    c = this.hash_hh(c, d, a, b, x[i+11], 16,  1839030562);
	    b = this.hash_hh(b, c, d, a, x[i+14], 23, -35309556);
	    a = this.hash_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
	    d = this.hash_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
	    c = this.hash_hh(c, d, a, b, x[i+ 7], 16, -155497632);
	    b = this.hash_hh(b, c, d, a, x[i+10], 23, -1094730640);
	    a = this.hash_hh(a, b, c, d, x[i+13], 4 ,  681279174);
	    d = this.hash_hh(d, a, b, c, x[i+ 0], 11, -358537222);
	    c = this.hash_hh(c, d, a, b, x[i+ 3], 16, -722521979);
	    b = this.hash_hh(b, c, d, a, x[i+ 6], 23,  76029189);
	    a = this.hash_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
	    d = this.hash_hh(d, a, b, c, x[i+12], 11, -421815835);
	    c = this.hash_hh(c, d, a, b, x[i+15], 16,  530742520);
	    b = this.hash_hh(b, c, d, a, x[i+ 2], 23, -995338651);
	
	    a = this.hash_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
	    d = this.hash_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
	    c = this.hash_ii(c, d, a, b, x[i+14], 15, -1416354905);
	    b = this.hash_ii(b, c, d, a, x[i+ 5], 21, -57434055);
	    a = this.hash_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
	    d = this.hash_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
	    c = this.hash_ii(c, d, a, b, x[i+10], 15, -1051523);
	    b = this.hash_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
	    a = this.hash_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
	    d = this.hash_ii(d, a, b, c, x[i+15], 10, -30611744);
	    c = this.hash_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
	    b = this.hash_ii(b, c, d, a, x[i+13], 21,  1309151649);
	    a = this.hash_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
	    d = this.hash_ii(d, a, b, c, x[i+11], 10, -1120210379);
	    c = this.hash_ii(c, d, a, b, x[i+ 2], 15,  718787259);
	    b = this.hash_ii(b, c, d, a, x[i+ 9], 21, -343485551);
	
	    a = this.hash_safe_add(a, olda);
	    b = this.hash_safe_add(b, oldb);
	    c = this.hash_safe_add(c, oldc);
	    d = this.hash_safe_add(d, oldd);
	  }
	  
	  return [a, b, c, d];
	},
	
	/*
	 * Convert an array of little-endian words to a hex string.
	 */
	hash_binl2hex : function(binarray)
	{
	  var hex_tab = "0123456789abcdef";
	  var str = "";
	  for(var i = 0; i < binarray.length * 4; i++)
	  {
	    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
	           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8)) & 0xF);
	  }
	  return str;
	},
	
	/*
	 * Convert an 8-bit character string to a sequence of 16-word blocks, stored
	 * as an array, and append appropriate padding for MD4/5 calculation.
	 * If any of the characters are >255, the high byte is silently ignored.
	 */
	hash_str2binl : function(str)
	{
	  var nblk = ((str.length + 8) >> 6) + 1;
	  var blks = new Array(nblk * 16);
	  for(var i = 0; i < nblk * 16; i++) blks[i] = 0;
	  for(var i = 0; i < str.length; i++)
	    blks[i>>2] |= (str.charCodeAt(i) & 0xFF) << ((i%4) * 8);
	  blks[i>>2] |= 0x80 << ((i%4) * 8);
	  blks[nblk*16-2] = str.length * 8;
	  return blks;
	},
	
	
	/*
	 * External interface
	 */
	hash_hexMD5 : function(str) { return this.hash_binl2hex(this.hash_coreMD5( this.hash_str2binl(str))); }
};
