Commands = {
	push : function(stack, args) {
		if(!args || args.length == 0 || args.match(/[^0-9\s]/)) {
			throw new SyntaxError("Invalid PUSH argument(s)")	
		}
		
		jQuery.each(args.split(' '), function(index, value) {
			stack.push(parseInt(value))
		})
	}	
}
