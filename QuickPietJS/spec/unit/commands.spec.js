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
end