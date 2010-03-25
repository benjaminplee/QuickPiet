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
		var pops_count = 1
		
		if(args && args.length > 0) {
			args = jQuery.trim(args)
			
			if(args.length == 0 || args.match(/[^0-9\s]/) || parseInt(args) == NaN) {
				throw new SyntaxError('Invalid POP argument(s)')	
			}
			else {
				pops_count = parseInt(args)	
			}
		}
		
		if(pops_count > stack.length) {
			throw new EvalError('Can not POP from empty stack')
		}

		for(var i = 0; i < pops_count; i++) {
			stack.pop()
		}
	},
	
	duplicate : function(stack, args) {
		this._enforce_non_empty_stack(stack, 'DUPLICATE')
		
		var val = stack.pop()
		stack.push(val)
		stack.push(val)
	},
	
	add : function(stack) {
		this._enforce_non_empty_stack(stack, 'ADD')
		
		stack.push(stack.pop() + stack.pop())
	},

	_enforce_non_empty_stack : function(stack, method_name) {
		if(stack.length == 0) {
			throw new EvalError('Can not ' + method_name + ' from empty stack')
		}
	}
}