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
		before_each
		  stack.push(10)
		end
	
		it 'should discard top value on stack'
			stack.should.eql [10]
			
			Commands.pop(stack)
			
			stack.should.eql []
		end
		
		it 'should discard top X values from stack if positive integer is given'
			stack.push(20)
			stack.push(30)
			
			Commands.pop(stack, '2')
			
			stack.should.eql [10]
		end
		
		it 'should error if argument is not a single positive numeric value'
			-{ Commands.pop(stack, 'a') }.should.throw_error SyntaxError, 'Invalid POP argument(s)'
			-{ Commands.pop(stack, '5.6') }.should.throw_error SyntaxError, 'Invalid POP argument(s)'
			-{ Commands.pop(stack, '-1') }.should.throw_error SyntaxError, 'Invalid POP argument(s)'
		end
		
		it 'should error if pop is called on an empty stack'
			stack.pop()
			-{ Commands.pop(stack) }.should.throw_error EvalError, 'Can not POP from empty stack'
		end
		
		it 'should error if multiple pops are more than stack height'
		  stack.push(200)
		  stack.push(200)
		  stack.push(200)
		  
		  -{ Commands.pop(stack, '5') }.should.throw_error EvalError, 'Can not POP from empty stack'
		end
		
		it 'should return undefined'
			Commands.pop(stack).should.eql undefined
		end
	end
	
	describe 'duplicate'
		it 'should push copy of top value'
		  stack.push(1)
		  stack.push(2)
		  
		  stack.should.eql [1,2]
		  
		  Commands.duplicate(stack)
		  
		  stack.should.eql [1,2,2]
		end
		
		it 'should error if stack is empty'
		  -{ Commands.duplicate(stack) }.should.throw_error EvalError, 'Can not DUPLICATE from empty stack'
		end
				
		it 'should return undefined'
		  stack.push(100)
		  
		  Commands.duplicate(stack).should.eql undefined
		end
	end
	
	describe 'roll'
	
	end
	
	describe 'in'
	  
	end
	
	describe 'out'
	  
	end
	
	describe 'add'
	  before_each
	  	stack.push(100)
	    stack.push(5)
	    stack.push(10)
	  end
	  
	  it 'should pop top 2 values and push result of their addition'
	    Commands.add(stack)
	    
	    stack.should.eql [100, 15]
	  end

		it 'should error if the stack is empty'
		  stack = []
		  
		  -{ Commands.add(stack) }.should.throw_error EvalError, 'Can not ADD from empty stack'
		end

	  it 'should return undefined'
	    Commands.add(stack).should.eql undefined
	  end
	end
	
	describe 'subtract'
	  before_each
	  	stack.push(10)
	    stack.push(200)
	    stack.push(30)
	  end
	  
	  it 'should pop top 2 values and push result of their subtraction (second top - top)'
	    Commands.subtract(stack)
	    
	    stack.should.eql [10, 170]
	  end

		it 'should error if the stack is empty'
		  stack = []
		  
		  -{ Commands.subtract(stack) }.should.throw_error EvalError, 'Can not SUBTRACT from empty stack'
		end

	  it 'should return undefined'
	    Commands.subtract(stack).should.eql undefined
	  end
	end
	
	describe 'multiply'
	  before_each
	  	stack.push(10)
	    stack.push(200)
	    stack.push(30)
	  end
	  
	  it 'should pop top 2 values and push result of their multiplication'
	    Commands.multiply(stack)
	    
	    stack.should.eql [10, 6000]
	  end

		it 'should error if the stack is empty'
		  stack = []
		  
		  -{ Commands.multiply(stack) }.should.throw_error EvalError, 'Can not MULTIPLY from empty stack'
		end

	  it 'should return undefined'
	    Commands.multiply(stack).should.eql undefined
	  end
	end
	
	describe 'divide'
	  before_each
	  	stack.push(10)
	    stack.push(200)
	    stack.push(50)
	  end
	  
	  it 'should pop top 2 values and push result of their division (second top / top)'
	    Commands.divide(stack)
	    
	    stack.should.eql [10, 4]
	  end
	  
	  it 'should perform integer division (drop decimal)'
	    stack.push(26)
	    
	    // 50/26 = 1.92... = 1
	    Commands.divide(stack)
	    
	    stack.should.eql [10, 200, 1]
	  end

		it 'should error if the stack is empty'
		  stack = []
		  
		  -{ Commands.divide(stack) }.should.throw_error EvalError, 'Can not DIVIDE from empty stack'
		end

	  it 'should return undefined'
	    Commands.divide(stack).should.eql undefined
	  end
	end
	
	describe 'mod'
	  before_each
	  	stack.push(10)
	    stack.push(200)
	    stack.push(33)
	  end
	  
	  it 'should pop top 2 values and push remainder of their division (second top % top)'
	    Commands.mod(stack)
	    
	    stack.should.eql [10, 2]
	  end
	  
	  it 'should return zero if there is no remainder'
	  	stack.push(11)
	  	
	    Commands.mod(stack)
	    
	    stack.should.eql [10, 200, 0]
	  end

		it 'should error if the stack is empty'
		  stack = []
		  
		  -{ Commands.mod(stack) }.should.throw_error EvalError, 'Can not MOD from empty stack'
		end

	  it 'should return undefined'
	    Commands.mod(stack).should.eql undefined
	  end
	end
	
	describe 'not'
	  it 'should replace top value with 0 if top value was non-zero'
	    stack.push(5)
	    
	    Commands.not(stack)
	    
	    stack.should.eql [0]
	  end
	  
	  it 'should replace top value with 1 if top value was zero'
	    stack.push(0)
	    
	    Commands.not(stack)
	    
	    stack.should.eql [1]
	  end
	  
		it 'should error if the stack is empty'
		  -{ Commands.not(stack) }.should.throw_error EvalError, 'Can not NOT from empty stack'
		end

	  it 'should return undefined'
	  	stack.push(2)
	  	
	    Commands.not(stack).should.eql undefined
	  end
	end
	
	describe 'greater'
	  
	end
	
	describe 'end'
	  
	end
	
	describe 'goto'
	  
	end
	
	describe 'assert'
	  
	end
end