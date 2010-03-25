describe 'Commands'
	before_each
		stack = []
	end

	describe 'push'
		it 'should push a single integer onto an empty stack'
			Commands.push(stack, '14')
			
			stack.should.eql [14]
		end
		
		it 'should push multiple integers onto an empty stack'
			Commands.push(stack, '100 0 1')
			
			stack.should.eql [100, 0, 1]
		end
		
		it 'should push multiple integers onto a non-empty stack'
			stack.push(1)
			stack.push(2)
			
			Commands.push(stack, '3 4')
			
			stack.should.eql [1, 2, 3, 4]
		end
		
		it 'should return undefined'
			Commands.push(stack, '1').should.eql undefined
		end
		
		it 'should error if missing arguments'
			-{ Commands.push(stack) }.should.throw_error SyntaxError, 'Invalid PUSH argument(s)'
		end
		
		it 'should error on negative integers'
			-{ Commands.push(stack, '-1') }.should.throw_error SyntaxError, 'Invalid PUSH argument(s)'
		end

		it 'should error if commas are included'
			-{ Commands.push(stack, '5,10') }.should.throw_error SyntaxError, 'Invalid PUSH argument(s)'
		end
		
		it 'should error if decimals are included'
			-{ Commands.push(stack, '2.5') }.should.throw_error SyntaxError, 'Invalid PUSH argument(s)'
		end
		
		it 'should error if no arguments are included'
			-{ Commands.push(stack, '') }.should.throw_error SyntaxError, 'Invalid PUSH argument(s)'
		end
		
		it 'should error if values are non-numeric'
			-{ Commands.push(stack, 'dog') }.should.throw_error SyntaxError, 'Invalid PUSH argument(s)'
		end
	end
	
	describe 'pop'
		it 'should discard top value on stack'
			stack.push(4)
			
			stack.should.eql [4]
			
			Commands.pop(stack)
			
			stack.should.eql []
		end
		
		it 'should discard top X values from stack if positive integer is given'
			stack.push(1)
			stack.push(2)
			stack.push(3)
			
			Commands.pop(stack, '2')
			
			stack.should.eql [1]
		end
		
		it 'should error if argument is not a single positive numeric value'
			stack.push(10)
			
			-{ Commands.pop(stack, 'a') }.should.throw_error SyntaxError, 'Invalid POP argument'
			-{ Commands.pop(stack, '5.6') }.should.throw_error SyntaxError, 'Invalid POP argument'
			-{ Commands.pop(stack, '-1') }.should.throw_error SyntaxError, 'Invalid POP argument'
		end
		
		it 'should error if pop is called on an empty stack'
			-{ Commands.pop(stack)}.should.throw_error SyntaxError, 'Invalid POP on empty stack'
		end
		
		it 'should return undefined'
			stack.push(100)
		
			Commands.pop(stack).should.eql undefined
		end
	end
end