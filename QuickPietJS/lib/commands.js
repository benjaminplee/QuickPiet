Commands = {
	push : function(stack, args) {
		if(!args || args.length == 0 || args.match(/[^0-9\s]/)) {
			throw new SyntaxError("Invalid PUSH argument(s)")	
		}
		
		jQuery.each(args.split(' '), function(index, value) {
			stack.push(parseInt(value))
		})
	},
	
	pop : function(stack, args) {
		if(stack.length == 0) {
			throw new SyntaxError("Invalid POP on empty stack")	
		}
		
		var pops_count = 1
		
		if(args && args.length > 0) {
			args = jQuery.trim(args)
			
			if(args.length == 0 || args.match(/[^0-9\s]/) || parseInt(args) == NaN) {
				throw new SyntaxError("Invalid POP argument")	
			}
			else {
				pops_count = parseInt(args)	
			}
		}

		for(var i = 0; i < pops_count; i++) {
			stack.pop()
		}
	}
}